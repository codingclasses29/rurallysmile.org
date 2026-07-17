import { Router } from "express";
import {
  login,
  logout,
  profile,
  refreshAccessToken,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import protect from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { loginValidator } from "../validators/auth.validator.js";
import { body } from "express-validator";
import { authLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();

router.post("/login", authLimiter, loginValidator, validate, login);
router.post("/logout", logout);
router.post("/refresh", refreshAccessToken);
router.get("/profile", protect, profile);
router.get("/me", protect, profile);

router.post(
  "/change-password",
  protect,
  [
    body("currentPassword").notEmpty().withMessage("Current password required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password min 6 characters"),
  ],
  validate,
  changePassword
);

router.post(
  "/forgot-password",
  authLimiter,
  [body("email").isEmail().withMessage("Valid email required")],
  validate,
  forgotPassword
);

router.post(
  "/reset-password",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("otp").notEmpty().withMessage("OTP required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password min 6 characters"),
  ],
  validate,
  resetPassword
);

export default router;
