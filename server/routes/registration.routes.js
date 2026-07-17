import { Router } from "express";
import {
  createRegistration,
  listRegistrations,
  getRegistration,
  approveRegistration,
  rejectRegistration,
  sendOtp,
  verifyOtp,
  publicRegister,
  registrationStatus,
  downloadReceipt,
  restoreRegistration,
} from "../controllers/registration.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import { uploadStudentDocs } from "../middleware/upload.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { registrationLimiter } from "../middleware/rateLimit.middleware.js";
import {
  sendOtpValidator,
  verifyOtpValidator,
  publicRegistrationValidator,
} from "../validators/registration.validator.js";

const router = Router();

/* ——— Public student registration ——— */
router.post(
  "/send-otp",
  registrationLimiter,
  sendOtpValidator,
  validate,
  sendOtp
);

router.post(
  "/verify-otp",
  registrationLimiter,
  verifyOtpValidator,
  validate,
  verifyOtp
);

router.get("/status", registrationStatus);

router.get("/receipt/:registrationNumber", downloadReceipt);

router.post(
  "/",
  registrationLimiter,
  uploadStudentDocs,
  publicRegistrationValidator,
  validate,
  publicRegister
);

/* ——— Admin ——— */
router.use(protect);

router.post("/admin", authorize("SUPER_ADMIN", "ADMIN", "COORDINATOR"), createRegistration);
router.get("/admin/list", authorize("SUPER_ADMIN", "ADMIN", "COORDINATOR"), listRegistrations);
router.get("/admin/:id", authorize("SUPER_ADMIN", "ADMIN", "COORDINATOR"), getRegistration);
router.put(
  "/approve/:id",
  authorize("SUPER_ADMIN", "ADMIN", "COORDINATOR"),
  approveRegistration
);
router.put(
  "/reject/:id",
  authorize("SUPER_ADMIN", "ADMIN"),
  rejectRegistration
);
router.put(
  "/restore/:id",
  authorize("SUPER_ADMIN", "ADMIN"),
  restoreRegistration
);

// Keep old list path for admins who used GET /
router.get("/", authorize("SUPER_ADMIN", "ADMIN", "COORDINATOR"), listRegistrations);

export default router;
