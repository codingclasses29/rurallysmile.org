import cloudinary from "../config/cloudinary.js";
import ApiError from "../utils/ApiError.js";

function looksLikeImageBuffer(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) return false;
  // JPEG
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true;
  // PNG
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return true;
  }
  // GIF
  if (buffer.subarray(0, 6).toString("ascii") === "GIF87a" ||
      buffer.subarray(0, 6).toString("ascii") === "GIF89a") {
    return true;
  }
  // WEBP
  if (
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return true;
  }
  return false;
}

/**
 * Upload multer memory file buffer to Cloudinary as an image
 * @param {Express.Multer.File} file
 * @param {string} folder
 */
export const uploadImage = async (file, folder = "examportal") => {
  if (!file?.buffer) {
    throw new ApiError(400, "No file provided for upload");
  }

  if (!looksLikeImageBuffer(file.buffer)) {
    throw new ApiError(
      400,
      "Invalid image file (expected JPEG/PNG/WEBP). Please re-select the photo."
    );
  }

  const mime = file.mimetype || "image/jpeg";
  if (mime.startsWith("image/") === false && mime !== "application/octet-stream") {
    throw new ApiError(400, "Only image uploads are allowed for this field");
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        format: "jpg",
        transformation: [{ quality: "auto:good" }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(file.buffer);
  });
};

export const uploadMultiple = async (files = [], folder = "examportal") => {
  const results = {};
  for (const [field, fileList] of Object.entries(files)) {
    if (fileList?.[0]) {
      const uploaded = await uploadImage(fileList[0], folder);
      results[field] = uploaded.secure_url;
    }
  }
  return results;
};

export default { uploadImage, uploadMultiple };
