import { Router } from "express";
import {
  generateAdmit,
  getAdmitByRegistration,
  downloadAdmit,
  downloadAdmitPublic,
  regenerateAdmit,
  listAdmits,
  lookupAdmitAdmin,
  generateAdmitsBulk,
} from "../controllers/admit.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

const router = Router();

router.post(
  "/generate/bulk",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  generateAdmitsBulk
);

router.post(
  "/generate",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  generateAdmit
);

router.get(
  "/",
  protect,
  authorize("SUPER_ADMIN", "ADMIN", "COORDINATOR"),
  listAdmits
);

router.get(
  "/lookup",
  protect,
  authorize("SUPER_ADMIN", "ADMIN", "COORDINATOR"),
  lookupAdmitAdmin
);

router.get(
  "/download/:id",
  protect,
  authorize("SUPER_ADMIN", "ADMIN", "COORDINATOR"),
  downloadAdmit
);

router.put(
  "/regenerate/:id",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  regenerateAdmit
);

/** Public PDF download (English) — verify with reg no + optional mobile/dob */
router.get("/pdf/:registrationNo", downloadAdmitPublic);

// Public fetch by registration number (keep last)
router.get("/:registrationNo", getAdmitByRegistration);

export default router;
