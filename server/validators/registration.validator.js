import { body, query } from "express-validator";

export const sendOtpValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email address")
    .customSanitizer((v) => String(v || "").trim().toLowerCase()),
];

export const verifyOtpValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email address")
    .customSanitizer((v) => String(v || "").trim().toLowerCase()),
  body("otp").trim().isLength({ min: 4, max: 8 }).withMessage("Enter valid OTP"),
];

export const publicRegistrationValidator = [
  body("schoolName").trim().notEmpty().withMessage("School name is required"),
  body("name").trim().notEmpty().withMessage("Student name is required"),
  body("gender")
    .notEmpty()
    .isIn(["male", "female", "other", "Male", "Female", "Other"])
    .withMessage("Gender is required"),
  body("class")
    .notEmpty()
    .isIn(["7", "8", "9", "10"])
    .withMessage("Class must be 7, 8, 9 or 10"),
  body("schoolRollNo").optional().trim(),
  body("fatherName").trim().notEmpty().withMessage("Father name is required"),
  body("mobile")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Enter a valid 10-digit mobile number"),
  body("villagePost").optional().trim(),
  body("village").optional().trim(),
  body("motherName").optional().trim(),
  body("dob").optional({ checkFalsy: true }),
  body("medium").optional().trim(),
  body("state").optional().trim(),
  body("district").optional().trim(),
  body("block").optional().trim(),
  body("pinCode")
    .optional({ checkFalsy: true })
    .matches(/^\d{6}$/)
    .withMessage("PIN must be 6 digits"),
];

export const statusQueryValidator = [
  query("registrationNumber").optional().trim(),
  query("mobile").optional().trim(),
];
