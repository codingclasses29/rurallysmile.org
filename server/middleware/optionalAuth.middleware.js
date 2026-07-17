import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

/** Attach req.user if JWT cookie/header is present; never fails the request */
export default async function optionalAuth(req, _res, next) {
  try {
    let token = req.cookies?.accessToken || req.cookies?.token;
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) return next();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");
    if (admin && admin.isActive) req.user = admin;
  } catch {
    /* ignore invalid token */
  }
  return next();
}
