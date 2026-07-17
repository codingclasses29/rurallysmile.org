import Student from "../models/Student.js";
import Registration from "../models/Registration.js";
import ApiError from "../utils/ApiError.js";
import { generateOTP, saveOTP, verifyOTP, consumeVerifiedSession } from "./otp.service.js";
import { sendMail } from "./mail.service.js";
import { registerStudentService } from "./student.service.js";
import logger from "../utils/logger.js";

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();
const otpKey = (email) => `reg:${normalizeEmail(email)}`;
const verifiedKey = (email) => `reg-verified:${normalizeEmail(email)}`;

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));

export const sendRegistrationOtp = async (emailInput) => {
  const email = normalizeEmail(emailInput);
  if (!isValidEmail(email)) {
    throw new ApiError(400, "Enter a valid email address");
  }

  const existing = await Student.findOne({ email });
  if (existing) throw new ApiError(409, "Email already registered");

  const otp = generateOTP();

  try {
    const delivery = await sendMail(
      email,
      "OTP Verification – Pratibha Khoj 2026",
      `<div style="font-family:sans-serif;max-width:560px;margin:0 auto">
        <h2 style="color:#0F172A">Email OTP Verification</h2>
        <p>प्रतिभा खोज प्रतियोगिता 2026 पंजीकरण के लिए आपका OTP:</p>
        <p style="font-size:28px;font-weight:700;letter-spacing:6px;color:#2563EB">${otp}</p>
        <p>यह OTP <strong>5 मिनट</strong> तक मान्य है। किसी के साथ साझा न करें।</p>
        <p>— Rurally Smile Foundation</p>
      </div>`
    );
    if (delivery?.skipped) {
      throw new ApiError(
        503,
        "Email service is not configured. Add EMAIL and EMAIL_PASSWORD on Render."
      );
    }
  } catch (err) {
    logger.error(`Registration OTP email failed for ${email}: ${err.message}`);
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      502,
      "OTP email could not be sent. Check Render email credentials and try again."
    );
  }

  saveOTP(otpKey(email), otp);

  const payload = {
    email,
    expiresIn: 300,
    message: "OTP sent to your email",
  };

  if (process.env.NODE_ENV !== "production") {
    payload.devOtp = otp;
    logger.info(`[DEV] Registration OTP for ${email}: ${otp}`);
  }

  return payload;
};

export const verifyRegistrationOtpOnly = async (emailInput, otp) => {
  const email = normalizeEmail(emailInput);
  const ok = verifyOTP(otpKey(email), otp);
  if (!ok) throw new ApiError(400, "Invalid or expired OTP");
  saveOTP(verifiedKey(email), "OK", 15 * 60 * 1000);
  return { verified: true, email };
};

export const submitRegistrationWithOtp = async (body, files) => {
  const email = normalizeEmail(body.email);
  const otp = String(body.otp || "").trim();

  if (!email || !isValidEmail(email)) {
    throw new ApiError(400, "Valid email is required for OTP verification");
  }
  if (!otp) throw new ApiError(400, "OTP is required");

  const liveOk = verifyOTP(otpKey(email), otp);
  const sessionOk =
    !liveOk && (otp === "verified" || otp.length >= 4)
      ? consumeVerifiedSession(email)
      : false;

  if (!liveOk && !sessionOk) {
    throw new ApiError(400, "Invalid or expired OTP. Please resend to email.");
  }

  const result = await registerStudentService(
    { ...body, email, otpVerified: true },
    files
  );

  return {
    success: true,
    registrationNumber: result.registrationNumber,
    student: result.student,
    message: "Registration Successful",
  };
};

export const getRegistrationStatus = async ({ registrationNumber, mobile }) => {
  const query = {};
  if (registrationNumber) {
    query.registrationNumber = String(registrationNumber).toUpperCase();
  }
  if (mobile) query.mobile = String(mobile).trim();
  if (!query.registrationNumber && !query.mobile) {
    throw new ApiError(400, "Provide registrationNumber or mobile");
  }

  const student = await Student.findOne(query).select(
    "name class schoolName mobile email status registrationNumber rollNumber otpVerified createdAt district fatherName photo"
  );
  if (!student) throw new ApiError(404, "Registration not found");

  const registration = await Registration.findOne({ student: student._id });

  return {
    student,
    registration,
    status: student.status,
    approved: student.status === "Approved",
    paymentStatus: registration?.paymentStatus || "Free",
  };
};

export default {
  sendRegistrationOtp,
  verifyRegistrationOtpOnly,
  submitRegistrationWithOtp,
  getRegistrationStatus,
};
