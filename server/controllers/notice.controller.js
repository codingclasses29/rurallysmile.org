import Notice from "../models/Notice.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { sendSuccess } from "../utils/ApiResponse.js";

export const listNotices = asyncHandler(async (req, res) => {
  const filter =
    req.query.all === "1" || req.query.all === "true" ? {} : { published: true };
  const notices = await Notice.find(filter)
    .sort({ isPinned: -1, createdAt: -1 })
    .limit(100);
  sendSuccess(res, 200, "Notices fetched", { notices });
});

export const listAllNotices = asyncHandler(async (req, res) => {
  const notices = await Notice.find()
    .sort({ isPinned: -1, createdAt: -1 })
    .limit(200);
  sendSuccess(res, 200, "All notices fetched", { notices });
});

export const createNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.create({
    title: req.body.title,
    titleHindi: req.body.titleHindi,
    description: req.body.description || req.body.content,
    descriptionHindi: req.body.descriptionHindi || req.body.contentHindi,
    type: req.body.type,
    published: req.body.published !== undefined ? req.body.published : true,
    isPinned: req.body.isPinned || false,
    createdBy: req.user._id,
  });
  sendSuccess(res, 201, "Notice created", { notice });
});

export const updateNotice = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (payload.content) payload.description = payload.content;

  const notice = await Notice.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  if (!notice) throw new AppError("Notice not found", 404);
  sendSuccess(res, 200, "Notice updated", { notice });
});

export const deleteNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findByIdAndDelete(req.params.id);
  if (!notice) throw new AppError("Notice not found", 404);
  sendSuccess(res, 200, "Notice deleted");
});
