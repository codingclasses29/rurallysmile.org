import { body } from "express-validator";

export const noticeValidator = [
  body("title").trim().notEmpty().withMessage("Notice title is required"),
  body("description")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 1 })
    .withMessage("Description cannot be empty"),
  body("content").optional({ values: "falsy" }).trim(),
  body("titleHindi").optional({ values: "falsy" }).trim(),
  body("descriptionHindi").optional({ values: "falsy" }).trim(),
  body("type")
    .optional({ values: "falsy" })
    .isIn(["notice", "exam_update", "result_date", "registration"])
    .withMessage("Invalid notice type"),
  body("published")
    .optional()
    .isBoolean()
    .withMessage("published must be boolean"),
  body("isPinned").optional().isBoolean().withMessage("isPinned must be boolean"),
];
