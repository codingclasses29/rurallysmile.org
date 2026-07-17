import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import * as geminiService from "../services/gemini.service.js";

export const getAiStatus = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, "AI status fetched", geminiService.getGeminiStatus());
});

export const generateNoticeDraft = asyncHandler(async (req, res) => {
  const draft = await geminiService.generateNotice({
    topic: req.body.topic,
    language: req.body.language,
    tone: req.body.tone,
  });
  sendSuccess(res, 200, "Notice draft generated", { draft });
});
