import mongoose from "mongoose";
import Student from "../models/Student.js";
import Registration from "../models/Registration.js";
import AdmitCard from "../models/AdmitCard.js";
import ExamCenter from "../models/ExamCenter.js";
import Result from "../models/Result.js";
import Notice from "../models/Notice.js";
import Gallery from "../models/Gallery.js";
import Setting from "../models/Setting.js";
import Admin from "../models/Admin.js";
import { generateRegistration } from "../utils/generateRegistration.js";
import { generateRoll } from "../utils/generateRoll.js";
import { generateQR } from "../services/qr.service.js";
import { uploadImage } from "../services/upload.service.js";
import { sendRegistrationMail } from "../services/mail.service.js";
import { sendRegistrationWhatsApp } from "../services/whatsapp.service.js";
import ApiError from "../utils/ApiError.js";
import { STUDENT_STATUS } from "../utils/constants.js";
import {
  buildSafeSort,
  escapeRegex,
  parseDateRange,
  parsePagination,
  mapWithConcurrency,
} from "../utils/adminWorkflow.js";

const MAX_PHOTO = 2 * 1024 * 1024;
const MAX_SIGNATURE = 1 * 1024 * 1024;
// The current exam uses the four fixed paper sections exposed by the portal.
const TOTAL_SUBJECTS = 4;
const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};
const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

const assertFileSize = (file, max, label) => {
  if (file && file.size > max) {
    throw new ApiError(400, `${label} must be under ${Math.round(max / 1024 / 1024)} MB`);
  }
};

export const registerStudentService = async (body, files = {}) => {
  if (!body.mobile) throw new ApiError(400, "Mobile is required");

  const existing = await Student.findOne({ mobile: body.mobile });
  if (existing) throw new ApiError(409, "Mobile already registered");

  if (body.email) {
    const emailExists = await Student.findOne({ email: String(body.email).toLowerCase() });
    if (emailExists) throw new ApiError(409, "Email already registered");
  }

  if (!files.photo?.[0]) throw new ApiError(400, "Student photo is required");
  if (!files.signature?.[0]) throw new ApiError(400, "Signature is required");

  assertFileSize(files.photo?.[0], MAX_PHOTO, "Photo");
  assertFileSize(files.signature?.[0], MAX_SIGNATURE, "Signature");
  assertFileSize(files.aadhaarDoc?.[0], MAX_PHOTO, "Aadhaar");
  assertFileSize(files.schoolIdDoc?.[0], MAX_PHOTO, "School ID");

  const registrationNumber = await generateRegistration(body.class || "8");
  const fileUrls = {};

  for (const field of ["photo", "signature", "aadhaarDoc", "schoolIdDoc"]) {
    if (files[field]?.[0]) {
      try {
        const uploaded = await uploadImage(files[field][0], "examportal/students");
        const key =
          field === "aadhaarDoc" ? "aadhaar" : field === "schoolIdDoc" ? "schoolId" : field;
        fileUrls[key] = uploaded.secure_url;
      } catch (err) {
        throw new ApiError(500, `${field} upload failed. Please try again.`);
      }
    }
  }

  const student = await Student.create({
    registrationNumber,
    name: body.name,
    fatherName: body.fatherName,
    motherName: body.motherName,
    mobile: body.mobile,
    parentMobile: body.parentMobile,
    whatsapp: body.whatsapp || body.mobile,
    email: body.email,
    dob: body.dob,
    gender: body.gender,
    category: body.category || "General",
    medium: body.medium || "Hindi",
    class: body.class,
    schoolName: body.schoolName,
    state: body.state || "Bihar",
    district: body.district,
    block: body.block,
    village: body.village,
    pinCode: body.pinCode,
    address: body.address,
    otpVerified: body.otpVerified === true || body.otpVerified === "true",
    status: STUDENT_STATUS.PENDING,
    ...fileUrls,
  });

  let registration;
  try {
    registration = await Registration.create({
      student: student._id,
      registrationDate: new Date(),
      paymentStatus: "Free",
      verified: false,
    });
  } catch (error) {
    await Student.deleteOne({ _id: student._id }).catch(() => {});
    throw error;
  }

  // Notifications (non-blocking)
  Promise.allSettled([
    sendRegistrationMail(student),
    sendRegistrationWhatsApp(student),
  ]).catch(() => {});

  return { student, registration, registrationNumber: student.registrationNumber };
};

export const buildStudentFilter = async ({
  search,
  class: cls,
  status,
  dateFrom,
  dateTo,
  centre,
  center,
}) => {
  const query = { ...parseDateRange(dateFrom, dateTo) };
  if (status) {
    if (!Object.values(STUDENT_STATUS).includes(status)) {
      throw new ApiError(400, "Invalid student status");
    }
    query.status = status;
  }
  if (cls) {
    if (!["7", "8", "9", "10"].includes(String(cls))) {
      throw new ApiError(400, "Invalid class");
    }
    query.class = String(cls);
  }
  if (search) {
    const safe = escapeRegex(String(search).trim().slice(0, 100));
    const regex = new RegExp(safe, "i");
    query.$or = [
      { name: regex },
      { mobile: regex },
      { email: regex },
      { registrationNumber: regex },
      { rollNumber: regex },
    ];
  }

  const centreValue = centre || center;
  if (centreValue) {
    const safe = new RegExp(`^${escapeRegex(centreValue)}$`, "i");
    const centerTerms = [{ centerCode: safe }, { centerName: safe }];
    if (mongoose.isValidObjectId(centreValue)) centerTerms.push({ _id: centreValue });
    const centers = await ExamCenter.find({ $or: centerTerms }).select("_id");
    const admits = await AdmitCard.find({
      examCenter: { $in: centers.map((item) => item._id) },
    }).select("student");
    query._id = { $in: admits.map((item) => item.student) };
  }
  return query;
};

export const listStudents = async (filters = {}) => {
  const query = await buildStudentFilter(filters);
  const pagination = parsePagination(filters.page, filters.limit);
  const sortObj = buildSafeSort(filters.sort);
  const [items, total] = await Promise.all([
    Student.find(query)
      .sort(sortObj)
      .skip(pagination.skip)
      .limit(pagination.limit),
    Student.countDocuments(query),
  ]);

  return {
    items,
    pagination: {
      total,
      page: pagination.page,
      limit: pagination.limit,
      pages: Math.ceil(total / pagination.limit),
    },
  };
};

export const getDashboardStats = async () => {
  const [
    totalStudents,
    pendingStudents,
    approvedStudents,
    rejectedStudents,
    registrationsToday,
    registrationsLast7Days,
    totalAdmitCards,
    totalResults,
    publishedResults,
    totalNotices,
    totalGallery,
    totalCenters,
    totalAdmins,
    approvedWithoutAdmitRows,
  ] = await Promise.all([
    Student.countDocuments(),
    Student.countDocuments({ status: STUDENT_STATUS.PENDING }),
    Student.countDocuments({ status: STUDENT_STATUS.APPROVED }),
    Student.countDocuments({ status: STUDENT_STATUS.REJECTED }),
    Student.countDocuments({ createdAt: { $gte: startOfToday() } }),
    Student.countDocuments({ createdAt: { $gte: daysAgo(7) } }),
    AdmitCard.countDocuments(),
    Result.countDocuments(),
    Result.countDocuments({ published: true }),
    Notice.countDocuments({ published: true }),
    Gallery.countDocuments({ isPublished: true }),
    ExamCenter.countDocuments({ isActive: true }),
    Admin.countDocuments(),
    Student.aggregate([
      { $match: { status: STUDENT_STATUS.APPROVED } },
      {
        $lookup: {
          from: AdmitCard.collection.name,
          localField: "_id",
          foreignField: "student",
          as: "admitCards",
        },
      },
      { $match: { admitCards: { $size: 0 } } },
      { $count: "count" },
    ]),
  ]);
  const approvedWithoutAdmit = approvedWithoutAdmitRows[0]?.count || 0;

  return {
    totalStudents,
    pendingStudents,
    approvedStudents,
    rejectedStudents,
    registrationsToday,
    registrationsLast7Days,
    totalAdmitCards,
    totalResults,
    publishedResults,
    pendingResults: Math.max(0, totalResults - publishedResults),
    approvedWithoutAdmit,
    totalNotices,
    totalGallery,
    totalCenters,
    totalSubjects: TOTAL_SUBJECTS,
    totalAdmins,
    byStatus: {
      Pending: pendingStudents,
      Approved: approvedStudents,
      Rejected: rejectedStudents,
    },
    byClass: await Student.aggregate([
      { $group: { _id: "$class", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
  };
};

export const approveStudent = async (studentId, adminId) => {
  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Student not found");

  student.status = STUDENT_STATUS.APPROVED;
  student.approvedBy = adminId;
  student.approvedAt = new Date();
  student.rejectedBy = undefined;
  student.rejectedAt = undefined;
  student.rejectionReason = undefined;
  if (!student.rollNumber) student.rollNumber = generateRoll();
  await student.save();

  await Registration.findOneAndUpdate({ student: student._id }, { verified: true });
  return student;
};

export const rejectStudent = async (studentId, adminId, reason) => {
  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Student not found");

  student.status = STUDENT_STATUS.REJECTED;
  student.rejectionReason = reason || "Rejected by admin";
  student.rejectedBy = adminId;
  student.rejectedAt = new Date();
  student.approvedBy = undefined;
  student.approvedAt = undefined;
  await student.save();
  await Registration.findOneAndUpdate({ student: student._id }, { verified: false });
  return student;
};

export const restoreStudent = async (studentId) => {
  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Student not found");
  if (student.status !== STUDENT_STATUS.REJECTED) {
    throw new ApiError(409, "Only rejected students can be restored");
  }
  student.status = STUDENT_STATUS.PENDING;
  student.rejectedBy = undefined;
  student.rejectedAt = undefined;
  student.rejectionReason = undefined;
  await student.save();
  await Registration.findOneAndUpdate({ student: student._id }, { verified: false });
  return student;
};

const EDITABLE_STUDENT_FIELDS = new Set([
  "name", "fatherName", "motherName", "dob", "gender", "category", "medium",
  "mobile", "parentMobile", "whatsapp", "email", "class", "schoolName", "state",
  "district", "block", "village", "pinCode", "address", "photo", "signature",
  "aadhaar", "schoolId", "isActive",
]);

export const updateStudentFields = async (studentId, body) => {
  const payload = {};
  for (const [key, value] of Object.entries(body || {})) {
    if (!EDITABLE_STUDENT_FIELDS.has(key)) {
      throw new ApiError(400, `Field is not editable: ${key}`);
    }
    payload[key] = value;
  }
  const student = await Student.findByIdAndUpdate(studentId, payload, {
    new: true,
    runValidators: true,
  });
  if (!student) throw new ApiError(404, "Student not found");
  return student;
};

export const hardDeleteStudent = async (studentId) => {
  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Student not found");
  const [registrations, admits, results] = await Promise.all([
    Registration.deleteMany({ student: student._id }),
    AdmitCard.deleteMany({ student: student._id }),
    Result.deleteMany({ student: student._id }),
  ]);
  await Student.deleteOne({ _id: student._id });
  return {
    studentId: String(student._id),
    deleted: {
      registrations: registrations.deletedCount,
      admitCards: admits.deletedCount,
      results: results.deletedCount,
      students: 1,
    },
  };
};

export const generateAdmitForStudent = async (studentId, adminId, options = {}) => {
  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Student not found");
  if (student.status !== STUDENT_STATUS.APPROVED) {
    throw new ApiError(400, "Student must be approved first");
  }

  let admit = await AdmitCard.findOne({ student: student._id });
  if (admit) return { admitCard: admit, student, alreadyExists: true };

  if (!student.rollNumber) {
    student.rollNumber = generateRoll();
    await student.save();
  }

  const center =
    (options.examCenterId && (await ExamCenter.findById(options.examCenterId))) ||
    (await ExamCenter.findOne({ isActive: true }));

  const qrPayload = JSON.stringify({
    reg: student.registrationNumber,
    roll: student.rollNumber,
    name: student.name,
  });
  const qrCode = await generateQR(qrPayload);

  const classNum = Number(String(student.class || "").replace(/\D/g, ""));
  const isSenior = classNum >= 9;
  const defaultExamTime = isSenior
    ? "10:00 AM – 11:30 AM"
    : "09:00 AM – 10:30 AM";
  const defaultReporting = isSenior ? "09:30 AM" : "08:30 AM";

  admit = await AdmitCard.create({
    student: student._id,
    examCenter: center?._id,
    examDate: options.examDate || new Date("2026-09-05"),
    examTime: options.examTime || defaultExamTime,
    reportingTime:
      options.reportingTime || defaultReporting,
    seatNumber: options.seatNumber,
    roomNumber: options.roomNumber,
    qrCode,
    generatedBy: adminId,
  });

  return { admitCard: admit, student, alreadyExists: false };
};

export const generateAdmitsBulk = async (payload, adminId) => {
  const selected = payload.studentIds;
  let students;
  if (selected !== undefined) {
    if (!Array.isArray(selected) || selected.length === 0 || selected.length > 500) {
      throw new ApiError(400, "studentIds must contain 1 to 500 IDs");
    }
    const uniqueIds = [...new Set(selected.map(String))];
    if (uniqueIds.some((id) => !mongoose.isValidObjectId(id))) {
      throw new ApiError(400, "studentIds contains an invalid ID");
    }
    students = await Student.find({
      _id: { $in: uniqueIds },
      status: STUDENT_STATUS.APPROVED,
    }).select("_id registrationNumber");
  } else if (payload.filters && typeof payload.filters === "object") {
    const filter = await buildStudentFilter({
      ...payload.filters,
      status: STUDENT_STATUS.APPROVED,
    });
    students = await Student.find(filter)
      .sort({ createdAt: 1, _id: 1 })
      .limit(500)
      .select("_id registrationNumber");
  } else {
    throw new ApiError(400, "Provide studentIds or filters");
  }

  const options = {
    examCenterId: payload.examCenterId,
    examDate: payload.examDate,
    examTime: payload.examTime,
    reportingTime: payload.reportingTime,
  };
  let rows = await mapWithConcurrency(students, 5, async (student) => {
    try {
      const generated = await generateAdmitForStudent(student._id, adminId, options);
      return {
        studentId: String(student._id),
        registrationNumber: student.registrationNumber,
        status: generated.alreadyExists ? "existing" : "created",
        admitCardId: String(generated.admitCard._id),
      };
    } catch (error) {
      if (error.code === 11000) {
        const existing = await AdmitCard.findOne({ student: student._id });
        return {
          studentId: String(student._id),
          registrationNumber: student.registrationNumber,
          status: "existing",
          admitCardId: existing ? String(existing._id) : null,
        };
      }
      return {
        studentId: String(student._id),
        registrationNumber: student.registrationNumber,
        status: "failed",
        error: error.message,
      };
    }
  });
  if (Array.isArray(selected)) {
    const found = new Set(students.map((student) => String(student._id)));
    rows = rows.concat(
      [...new Set(selected.map(String))]
        .filter((id) => !found.has(id))
        .map((id) => ({
          studentId: id,
          status: "failed",
          error: "Student not found or not approved",
        }))
    );
  }
  return {
    requested: Array.isArray(selected) ? new Set(selected.map(String)).size : students.length,
    matched: students.length,
    created: rows.filter((row) => row.status === "created").length,
    existing: rows.filter((row) => row.status === "existing").length,
    failed: rows.filter((row) => row.status === "failed").length,
    rows,
    truncated: !selected && students.length === 500,
  };
};

export const getSetting = async () => {
  let setting = await Setting.findOne();
  if (!setting) {
    setting = await Setting.create({});
  }
  return setting;
};

export const updateSetting = async (payload) => {
  let setting = await Setting.findOne();
  if (!setting) setting = await Setting.create(payload);
  else {
    Object.assign(setting, payload);
    await setting.save();
  }
  return setting;
};
