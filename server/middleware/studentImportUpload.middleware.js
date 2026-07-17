import path from "path";
import multer from "multer";
import AppError from "../utils/AppError.js";

const filter = (req, file, callback) => {
  const extension = path.extname(file.originalname || "").toLowerCase();
  if (file.fieldname === "excel" && extension === ".xlsx") {
    return callback(null, true);
  }
  if (file.fieldname === "mediaZip" && extension === ".zip") {
    return callback(null, true);
  }
  return callback(
    new AppError(
      file.fieldname === "excel"
        ? "excel must be an .xlsx file"
        : "mediaZip must be a .zip file",
      400
    ),
    false
  );
};

export const studentImportUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: filter,
  limits: {
    files: 2,
    fileSize: 50 * 1024 * 1024,
    fields: 10,
  },
}).fields([
  { name: "excel", maxCount: 1 },
  { name: "mediaZip", maxCount: 1 },
]);

export default studentImportUpload;
