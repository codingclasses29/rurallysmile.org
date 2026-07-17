import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import Admin from "../models/Admin.js";
import ApiError from "../utils/ApiError.js";
import { ROLES } from "../utils/constants.js";
import * as studentService from "../services/student.service.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const stats = await studentService.getDashboardStats();
  sendSuccess(res, 200, "Dashboard stats fetched", stats);
});

export const listStudents = asyncHandler(async (req, res) => {
  const result = await studentService.listStudents(req.query);
  res.status(200).json({
    success: true,
    message: "Students fetched",
    data: result.items,
    pagination: result.pagination,
  });
});

export const approveRegistration = asyncHandler(async (req, res) => {
  const student = await studentService.approveStudent(req.params.id, req.user._id);
  sendSuccess(res, 200, "Student approved", { student });
});

export const rejectRegistration = asyncHandler(async (req, res) => {
  const student = await studentService.rejectStudent(
    req.params.id,
    req.user._id,
    req.body.reason
  );
  sendSuccess(res, 200, "Student rejected", { student });
});

export const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role, mobile } = req.body;

  if (role === ROLES.SUPER_ADMIN && req.userRole !== ROLES.SUPER_ADMIN) {
    throw new ApiError(403, "Only Super Admin can create Super Admin");
  }

  const admin = await Admin.create({
    name,
    email,
    password,
    role: role || ROLES.ADMIN,
    mobile,
  });

  sendSuccess(res, 201, "Admin created", {
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });
});
