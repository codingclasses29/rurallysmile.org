import { Router } from "express";
import {
  createResult,
  listResults,
  getResultByRoll,
  updateResult,
  deleteResult,
  publishResults,
  getMeritList,
  lookupResultAdmin,
  getImportSheetConfig,
  downloadSampleResultExcel,
  previewExcelImport,
  importExcelResults,
  previewGoogleSheet,
  syncGoogleSheet,
  publishResult,
  recalculateMerit,
} from "../controllers/result.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { resultValidator } from "../validators/result.validator.js";
import { excelUpload } from "../middleware/excelUpload.middleware.js";

const router = Router();
const adminOnly = [protect, authorize("SUPER_ADMIN", "ADMIN")];

router.get("/merit", getMeritList);

router.post("/publish", ...adminOnly, publishResults);
router.post("/merit/recalculate", ...adminOnly, recalculateMerit);
router.post("/:id/publish", ...adminOnly, publishResult);

router.get(
  "/lookup",
  protect,
  authorize("SUPER_ADMIN", "ADMIN", "COORDINATOR"),
  lookupResultAdmin
);

/* Data Import Center — Excel + Google Sheets */
router.get("/import/config", ...adminOnly, getImportSheetConfig);
router.get("/import/sample", ...adminOnly, downloadSampleResultExcel);
router.post(
  "/import/excel/preview",
  ...adminOnly,
  excelUpload.single("file"),
  previewExcelImport
);
router.post(
  "/import/excel",
  ...adminOnly,
  excelUpload.single("file"),
  importExcelResults
);
router.post("/import/google/preview", ...adminOnly, previewGoogleSheet);
router.post("/import/google/sync", ...adminOnly, syncGoogleSheet);

router.get("/", ...adminOnly, listResults);

router.post("/", ...adminOnly, resultValidator, validate, createResult);

router.put("/:id", ...adminOnly, updateResult);
router.delete("/:id", ...adminOnly, deleteResult);

// Public result by roll — keep near end
router.get("/:rollNumber", getResultByRoll);

export default router;
