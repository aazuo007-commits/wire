import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const ALLOWED_MIME = [
  // images
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  // video
  "video/mp4",
  "video/webm",
  "video/quicktime",
  // documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME.includes(file.mimetype)) return cb(null, true);
  cb(new Error("Unsupported file type. Allowed: images, video (mp4/webm/mov), PDF, DOC/DOCX."));
};

// Keep the file in memory; we stream it straight to Cloudinary (no local disk writes).
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB, generous enough for short videos/docs
});

const resourceTypeFor = (mimetype) => {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  return "raw"; // pdf, doc, docx, etc.
};

/**
 * Uploads a buffer (from multer memoryStorage) to Cloudinary.
 * Returns { url, resourceType, format, originalName }.
 */
export const uploadBufferToCloudinary = (file, folder = "wirecto") =>
  new Promise((resolve, reject) => {
    const resource_type = resourceTypeFor(file.mimetype);
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type,
        use_filename: true,
        unique_filename: true,
        // For raw files (pdf/doc), Cloudinary needs the extension kept for correct delivery/download.
        filename_override: file.originalname,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          resourceType: result.resource_type,
          format: result.format,
          publicId: result.public_id,
          originalName: file.originalname,
        });
      }
    );
    stream.end(file.buffer);
  });

export default upload;
