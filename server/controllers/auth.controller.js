import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import authService from "../services/auth.service.js";

export const login = asyncHandler(async (req, res) => {
  const result = await authService.loginAdmin({
    email: req.body.email,
    password: req.body.password,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  res.cookie("accessToken", result.accessToken, result.cookieOptions(15 * 60 * 1000));
  res.cookie(
    "refreshToken",
    result.refreshToken,
    result.cookieOptions(7 * 24 * 60 * 60 * 1000)
  );

  res.status(200).json({
    success: true,
    message: "Login Successful",
    data: result.admin,
    errors: null,
  });
});

export const logout = asyncHandler(async (req, res) => {
  const clearOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  };
  res.clearCookie("accessToken", clearOpts);
  res.clearCookie("refreshToken", clearOpts);
  res.json({
    success: true,
    message: "Logout Successfully",
    data: null,
    errors: null,
  });
});

export const profile = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, "Profile fetched", {
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      mobile: req.user.mobile,
      lastLogin: req.user.lastLogin,
    },
    role: req.user.role,
  });
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  const result = await authService.refreshTokens(token);

  res.cookie("accessToken", result.accessToken, result.cookieOptions(15 * 60 * 1000));
  sendSuccess(res, 200, "Access token refreshed", { role: result.admin.role });
});

export const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user._id, req.body);
  sendSuccess(res, 200, "Password changed successfully");
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const data = await authService.forgotPassword(req.body.email);
  sendSuccess(res, 200, "OTP sent to email", data);
});

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body);
  sendSuccess(res, 200, "Password reset successfully");
});

export const me = profile;
