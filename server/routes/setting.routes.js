import { Router } from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/misc.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

const router = Router();

router.get("/", getSettings);
router.put("/", protect, authorize("SUPER_ADMIN", "ADMIN"), updateSettings);

export default router;
