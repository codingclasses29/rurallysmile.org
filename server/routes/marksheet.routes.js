import { Router } from "express";
import {
  getMarksheet,
  downloadMarksheet,
  verifyMarksheet,
} from "../controllers/result.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import optionalAuth from "../middleware/optionalAuth.middleware.js";

const router = Router();

router.get("/verify/:qr", verifyMarksheet);
router.get("/download/:id", optionalAuth, downloadMarksheet);
router.get(
  "/admin/download/:id",
  protect,
  authorize("SUPER_ADMIN", "ADMIN", "COORDINATOR"),
  downloadMarksheet
);
router.get("/:rollNumber", getMarksheet);

export default router;
