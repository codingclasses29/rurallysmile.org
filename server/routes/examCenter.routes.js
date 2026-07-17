import { Router } from "express";
import {
  createCenter,
  listCenters,
  updateCenter,
  deleteCenter,
} from "../controllers/misc.controller.js";
import protect from "../middleware/auth.middleware.js";
import optionalAuth from "../middleware/optionalAuth.middleware.js";
import authorize from "../middleware/role.middleware.js";

const router = Router();

router.get("/", optionalAuth, listCenters);

router.post("/", protect, authorize("SUPER_ADMIN", "ADMIN"), createCenter);
router.put("/:id", protect, authorize("SUPER_ADMIN", "ADMIN"), updateCenter);
router.delete("/:id", protect, authorize("SUPER_ADMIN", "ADMIN"), deleteCenter);

export default router;
