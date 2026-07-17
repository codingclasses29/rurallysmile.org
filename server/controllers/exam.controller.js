import ExamCenter from "../models/ExamCenter.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { sendSuccess } from "../utils/ApiResponse.js";

export const listExamCenters = asyncHandler(async (req, res) => {
  const centers = await ExamCenter.find({ isActive: true }).sort({
    centerName: 1,
  });
  sendSuccess(res, 200, "Exam centers fetched", { centers });
});

export const createExamCenter = asyncHandler(async (req, res) => {
  const center = await ExamCenter.create({
    centerCode: req.body.centerCode || req.body.code,
    centerName: req.body.centerName || req.body.name,
    centerNameHindi: req.body.centerNameHindi || req.body.nameHindi,
    address: req.body.address,
    district: req.body.district,
    block: req.body.block,
    village: req.body.village,
    capacity: req.body.capacity,
    contactPerson: req.body.contactPerson,
    mobile: req.body.mobile || req.body.contactPhone,
    reportingTime: req.body.reportingTime,
  });
  sendSuccess(res, 201, "Exam center created", { center });
});

export const updateExamCenter = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (payload.code) payload.centerCode = payload.code;
  if (payload.name) payload.centerName = payload.name;
  if (payload.contactPhone) payload.mobile = payload.contactPhone;

  const center = await ExamCenter.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  if (!center) throw new AppError("Exam center not found", 404);
  sendSuccess(res, 200, "Exam center updated", { center });
});

export const deleteExamCenter = asyncHandler(async (req, res) => {
  const center = await ExamCenter.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!center) throw new AppError("Exam center not found", 404);
  sendSuccess(res, 200, "Exam center deactivated", { center });
});
