import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import Result from "../models/Result.js";
import Student from "../models/Student.js";
import { createMarksheetPDF } from "../services/pdf.service.js";
import * as sheetImport from "../services/sheetImport.service.js";
import * as resultService from "../services/result.service.js";
import { parsePagination, parseStrictBoolean } from "../utils/adminWorkflow.js";

function parseTotalMarks(body = {}) {
  // Prefer single total / marks (0–100). Ignore subject-wise for admin entry.
  if (body.marks !== undefined || body.total !== undefined) {
    const n = Math.min(100, Math.max(0, Math.round(Number(body.marks ?? body.total) || 0)));
    return { marks: n, total: n, hindi: 0, math: 0, gk: 0, gs: 0 };
  }
  // Legacy: if only subjects sent, sum them (capped at 100)
  const sum =
    (Number(body.hindi) || 0) +
    (Number(body.math) || 0) +
    (Number(body.gk) || 0) +
    (Number(body.gs) || 0);
  const n = Math.min(100, Math.max(0, Math.round(sum)));
  return { marks: n, total: n, hindi: 0, math: 0, gk: 0, gs: 0 };
}

export const createResult = asyncHandler(async (req, res) => {
  const rollNumber = req.body.rollNumber;
  const payload = parseTotalMarks(req.body);
  const student = await Student.findOne({
    rollNumber: String(rollNumber).toUpperCase(),
  });
  if (!student) throw new ApiError(404, "Student / roll number not found");

  let result = await Result.findOne({ student: student._id });
  if (result) {
    Object.assign(result, payload);
    result.maxMarks = 100;
    await result.save();
  } else {
    result = await Result.create({
      student: student._id,
      ...payload,
      maxMarks: 100,
    });
  }
  if (result.published) {
    await resultService.recalculatePublishedMerit({ classes: [student.class] });
  }

  sendSuccess(res, 200, "Result saved", { result });
});

export const listResults = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, class: cls, published } = req.query;
  const filter = {};
  if (published !== undefined) {
    filter.published = parseStrictBoolean(published, "published");
  }

  if (cls) {
    const students = await Student.find({ class: cls }).select("_id");
    filter.student = { $in: students.map((s) => s._id) };
  }

  const pagination = parsePagination(page, limit);
  const [items, total] = await Promise.all([
    Result.find(filter)
      .populate("student", "name class rollNumber schoolName")
      .sort({ percentage: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit),
    Result.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: "Results fetched",
    data: items,
    pagination: { total, page: pagination.page, limit: pagination.limit },
  });
});

export const getResultByRoll = asyncHandler(async (req, res) => {
  const student = await Student.findOne({
    rollNumber: String(req.params.rollNumber).toUpperCase(),
  });
  if (!student) throw new ApiError(404, "Student not found");

  if (req.query.dob) {
    const a = new Date(student.dob).toISOString().slice(0, 10);
    const b = new Date(req.query.dob).toISOString().slice(0, 10);
    if (a !== b) throw new ApiError(400, "DOB does not match");
  }

  const result = await Result.findOne({
    student: student._id,
    published: true,
  }).populate("student", "name fatherName dob class schoolName rollNumber");

  if (!result) throw new ApiError(404, "Result not found or not published");
  sendSuccess(res, 200, "Result fetched", { result });
});

export const updateResult = asyncHandler(async (req, res) => {
  const result = await Result.findById(req.params.id);
  if (!result) throw new ApiError(404, "Result not found");

  if (
    req.body.hindi !== undefined ||
    req.body.math !== undefined ||
    req.body.gk !== undefined ||
    req.body.gs !== undefined ||
    req.body.marks !== undefined ||
    req.body.total !== undefined
  ) {
    Object.assign(result, parseTotalMarks(req.body));
    result.maxMarks = 100;
  }

  if (req.body.published !== undefined) {
    result.published = parseStrictBoolean(req.body.published, "published");
    if (result.published) {
      result.publishedAt = new Date();
      result.publishedBy = req.user?._id;
    } else {
      result.publishedAt = undefined;
      result.publishedBy = undefined;
      result.rank = undefined;
      result.meritPosition = undefined;
    }
  }

  await result.save();
  await result.populate(
    "student",
    "name fatherName motherName dob class schoolName rollNumber registrationNumber photo district"
  );
  await resultService.recalculatePublishedMerit({
    classes: [result.student.class],
  });
  sendSuccess(res, 200, "Result updated", { result });
});

/** Admin lookup — works for unpublished results too */
export const lookupResultAdmin = asyncHandler(async (req, res) => {
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

  const result = await Result.findOne({ student: student._id }).populate(
    "student",
    "name fatherName motherName dob class schoolName rollNumber registrationNumber photo mobile district"
  );

  sendSuccess(res, 200, "Lookup complete", {
    student,
    result,
  });
});

export const deleteResult = asyncHandler(async (req, res) => {
  const result = await Result.findById(req.params.id);
  if (!result) throw new ApiError(404, "Result not found");
  const student = await Student.findById(result.student).select("class");
  await result.deleteOne();
  if (result.published && student) {
    await resultService.recalculatePublishedMerit({ classes: [student.class] });
  }
  sendSuccess(res, 200, "Result deleted");
});

export const publishResult = asyncHandler(async (req, res) => {
  const published = parseStrictBoolean(req.body?.published, "published");
  const result = await Result.findById(req.params.id);
  if (!result) throw new ApiError(404, "Result not found");
  result.published = published;
  result.publishedAt = published ? new Date() : undefined;
  result.publishedBy = published ? req.user._id : undefined;
  if (!published) {
    result.rank = undefined;
    result.meritPosition = undefined;
  }
  await result.save();
  const student = await Student.findById(result.student).select("class");
  const merit = await resultService.recalculatePublishedMerit({
    classes: student ? [student.class] : undefined,
  });
  sendSuccess(res, 200, published ? "Result published" : "Result unpublished", {
    result,
    merit,
  });
});

export const publishResults = asyncHandler(async (req, res) => {
  const published = parseStrictBoolean(req.body?.published, "published");
  const { class: cls, studentIds, all } = req.body || {};
  const studentQuery = {};
  if (cls) {
    if (!["8", "9", "10"].includes(String(cls))) {
      throw new ApiError(400, "Invalid class");
    }
    studentQuery.class = String(cls);
  } else if (studentIds !== undefined) {
    if (!Array.isArray(studentIds) || !studentIds.length || studentIds.length > 1000) {
      throw new ApiError(400, "studentIds must contain 1 to 1000 IDs");
    }
    studentQuery._id = { $in: [...new Set(studentIds.map(String))] };
  } else if (parseStrictBoolean(all, "all", true) !== true) {
    throw new ApiError(400, "Scope is required: class, studentIds, or all=true");
  }
  const students = await Student.find(studentQuery).select("_id class");
  const filter = { student: { $in: students.map((student) => student._id) } };
  const update = published
    ? {
        $set: {
          published: true,
          publishedAt: new Date(),
          publishedBy: req.user._id,
        },
      }
    : {
        $set: { published: false },
        $unset: { publishedAt: 1, publishedBy: 1, rank: 1, meritPosition: 1 },
      };
  const updated = await Result.updateMany(filter, update);
  const merit = await resultService.recalculatePublishedMerit({
    classes: [...new Set(students.map((student) => student.class))],
  });
  sendSuccess(res, 200, published ? "Results published" : "Results unpublished", {
    matchedCount: updated.matchedCount,
    modifiedCount: updated.modifiedCount,
    merit,
  });
});

export const recalculateMerit = asyncHandler(async (req, res) => {
  const classes = req.body?.class ? [String(req.body.class)] : undefined;
  if (classes && !["8", "9", "10"].includes(classes[0])) {
    throw new ApiError(400, "Invalid class");
  }
  const report = await resultService.recalculatePublishedMerit({ classes });
  sendSuccess(res, 200, "Published merit recalculated", { report });
});

export const getMeritList = asyncHandler(async (req, res) => {
  const { class: cls } = req.query;
  const filter = { published: true };
  if (cls) {
    const students = await Student.find({ class: cls }).select("_id");
    filter.student = { $in: students.map((s) => s._id) };
  }
  const results = await Result.find(filter)
    .populate("student", "name schoolName district class rollNumber")
    .sort({ percentage: -1, total: -1 })
    .limit(100);
  sendSuccess(res, 200, "Merit list fetched", { results });
});

export const getMarksheet = asyncHandler(async (req, res) => {
  const student = await Student.findOne({
    rollNumber: String(req.params.rollNumber).toUpperCase(),
  });
  if (!student) throw new ApiError(404, "Student not found");

  const result = await Result.findOne({
    student: student._id,
    published: true,
  });
  if (!result) throw new ApiError(404, "Marksheet not available");

  sendSuccess(res, 200, "Marksheet fetched", { student, result });
});

export const downloadMarksheet = asyncHandler(async (req, res) => {
  const result = await Result.findById(req.params.id);
  if (!result) throw new ApiError(404, "Marksheet not found");

  // Public downloads require published; admin may preview drafts when ?admin=1 + auth later —
  // keep public rule, but allow unpublished if caller is authenticated admin via header cookie path.
  const isAdminRequest = Boolean(req.user);
  if (!result.published && !isAdminRequest) {
    throw new ApiError(404, "Marksheet not found");
  }

  const student = await Student.findById(result.student);
  const pdf = await createMarksheetPDF(student, result);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=marksheet-${student.rollNumber}.pdf`
  );
  res.send(pdf);
});

export const verifyMarksheet = asyncHandler(async (req, res) => {
  const payload = req.params.qr;
  let data;
  try {
    data = JSON.parse(decodeURIComponent(payload));
  } catch {
    data = { roll: payload };
  }

  const student = await Student.findOne({
    rollNumber: String(data.roll || data.rollNumber || "").toUpperCase(),
  });
  if (!student) throw new ApiError(404, "Invalid QR / student not found");

  const result = await Result.findOne({ student: student._id, published: true });
  if (!result) throw new ApiError(404, "Result not found");

  sendSuccess(res, 200, "Marksheet verified", {
    student: {
      name: student.name,
      rollNumber: student.rollNumber,
      class: student.class,
    },
    result: {
      total: result.total,
      percentage: result.percentage,
      grade: result.grade,
      status: result.status,
    },
  });
});

/* -------- Excel / Google Sheets Import -------- */

export const getImportSheetConfig = asyncHandler(async (req, res) => {
  const config = await sheetImport.getSheetConfig();
  sendSuccess(res, 200, "Sheet config", config);
});

export const downloadSampleResultExcel = asyncHandler(async (req, res) => {
  const buf = sheetImport.buildSampleResultExcel();
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="sample-result-import.xlsx"'
  );
  res.send(buf);
});

export const previewExcelImport = asyncHandler(async (req, res) => {
  if (!req.file?.buffer) throw new ApiError(400, "Excel file required");
  const { rows, sheetName, filename } = sheetImport.parseWorkbookBuffer(
    req.file.buffer,
    req.file.originalname
  );
  if (!rows.length) throw new ApiError(400, "Excel is empty");
  const report = await sheetImport.validateAndMapRows(rows);
  sendSuccess(res, 200, "Excel validated", {
    source: "excel",
    filename: filename || req.file.originalname,
    sheetName,
    ...report,
  });
});

export const importExcelResults = asyncHandler(async (req, res) => {
  if (!req.file?.buffer) throw new ApiError(400, "Excel file required");
  const publish =
    parseStrictBoolean(req.body?.publish, "publish", true) ?? false;
  const { rows, sheetName, filename } = sheetImport.parseWorkbookBuffer(
    req.file.buffer,
    req.file.originalname
  );
  const report = await sheetImport.validateAndMapRows(rows);
  if (!report.ready.length) {
    throw new ApiError(400, "No valid rows to import", { report });
  }
  const imported = await sheetImport.importValidatedRows(report.ready, {
    publish,
    adminId: req.user?._id,
  });
  sendSuccess(res, 200, "Excel imported", {
    source: "excel",
    filename: filename || req.file.originalname,
    sheetName,
    total: report.total,
    success: imported.success,
    created: imported.created,
    updated: imported.updated,
    failed: report.failed + imported.failed.length,
    duplicate: report.duplicate,
    missing: report.missing,
    errors: [...report.errors, ...imported.failed].slice(0, 50),
    meritPreview: report.meritPreview,
    published: publish,
  });
});

export const previewGoogleSheet = asyncHandler(async (req, res) => {
  const sheetUrl =
    req.body?.sheetUrl ||
    req.query?.sheetUrl ||
    (await sheetImport.getSheetConfig()).sheetUrl;
  const gid = String(req.body?.gid || req.query?.gid || "0");
  const fetched = await sheetImport.fetchGoogleSheetRows(sheetUrl, gid);
  if (!fetched.rows.length) throw new ApiError(400, "Google Sheet is empty");
  const report = await sheetImport.validateAndMapRows(fetched.rows);
  sendSuccess(res, 200, "Google Sheet preview", {
    source: "google",
    sheetUrl: fetched.sheetUrl,
    sheetId: fetched.sheetId,
    sheetName: fetched.sheetName,
    ...report,
  });
});

export const syncGoogleSheet = asyncHandler(async (req, res) => {
  const sheetUrl =
    req.body?.sheetUrl || (await sheetImport.getSheetConfig()).sheetUrl;
  const gid = String(req.body?.gid || "0");
  const publish =
    parseStrictBoolean(req.body?.publish, "publish", true) ?? false;
  const saveUrl =
    parseStrictBoolean(req.body?.saveUrl, "saveUrl", true) ?? true;

  const fetched = await sheetImport.fetchGoogleSheetRows(sheetUrl, gid);
  if (!fetched.rows.length) throw new ApiError(400, "Google Sheet is empty");

  const report = await sheetImport.validateAndMapRows(fetched.rows);
  if (!report.ready.length) {
    throw new ApiError(400, "No valid rows to import", { report });
  }

  const imported = await sheetImport.importValidatedRows(report.ready, {
    publish,
    adminId: req.user?._id,
  });

  let setting = null;
  if (saveUrl) {
    setting = await sheetImport.saveSheetConfig(sheetUrl);
  }

  sendSuccess(res, 200, "Google Sheet synced", {
    source: "google",
    sheetUrl,
    sheetId: fetched.sheetId,
    total: report.total,
    success: imported.success,
    created: imported.created,
    updated: imported.updated,
    failed: report.failed + imported.failed.length,
    duplicate: report.duplicate,
    missing: report.missing,
    errors: [...report.errors, ...imported.failed].slice(0, 50),
    meritPreview: report.meritPreview,
    published: publish,
    lastSync: setting?.googleSheetLastSync || new Date(),
  });
});
