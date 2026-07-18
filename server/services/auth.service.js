import Admin from "../models/Admin.js";
import generateAccessToken from "../utils/generateToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import ApiError from "../utils/ApiError.js";
import Log from "../models/Log.js";
import * as mailService from "./mail.service.js";
import { generateOTP } from "./otp.service.js";

const otpStore = new Map(); // email -> { otp, expiresAt }

const isProduction = () => process.env.NODE_ENV === "production";
const cookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: isProduction(),
  sameSite: isProduction() ? "none" : "lax",
  path: "/",
  maxAge,
});

export const loginAdmin = async ({ email, password, ip, userAgent }) => {
  const admin = await Admin.findOne({ email: email.toLowerCase() }).select("+password");
  if (!admin) throw new ApiError(404, "Admin not found");
  if (!admin.isActive) throw new ApiError(403, "Account is inactive");

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) throw new ApiError(401, "Invalid Password");

  const accessToken = generateAccessToken(admin);
  const refreshToken = generateRefreshToken(admin);

  admin.lastLogin = new Date();
  await admin.save({ validateBeforeSave: false });

  await Log.create({
    actorType: "admin",
    actorId: admin._id,
    action: "LOGIN",
    resource: "Admin",
    resourceId: String(admin._id),
    ipAddress: ip,
    userAgent,
  });

  return {
    accessToken,
    refreshToken,
    cookieOptions,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  };
};

export const changePassword = async (adminId, { currentPassword, newPassword }) => {
  const admin = await Admin.findById(adminId).select("+password");
  if (!admin) throw new ApiError(404, "Admin not found");

  const ok = await admin.comparePassword(currentPassword);
  if (!ok) throw new ApiError(401, "Current password is incorrect");

  admin.password = newPassword;
  await admin.save();
};

export const forgotPassword = async (email) => {
  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) throw new ApiError(404, "Admin not found");

  const otp = generateOTP();
  otpStore.set(admin.email, {
    otp: String(otp),
    expiresAt: Date.now() + 10 * 60 * 1000,
  });

  try {
    await mailService.sendMail(
      admin.email,
      "Password Reset OTP - Pratibha Khoj",
      `<p>Your OTP is <b>${otp}</b>. Valid for 10 minutes.</p>`
    );
  } catch {
    // Still return success shape but OTP is stored for testing/logs
    console.warn("Email send failed; OTP stored locally:", otp);
  }

  return { email: admin.email, expiresIn: "10m" };
};

export const resetPassword = async ({ email, otp, newPassword }) => {
  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) throw new ApiError(404, "Admin not found");

  const entry = otpStore.get(admin.email);
  if (!entry || entry.otp !== String(otp) || entry.expiresAt < Date.now()) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  admin.password = newPassword;
  await admin.save();
  otpStore.delete(admin.email);
};

export const refreshTokens = async (refreshToken) => {
  const jwt = (await import("jsonwebtoken")).default;
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const admin = await Admin.findById(decoded.id);
  if (!admin || !admin.isActive) throw new ApiError(401, "Admin not found or inactive");

  return {
    accessToken: generateAccessToken(admin),
    cookieOptions,
    admin,
  };
};

export default {
  loginAdmin,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshTokens,
};
