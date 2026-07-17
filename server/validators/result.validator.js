import { body, param, query } from "express-validator";

export const resultValidator = [
  body("rollNumber").trim().notEmpty().withMessage("Roll number is required"),
  body("marks")
    .notEmpty()
    .withMessage("Marks are required")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Marks must be between 0 and 100"),
];

export const resultQueryValidator = [
  param("rollNumber").trim().notEmpty().withMessage("Roll number is required"),
  query("dob").optional().isISO8601().withMessage("Invalid DOB format"),
];
