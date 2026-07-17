import { Router } from "express";
import {
  listExamCenters,
  createExamCenter,
  updateExamCenter,
  deleteExamCenter,
} from "../controllers/exam.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = Router();

router.get("/", listExamCenters);

router.use(protect, adminOnly);
router.post("/", createExamCenter);
router.put("/:id", updateExamCenter);
router.delete("/:id", deleteExamCenter);

export default router;
