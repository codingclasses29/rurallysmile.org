import { body } from "express-validator";

export const studentValidator = [
  body("name").trim().notEmpty().withMessage("Student name is required"),
  body("fatherName").trim().notEmpty().withMessage("Father name is required"),
  body("motherName").optional().trim(),
  body("mobile")
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Enter valid 10-digit mobile number"),
  body("class")
    .notEmpty()
    .isIn(["7", "8", "9", "10"])
    .withMessage("Class must be 7, 8, 9 or 10"),
  body("schoolName").trim().notEmpty().withMessage("School name is required"),
  body("dob").optional().notEmpty().withMessage("Date of birth is required"),
  body("gender")
    .optional()
    .isIn(["male", "female", "other", "Male", "Female", "Other"])
    .withMessage("Invalid gender"),
  body("district").optional().trim().notEmpty().withMessage("District is required"),
  body("block").optional().trim(),
  body("village").optional().trim(),
  body("address").optional().trim().notEmpty().withMessage("Address is required"),
  body("category").optional().isIn(["General", "OBC", "SC", "ST", "EWS", "Other"]),
  body("state").optional().trim(),
  body("pinCode").optional().trim(),
  body("parentMobile").optional().trim(),
  body("medium").optional().trim(),
];

export const registerStudentValidator = studentValidator;
