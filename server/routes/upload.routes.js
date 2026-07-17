import { Router } from "express";
import {
  uploadSingleImage,
  uploadPhoto,
  uploadSignature,
} from "../controllers/misc.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

router.use(protect, authorize("SUPER_ADMIN", "ADMIN", "COORDINATOR"));

router.post("/image", upload.single("image"), uploadSingleImage);
router.post("/photo", upload.single("photo"), uploadPhoto);
router.post("/signature", upload.single("signature"), uploadSignature);

export default router;
