import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import Registration from "../models/Registration.js";
import Student from "../models/Student.js";
import * as studentService from "../services/student.service.js";
import * as registrationService from "../services/registration.service.js";
import { createRegistrationReceiptPDF } from "../services/pdf.service.js";
import { parsePagination, parseStrictBoolean } from "../utils/adminWorkflow.js";

/** Public: send OTP to email */
export const sendOtp = asyncHandler(async (req, res) => {
  const data = await registrationService.sendRegistrationOtp(
    req.body.email || req.body.mobile
  );
  sendSuccess(res, 200, data.message || "OTP sent", data);
});

/** Public: verify OTP only */
export const verifyOtp = asyncHandler(async (req, res) => {
  const data = await registrationService.verifyRegistrationOtpOnly(
    req.body.email || req.body.mobile,
    req.body.otp
  );
  sendSuccess(res, 200, "OTP verified", data);
});

/** Public: multipart registration submit */
export const publicRegister = asyncHandler(async (req, res) => {
  const result = await registrationService.submitRegistrationWithOtp(
    req.body,
    req.files || {}
  );
  res.status(201).json({
    success: true,
    registrationNumber: result.registrationNumber,
    message: "Registration Successful",
    data: {
      registrationNumber: result.registrationNumber,
      student: result.student,
    },
    errors: null,
  });
});

/** Public: status lookup */
export const registrationStatus = asyncHandler(async (req, res) => {
  const data = await registrationService.getRegistrationStatus(req.query);
  sendSuccess(res, 200, "Status fetched", data);
});

/** Public: PDF receipt */
export const downloadReceipt = asyncHandler(async (req, res) => {
  const regNo = String(req.params.registrationNumber || "").toUpperCase();
  const student = await Student.findOne({ registrationNumber: regNo });
  if (!student) throw new ApiError(404, "Registration not found");

  const pdf = await createRegistrationReceiptPDF(student);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="receipt-${regNo}.pdf"`
  );
  res.send(pdf);
});

/* ——— Admin (existing) ——— */

export const createRegistration = asyncHandler(async (req, res) => {
  const registration = await Registration.create({
    student: req.body.studentId,
    paymentStatus: req.body.paymentStatus || "Free",
    verified: false,
  });
  sendSuccess(res, 201, "Registration created", { registration });
});

export const listRegistrations = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, verified } = req.query;
  const query = {};
  if (verified !== undefined) {
    query.verified = parseStrictBoolean(verified, "verified");
  }

  const pagination = parsePagination(page, limit);
  const [items, total] = await Promise.all([
    Registration.find(query)
      .populate("student")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit),
    Registration.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    message: "Registrations fetched",
    data: items,
    pagination: { total, page: pagination.page, limit: pagination.limit },
  });
});

export const getRegistration = asyncHandler(async (req, res) => {
  const registration = await Registration.findById(req.params.id).populate("student");
  if (!registration) throw new ApiError(404, "Registration not found");
  sendSuccess(res, 200, "Registration fetched", { registration });
});

export const approveRegistration = asyncHandler(async (req, res) => {
  let studentId = req.params.id;
  const reg = await Registration.findById(req.params.id);
  if (reg) studentId = reg.student;

  const student = await studentService.approveStudent(studentId, req.user._id);
  sendSuccess(res, 200, "Registration approved", { student });
});

export const rejectRegistration = asyncHandler(async (req, res) => {
  let studentId = req.params.id;
  const reg = await Registration.findById(req.params.id);
  if (reg) studentId = reg.student;

  const student = await studentService.rejectStudent(
    studentId,
    req.user._id,
    req.body.reason
  );
  sendSuccess(res, 200, "Registration rejected", { student });
});

export const restoreRegistration = asyncHandler(async (req, res) => {
  let studentId = req.params.id;
  const registration = await Registration.findById(req.params.id);
  if (registration) studentId = registration.student;
  const student = await studentService.restoreStudent(studentId);
  sendSuccess(res, 200, "Registration restored to Pending", { student });
});
