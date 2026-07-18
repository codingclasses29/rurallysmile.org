import { body, query } from "express-validator";

export const sendOtpValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email address")
    .normalizeEmail(),
  body("mobile")
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Enter valid 10-digit mobile"),
];

export const verifyOtpValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email address")
    .normalizeEmail(),
  body("otp").trim().isLength({ min: 4, max: 8 }).withMessage("Enter valid OTP"),
];

export const publicRegistrationValidator = [
  body("name").trim().notEmpty().withMessage("Student name is required"),
  body("fatherName").trim().notEmpty().withMessage("Father name is required"),
  body("motherName").optional().trim(),
  body("dob").notEmpty().withMessage("Date of birth is required"),
  body("gender")
    .notEmpty()
    .isIn(["male", "female", "other", "Male", "Female", "Other"])
    .withMessage("Gender is required"),
  body("category").optional().isIn(["General", "OBC", "SC", "ST", "EWS", "Other"]),
  body("class")
    .notEmpty()
    .isIn(["7", "8", "9", "10"])
    .withMessage("Class must be 7–10"),
  body("schoolName").trim().notEmpty().withMessage("School name is required"),
  body("medium").optional().trim(),
  body("state").optional().trim(),
  body("district").trim().notEmpty().withMessage("District is required"),
  body("block").optional().trim(),
  body("village").optional().trim(),
  body("pinCode")
    .optional({ checkFalsy: true })
    .matches(/^\d{6}$/)
    .withMessage("PIN must be 6 digits"),
  body("address").trim().notEmpty().withMessage("Address is required"),
  body("mobile")
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Enter valid student mobile"),
  body("parentMobile")
    .optional({ checkFalsy: true })
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Enter valid parent mobile"),
  body("whatsapp")
    .optional({ checkFalsy: true })
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Enter valid WhatsApp number"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required for OTP verification")
    .isEmail()
    .withMessage("Enter valid email")
    .normalizeEmail(),
  body("otp").trim().notEmpty().withMessage("OTP is required"),
];

export const statusQueryValidator = [
  query("registrationNumber").optional().trim(),
  query("mobile").optional().trim(),
];
