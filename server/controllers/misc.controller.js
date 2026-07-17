import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import ExamCenter from "../models/ExamCenter.js";
import Notice from "../models/Notice.js";
import Gallery from "../models/Gallery.js";
import { uploadImage } from "../services/upload.service.js";
import * as studentService from "../services/student.service.js";

/* -------- Exam Center -------- */
export const createCenter = asyncHandler(async (req, res) => {
  const center = await ExamCenter.create({
    centerCode: req.body.centerCode || req.body.code,
    centerName: req.body.centerName || req.body.name,
    centerNameHindi: req.body.centerNameHindi,
    address: req.body.address,
    district: req.body.district,
    capacity: req.body.capacity,
    contactPerson: req.body.contactPerson,
    mobile: req.body.mobile || req.body.contactPhone,
    reportingTime: req.body.reportingTime,
  });
  sendSuccess(res, 201, "Exam center created", { center });
});

export const listCenters = asyncHandler(async (req, res) => {
  const includeAll =
    Boolean(req.user) && (req.query.all === "1" || req.query.all === "true");
  const filter = includeAll ? {} : { isActive: true };
  const centers = await ExamCenter.find(filter).sort({ centerName: 1 });
  sendSuccess(res, 200, "Exam centers fetched", { centers });
});

export const updateCenter = asyncHandler(async (req, res) => {
  const center = await ExamCenter.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!center) throw new ApiError(404, "Exam center not found");
  sendSuccess(res, 200, "Exam center updated", { center });
});

export const deleteCenter = asyncHandler(async (req, res) => {
  const center = await ExamCenter.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!center) throw new ApiError(404, "Exam center not found");
  sendSuccess(res, 200, "Exam center deactivated", { center });
});

/* -------- Notice -------- */
export const createNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.create({
    title: req.body.title,
    titleHindi: req.body.titleHindi,
    description: req.body.description || req.body.content,
    type: req.body.type,
    published: req.body.published !== undefined ? req.body.published : true,
    createdBy: req.user._id,
  });
  sendSuccess(res, 201, "Notice created", { notice });
});

export const listNotices = asyncHandler(async (req, res) => {
  const includeAll =
    Boolean(req.user) && (req.query.all === "1" || req.query.all === "true");
  const filter = includeAll ? {} : { published: true };
  const notices = await Notice.find(filter).sort({ createdAt: -1 }).limit(200);
  sendSuccess(res, 200, "Notices fetched", { notices });
});

export const updateNotice = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (payload.content) payload.description = payload.content;
  const notice = await Notice.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  if (!notice) throw new ApiError(404, "Notice not found");
  sendSuccess(res, 200, "Notice updated", { notice });
});

export const deleteNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findByIdAndDelete(req.params.id);
  if (!notice) throw new ApiError(404, "Notice not found");
  sendSuccess(res, 200, "Notice deleted");
});

/* -------- Gallery -------- */
export const createGallery = asyncHandler(async (req, res) => {
  let imageUrl = req.body.imageUrl;
  if (req.file) {
    const uploaded = await uploadImage(req.file, "examportal/gallery");
    imageUrl = uploaded.secure_url;
  }
  if (!imageUrl) throw new ApiError(400, "Image is required");

  const item = await Gallery.create({
    title: req.body.title || "Gallery Image",
    titleHindi: req.body.titleHindi,
    imageUrl,
    category: req.body.category,
    description: req.body.description,
    uploadedBy: req.user._id,
  });
  sendSuccess(res, 201, "Gallery item created", { item });
});

export const listGallery = asyncHandler(async (req, res) => {
  const items = await Gallery.find({ isPublished: true }).sort({ createdAt: -1 });
  sendSuccess(res, 200, "Gallery fetched", { items });
});

export const deleteGallery = asyncHandler(async (req, res) => {
  const item = await Gallery.findByIdAndDelete(req.params.id);
  if (!item) throw new ApiError(404, "Gallery item not found");
  sendSuccess(res, 200, "Gallery item deleted");
});

/* -------- Settings -------- */
export const getSettings = asyncHandler(async (req, res) => {
  const setting = await studentService.getSetting();
  sendSuccess(res, 200, "Settings fetched", { setting });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const setting = await studentService.updateSetting(req.body);
  sendSuccess(res, 200, "Settings updated", { setting });
});

/* -------- Dashboard -------- */
export const publicStats = asyncHandler(async (req, res) => {
  const stats = await studentService.getDashboardStats();
  sendSuccess(res, 200, "Public stats", {
    stats: {
      totalStudents: stats.approvedStudents,
      totalCenters: stats.totalCenters,
      totalNotices: stats.totalNotices,
      totalGallery: stats.totalGallery,
      publishedResults: stats.publishedResults,
    },
  });
});

export const adminDashboard = asyncHandler(async (req, res) => {
  const stats = await studentService.getDashboardStats();
  sendSuccess(res, 200, "Admin dashboard", { stats });
});

export const studentDashboard = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, "Student dashboard", {
    student: req.user,
  });
});

export const statistics = asyncHandler(async (req, res) => {
  const stats = await studentService.getDashboardStats();
  sendSuccess(res, 200, "Statistics fetched", { stats });
});

/* -------- Upload -------- */
export const uploadSingleImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No file uploaded");
  const uploaded = await uploadImage(req.file, "examportal");
  sendSuccess(res, 200, "Image uploaded", {
    url: uploaded.secure_url,
    publicId: uploaded.public_id,
  });
});

export const uploadPhoto = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No photo uploaded");
  const uploaded = await uploadImage(req.file, "examportal/photos");
  sendSuccess(res, 200, "Photo uploaded", { url: uploaded.secure_url });
});

export const uploadSignature = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No signature uploaded");
  const uploaded = await uploadImage(req.file, "examportal/signatures");
  sendSuccess(res, 200, "Signature uploaded", { url: uploaded.secure_url });
});
