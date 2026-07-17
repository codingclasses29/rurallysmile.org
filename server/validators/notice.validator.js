import { body } from "express-validator";

export const noticeValidator = [
  body("title").trim().notEmpty().withMessage("Notice title is required"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),
  body("content").optional().trim(),
  body("type")
    .optional()
    .isIn(["notice", "exam_update", "result_date", "registration"])
    .withMessage("Invalid notice type"),
  body("published").optional().isBoolean().withMessage("published must be boolean"),
];
