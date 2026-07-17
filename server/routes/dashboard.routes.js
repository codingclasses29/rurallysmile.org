import { Router } from "express";
import {
  adminDashboard,
  studentDashboard,
  statistics,
  publicStats,
} from "../controllers/misc.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

const router = Router();

/** Public snapshot for homepage counters (no secrets) */
router.get("/public", publicStats);

router.get(
  "/admin",
  protect,
  authorize("SUPER_ADMIN", "ADMIN", "COORDINATOR"),
  adminDashboard
);
router.get("/student", protect, studentDashboard);
router.get(
  "/statistics",
  protect,
  authorize("SUPER_ADMIN", "ADMIN", "COORDINATOR"),
  statistics
);

export default router;
