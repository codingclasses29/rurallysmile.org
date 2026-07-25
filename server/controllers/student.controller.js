import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import Student from "../models/Student.js";
import * as studentService from "../services/student.service.js";
import * as studentImport from "../services/studentImport.service.js";

export const registerStudent = asyncHandler(async (req, res) => {
  const result = await studentService.registerStudentService(req.body, req.files || {});
  sendSuccess(res, 201, "Student Registered Successfully", result);
});

export const getStudents = asyncHandler(async (req, res) => {
  const result = await studentService.listStudents(req.query);
  res.status(200).json({
    success: true,
    message: "Students fetched",
    data: result.items,
    pagination: result.pagination,
  });
});

export const searchStudents = asyncHandler(async (req, res) => {
  const result = await studentService.listStudents({
    ...req.query,
    search: req.query.q || req.query.search,
  });
  res.status(200).json({
    success: true,
    message: "Search results",
    data: result.items,
    pagination: result.pagination,
  });
});

export const getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) throw new ApiError(404, "Student not found");
  sendSuccess(res, 200, "Student fetched", { student });
});

export const updateStudent = asyncHandler(async (req, res) => {
  const student = await studentService.updateStudentFields(req.params.id, req.body);
  sendSuccess(res, 200, "Student updated", { student });
});

/** Re-upload photo/signature when Cloudinary file was corrupted */
export const replaceStudentMedia = asyncHandler(async (req, res) => {
  const files = req.files || {};
  if (!files.photo?.[0] && !files.signature?.[0]) {
    throw new ApiError(400, "Provide photo and/or signature file");
  }
  const student = await studentService.replaceStudentMedia(req.params.id, files);
  sendSuccess(res, 200, "Student media updated", { student });
});

export const deleteStudent = asyncHandler(async (req, res) => {
  const report = await studentService.hardDeleteStudent(req.params.id);
  sendSuccess(res, 200, "Student and dependent records deleted", { report });
});

export const restoreStudent = asyncHandler(async (req, res) => {
  const student = await studentService.restoreStudent(req.params.id);
  sendSuccess(res, 200, "Student restored to Pending", { student });
});

export const downloadStudentImportSample = asyncHandler(async (req, res) => {
  const buffer = await studentImport.buildStudentImportSample();
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="student-import-sample.xlsx"'
  );
  res.send(buffer);
});

export const downloadStudentMediaSample = asyncHandler(async (req, res) => {
  const buffer = await studentImport.buildStudentMediaSample();
  res.setHeader("Content-Type", "application/zip");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="student-media-sample.zip"'
  );
  res.send(buffer);
});

export const previewStudentImport = asyncHandler(async (req, res) => {
  const report = await studentImport.validateStudentImport(
    req.files?.excel?.[0],
    req.files?.mediaZip?.[0]
  );
  sendSuccess(res, 200, "Student import validated", {
    sheetName: report.sheetName,
    total: report.total,
    valid: report.valid,
    invalid: report.invalid,
    rows: report.rows,
    limits: studentImport.STUDENT_IMPORT_LIMITS,
  });
});

export const executeStudentImport = asyncHandler(async (req, res) => {
  const report = await studentImport.importStudents(
    req.files?.excel?.[0],
    req.files?.mediaZip?.[0]
  );
  sendSuccess(res, 200, "Student import completed", { report });
});

export const getMyProfile = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, "Profile fetched", { student: req.user });
});
