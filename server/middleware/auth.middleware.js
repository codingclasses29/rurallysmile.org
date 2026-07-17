import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.accessToken;

  // Backward compatibility with older "token" cookie / Bearer header
  if (!token) {
    token = req.cookies?.token;
  }
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
      data: null,
      errors: null,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        data: null,
        errors: null,
      });
    }

    req.user = admin;
    req.userRole = admin.role;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token Expired",
      data: null,
      errors: null,
    });
  }
});

export default protect;
export { protect };
