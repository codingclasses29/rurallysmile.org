import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import AdmitCard from "../models/AdmitCard.js";
import Student from "../models/Student.js";
import * as studentService from "../services/student.service.js";
import { createAdmitCardPDF } from "../services/pdf.service.js";

export const generateAdmit = asyncHandler(async (req, res) => {
  const studentId = req.body.studentId || req.body.student;
  const result = await studentService.generateAdmitForStudent(
    studentId,
    req.user._id,
    req.body
  );
  sendSuccess(
    res,
    result.alreadyExists ? 200 : 201,
    result.alreadyExists ? "Admit card already generated" : "Admit card generated",
    result
  );
});

export const generateAdmitsBulk = asyncHandler(async (req, res) => {
  const report = await studentService.generateAdmitsBulk(req.body, req.user._id);
  sendSuccess(res, 200, "Bulk admit generation completed", { report });
});

export const getAdmitByRegistration = asyncHandler(async (req, res) => {
  const { registrationNo } = req.params;
  const { mobile, dob } = req.query;

  const student = await Student.findOne({
    registrationNumber: String(registrationNo).toUpperCase(),
  });
  if (!student) throw new ApiError(404, "Student not found");

  if (mobile && student.mobile !== mobile) {
    throw new ApiError(400, "Mobile number does not match");
  }
  if (dob) {
    const a = new Date(student.dob).toISOString().slice(0, 10);
    const b = new Date(dob).toISOString().slice(0, 10);
    if (a !== b) throw new ApiError(400, "DOB does not match");
  }

  const admitCard = await AdmitCard.findOne({ student: student._id }).populate(
    "examCenter"
  );
  if (!admitCard) throw new ApiError(404, "Admit card not found");

  // Always return official class slot times to the UI
  const classNum = Number(String(student.class || "").replace(/\D/g, ""));
  const isSenior = classNum >= 9;
  admitCard.examTime = isSenior
    ? "10:00 AM – 11:30 AM"
    : "09:00 AM – 10:30 AM";
  admitCard.reportingTime = isSenior ? "09:30 AM" : "08:30 AM";

  admitCard.downloadCount += 1;
  await admitCard.save();

  sendSuccess(res, 200, "Admit card fetched", { admitCard, student });
});

export const downloadAdmit = asyncHandler(async (req, res) => {
  const admitCard = await AdmitCard.findById(req.params.id).populate("examCenter");
  if (!admitCard) throw new ApiError(404, "Admit card not found");

  const student = await Student.findById(admitCard.student);
  if (!student) throw new ApiError(404, "Student not found");

  // Sync official class-wise timing before PDF (English download)
  const classNum = Number(String(student.class || "").replace(/\D/g, ""));
  const isSenior = classNum >= 9;
  admitCard.examTime = isSenior
    ? "10:00 AM – 11:30 AM"
    : "09:00 AM – 10:30 AM";
  admitCard.reportingTime = isSenior ? "09:30 AM" : "08:30 AM";
  await admitCard.save();

  const pdf = await createAdmitCardPDF(student, admitCard);

  admitCard.downloadCount += 1;
  await admitCard.save();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Admit-Card-${student.registrationNumber}.pdf`
  );
  res.send(pdf);
});

/** Public English PDF — same verification as view (reg + optional mobile/dob) */
export const downloadAdmitPublic = asyncHandler(async (req, res) => {
  const { registrationNo } = req.params;
  const { mobile, dob } = req.query;

  const student = await Student.findOne({
    registrationNumber: String(registrationNo).toUpperCase(),
  });
  if (!student) throw new ApiError(404, "Student not found");

  if (mobile && student.mobile !== String(mobile)) {
    throw new ApiError(400, "Mobile number does not match");
  }
  if (dob) {
    const a = new Date(student.dob).toISOString().slice(0, 10);
    const b = new Date(String(dob)).toISOString().slice(0, 10);
    if (a !== b) throw new ApiError(400, "DOB does not match");
  }

  const admitCard = await AdmitCard.findOne({ student: student._id }).populate(
    "examCenter"
  );
  if (!admitCard) throw new ApiError(404, "Admit card not found");

  const classNum = Number(String(student.class || "").replace(/\D/g, ""));
  const isSenior = classNum >= 9;
  admitCard.examTime = isSenior
    ? "10:00 AM – 11:30 AM"
    : "09:00 AM – 10:30 AM";
  admitCard.reportingTime = isSenior ? "09:30 AM" : "08:30 AM";
  await admitCard.save();

  const pdf = await createAdmitCardPDF(student, admitCard);
  admitCard.downloadCount += 1;
  await admitCard.save();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Admit-Card-${student.registrationNumber}.pdf`
  );
  res.send(pdf);
});

export const regenerateAdmit = asyncHandler(async (req, res) => {
  const old = await AdmitCard.findById(req.params.id);
  if (!old) throw new ApiError(404, "Admit card not found");

  await AdmitCard.findByIdAndDelete(old._id);
  const result = await studentService.generateAdmitForStudent(
    old.student,
    req.user._id,
    req.body
  );
  sendSuccess(res, 201, "Admit card regenerated", result);
});

export const listAdmits = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, search } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  let filter = {};
  if (search) {
    const students = await Student.find({
      $or: [
        { name: new RegExp(search, "i") },
        { rollNumber: new RegExp(search, "i") },
        { registrationNumber: new RegExp(search, "i") },
      ],
    }).select("_id");
    filter.student = { $in: students.map((s) => s._id) };
  }

  const [items, total] = await Promise.all([
    AdmitCard.find(filter)
      .populate(
        "student",
        "name fatherName class rollNumber registrationNumber photo schoolName status mobile"
      )
      .populate("examCenter")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    AdmitCard.countDocuments(filter),
  ]);

  const downloads = await AdmitCard.aggregate([
    { $group: { _id: null, total: { $sum: "$downloadCount" } } },
  ]);

  sendSuccess(res, 200, "Admit cards fetched", {
    admits: items,
    stats: {
      total,
      downloads: downloads[0]?.total || 0,
    },
    pagination: { total, page: Number(page), limit: Number(limit) },
  });
});

export const lookupAdmitAdmin = asyncHandler(async (req, res) => {
  const { rollNumber, registrationNumber, studentId } = req.query;
  let student = null;

  if (studentId) {
    student = await Student.findById(studentId);
  } else if (rollNumber) {
    student = await Student.findOne({
      rollNumber: String(rollNumber).toUpperCase().trim(),
    });
  } else if (registrationNumber) {
    student = await Student.findOne({
      registrationNumber: String(registrationNumber).toUpperCase().trim(),
    });
  }

  if (!student) throw new ApiError(404, "Student not found");

  const admitCard = await AdmitCard.findOne({ student: student._id }).populate(
    "examCenter"
  );

  if (admitCard) {
    const classNum = Number(String(student.class || "").replace(/\D/g, ""));
    const isSenior = classNum >= 9;
    admitCard.examTime = isSenior
      ? "10:00 AM – 11:30 AM"
      : "09:00 AM – 10:30 AM";
    admitCard.reportingTime = isSenior ? "09:30 AM" : "08:30 AM";
  }

  sendSuccess(res, 200, "Lookup complete", { student, admitCard });
});
