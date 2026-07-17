import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import AppError from "../utils/AppError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|pdf|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new AppError("Only JPEG, PNG, WEBP, PDF files are allowed", 400), false);
  }
};

// Primary: memory storage for Cloudinary
const memoryUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

// Fallback disk storage
const diskUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${path.extname(file.originalname)}`);
    },
  }),
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

const upload = memoryUpload;

export default upload;

export const uploadStudentDocs = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "signature", maxCount: 1 },
  { name: "aadhaarDoc", maxCount: 1 },
  { name: "schoolIdDoc", maxCount: 1 },
]);

export { diskUpload, memoryUpload };
