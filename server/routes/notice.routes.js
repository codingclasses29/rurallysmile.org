import { Router } from "express";
import {
  createNotice,
  listNotices,
  updateNotice,
  deleteNotice,
} from "../controllers/misc.controller.js";
import protect from "../middleware/auth.middleware.js";
import optionalAuth from "../middleware/optionalAuth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { noticeValidator } from "../validators/notice.validator.js";

const router = Router();

router.get("/", optionalAuth, listNotices);
router.get(
  "/manage",
  protect,
  authorize("SUPER_ADMIN", "ADMIN", "COORDINATOR"),
  (req, res, next) => {
    req.query.all = "1";
    return listNotices(req, res, next);
  }
);
router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  noticeValidator,
  validate,
  createNotice
);
router.put(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  noticeValidator,
  validate,
  updateNotice
);
router.delete("/:id", protect, authorize("SUPER_ADMIN", "ADMIN"), deleteNotice);

export default router;
