import Student from "../models/Student.js";
import Registration from "../models/Registration.js";
import ApiError from "../utils/ApiError.js";
import { generateOTP, saveOTP, verifyOTP, consumeVerifiedSession } from "./otp.service.js";
import { sendMail } from "./mail.service.js";
import { sendOtpWhatsApp } from "./whatsapp.service.js";
import { registerStudentService } from "./student.service.js";
import logger from "../utils/logger.js";

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();
const normalizeMobile = (mobile) => String(mobile || "").replace(/\D/g, "").slice(-10);
const otpKey = (email) => `reg:${normalizeEmail(email)}`;
const verifiedKey = (email) => `reg-verified:${normalizeEmail(email)}`;

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));

const otpEmailHtml = (otp) =>
  `<div style="font-family:sans-serif;max-width:560px;margin:0 auto">
    <h2 style="color:#0F172A">Email OTP Verification</h2>
    <p>प्रतिभा खोज प्रतियोगिता 2026 पंजीकरण के लिए आपका OTP:</p>
    <p style="font-size:28px;font-weight:700;letter-spacing:6px;color:#2563EB">${otp}</p>
    <p>यह OTP <strong>5 मिनट</strong> तक मान्य है। किसी के साथ साझा न करें।</p>
    <p>— Rurally Smile Foundation</p>
  </div>`;

export const sendRegistrationOtp = async (
  emailInput,
  mobileInput,
  options = {}
) => {
  const email = normalizeEmail(emailInput);
  const mobile = normalizeMobile(mobileInput);
  const prepareOnly = Boolean(options.prepareOnly);
  const relayOk = Boolean(options.relayAuthenticated);

  if (!isValidEmail(email)) {
    throw new ApiError(400, "Enter a valid email address");
  }

  const existing = await Student.findOne({ email });
  if (existing) throw new ApiError(409, "Email already registered");

  const otp = generateOTP();

  // Trusted Vercel relay: store OTP only; Vercel sends the email (SMTP works there)
  if (prepareOnly && relayOk) {
    await saveOTP(otpKey(email), otp);
    return {
      email,
      channel: "pending",
      relayOtp: otp,
      expiresIn: 300,
      message: "OTP prepared for email relay",
    };
  }

  let channel = null;
  let lastError = null;

  // 1) Email via Resend HTTPS (preferred on Render) or SMTP (local / paid)
  try {
    const delivery = await sendMail(
      email,
      "OTP Verification – Pratibha Khoj 2026",
      otpEmailHtml(otp)
    );
    if (delivery?.skipped) {
      lastError = new Error(
        delivery.reason === "smtp_not_configured"
          ? "Email not configured"
          : "Email skipped"
      );
    } else {
      channel = "email";
    }
  } catch (err) {
    lastError = err;
    logger.error(`Registration OTP email failed for ${email}: ${err.message}`);
  }

  // 2) Render free blocks SMTP — fall back to Twilio SMS/WhatsApp (HTTPS)
  if (!channel && /^[6-9]\d{9}$/.test(mobile)) {
    try {
      const sms = await sendOtpWhatsApp(mobile, otp);
      if (!sms?.skipped) {
        channel = "sms";
        logger.info(`Registration OTP for ${email} delivered via SMS to ${mobile}`);
      } else {
        lastError = new Error(sms?.error || "SMS/WhatsApp not configured");
      }
    } catch (err) {
      lastError = err;
      logger.error(`Registration OTP SMS failed for ${mobile}: ${err.message}`);
    }
  }

  if (!channel) {
    const smtpBlocked = Boolean(lastError?.isSmtpBlocked);
    throw new ApiError(
      smtpBlocked ? 502 : 503,
      smtpBlocked
        ? "Email SMTP is blocked on Render free tier. Add RESEND_API_KEY (HTTPS) or ensure Twilio SMS is configured, then retry."
        : "OTP could not be sent. Configure RESEND_API_KEY or Twilio SMS on Render."
    );
  }

  await saveOTP(otpKey(email), otp);

  const payload = {
    email,
    channel,
    expiresIn: 300,
    message:
      channel === "email"
        ? "OTP sent to your email"
        : "OTP sent to your mobile (email delivery unavailable on server)",
  };

  if (process.env.NODE_ENV !== "production") {
    payload.devOtp = otp;
    logger.info(`[DEV] Registration OTP for ${email}: ${otp} (${channel})`);
  }

  return payload;
};

export const verifyRegistrationOtpOnly = async (emailInput, otp) => {
  const email = normalizeEmail(emailInput);
  const ok = await verifyOTP(otpKey(email), otp);
  if (!ok) throw new ApiError(400, "Invalid or expired OTP");
  await saveOTP(verifiedKey(email), "OK", 15 * 60 * 1000);
  return { verified: true, email };
};

export const submitRegistrationWithOtp = async (body, files) => {
  const email = normalizeEmail(body.email);
  const otp = String(body.otp || "").trim();

  if (!email || !isValidEmail(email)) {
    throw new ApiError(400, "Valid email is required for OTP verification");
  }
  if (!otp) throw new ApiError(400, "OTP is required");

  const liveOk = await verifyOTP(otpKey(email), otp);
  const sessionOk =
    !liveOk && (otp === "verified" || otp.length >= 4)
      ? await consumeVerifiedSession(email)
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
