import multer from "multer";
import path from "path";
import AppError from "../utils/AppError.js";

const excelFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname || "").toLowerCase();
  const allowedExt = [".xlsx", ".xls", ".csv"];
  const allowedMime = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "text/csv",
    "application/csv",
    "text/plain",
    "application/octet-stream",
  ];
  if (allowedExt.includes(ext) || allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Only .xlsx, .xls or .csv files are allowed", 400), false);
  }
};

export const excelUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: excelFilter,
  limits: { fileSize: 8 * 1024 * 1024 },
});

export default excelUpload;
