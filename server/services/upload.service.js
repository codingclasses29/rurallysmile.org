import cloudinary from "../config/cloudinary.js";
import ApiError from "../utils/ApiError.js";

/**
 * Upload multer memory file buffer to Cloudinary
 * @param {Express.Multer.File} file
 * @param {string} folder
 */
export const uploadImage = async (file, folder = "examportal") => {
  if (!file?.buffer) {
    throw new ApiError(400, "No file provided for upload");
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
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
