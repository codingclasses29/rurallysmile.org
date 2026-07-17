import { Router } from "express";
import {
  registerStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  searchStudents,
  restoreStudent,
  downloadStudentImportSample,
  previewStudentImport,
  executeStudentImport,
  downloadStudentMediaSample,
} from "../controllers/student.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import { uploadStudentDocs } from "../middleware/upload.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { studentValidator } from "../validators/student.validator.js";
import { registrationLimiter } from "../middleware/rateLimit.middleware.js";
import { studentImportUpload } from "../middleware/studentImportUpload.middleware.js";

const router = Router();

router.post(
  "/register",
  registrationLimiter,
  uploadStudentDocs,
  studentValidator,
  validate,
  registerStudent
);

router.get(
  "/search",
  protect,
  authorize("SUPER_ADMIN", "ADMIN", "COORDINATOR"),
  searchStudents
);

router.get(
  "/",
  protect,
  authorize("SUPER_ADMIN", "ADMIN", "COORDINATOR"),
  getStudents
);

router.get(
  "/import/sample",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  downloadStudentImportSample
);

router.get(
  "/import/media-sample",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  downloadStudentMediaSample
);

router.post(
  "/import/preview",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  studentImportUpload,
  previewStudentImport
);

router.post(
  "/import",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  studentImportUpload,
  executeStudentImport
);

router.get(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "ADMIN", "COORDINATOR"),
  getStudentById
);

router.put(
  "/:id/restore",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  restoreStudent
);

router.put(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  updateStudent
);

router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  deleteStudent
);

export default router;
