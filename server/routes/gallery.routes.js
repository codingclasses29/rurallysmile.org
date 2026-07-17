import { Router } from "express";
import {
  createGallery,
  listGallery,
  deleteGallery,
} from "../controllers/misc.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

router.get("/", listGallery);
router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  upload.single("image"),
  createGallery
);
router.delete("/:id", protect, authorize("SUPER_ADMIN", "ADMIN"), deleteGallery);

export default router;
