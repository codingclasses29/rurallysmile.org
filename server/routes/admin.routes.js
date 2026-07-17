import { Router } from "express";
import {
  getDashboard,
  listStudents,
  approveRegistration,
  rejectRegistration,
  createAdmin,
} from "../controllers/admin.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import { superAdminOnly } from "../middleware/admin.middleware.js";

const router = Router();

router.use(protect);

router.get(
  "/dashboard",
  authorize("SUPER_ADMIN", "ADMIN", "COORDINATOR"),
  getDashboard
);
router.get(
  "/students",
  authorize("SUPER_ADMIN", "ADMIN", "COORDINATOR"),
  listStudents
);
router.patch(
  "/students/:id/approve",
  authorize("SUPER_ADMIN", "ADMIN", "COORDINATOR"),
  approveRegistration
);
router.patch(
  "/students/:id/reject",
  authorize("SUPER_ADMIN", "ADMIN"),
  rejectRegistration
);
router.post("/create", superAdminOnly, createAdmin);

export default router;
