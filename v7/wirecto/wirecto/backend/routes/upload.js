import express from "express";
import { protect, requireSuperAdmin } from "../middleware/auth.js";
import upload, { uploadBufferToCloudinary } from "../middleware/upload.js";

const router = express.Router();

// POST /api/upload  (field name: "image")
// Accepts images, video (mp4/webm/mov), PDF, and DOC/DOCX. Uploads straight to Cloudinary.
router.post("/", protect, requireSuperAdmin, upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  try {
    const result = await uploadBufferToCloudinary(req.file, "wirecto");
    res.status(201).json({
      success: true,
      url: result.url,
      resourceType: result.resourceType, // "image" | "video" | "raw"
      format: result.format,
      originalName: result.originalName,
    });
  } catch (err) {
    res.status(502).json({ success: false, message: err.message || "Cloudinary upload failed" });
  }
});

export default router;
