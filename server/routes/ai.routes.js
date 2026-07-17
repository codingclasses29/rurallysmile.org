import { Router } from "express";
import rateLimit from "express-rate-limit";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import {
  generateNoticeDraft,
  getAiStatus,
} from "../controllers/ai.controller.js";

const router = Router();

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many AI requests. Please wait one minute.",
  },
});

router.use(protect, authorize("SUPER_ADMIN", "ADMIN"), aiLimiter);
router.get("/status", getAiStatus);
router.post("/notice-draft", generateNoticeDraft);

export default router;
