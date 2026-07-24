import express from "express";
import Career from "../models/Career.js";
import JobApplication from "../models/JobApplication.js";
import { makeCrudRouter } from "./crudFactory.js";
import { protect, requireSuperAdmin } from "../middleware/auth.js";
import { uploadResume, uploadBufferToCloudinary } from "../middleware/upload.js";

const router = express.Router();

// Public: fetch a single career posting by slug, e.g. GET /api/careers/slug/frontend-developer
router.get("/slug/:slug", async (req, res) => {
  try {
    const career = await Career.findOne({ slug: req.params.slug.toLowerCase(), isActive: true });
    if (!career) return res.status(404).json({ success: false, message: "Job posting not found" });
    res.json({ success: true, data: career });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * Public: POST /api/careers/:id/apply
 * Multipart form: name, email, phone, experience, location, comment, resume (file)
 * This is the "Apply Now" form submission from a job's detail page.
 */
router.post("/:id/apply", uploadResume.single("resume"), async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ success: false, message: "Job posting not found" });

    const { name, email, phone, experience, location, comment } = req.body;
    if (!name || !email || !phone || !experience || !location) {
      return res.status(400).json({ success: false, message: "All required fields must be filled" });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Resume file (PDF or DOC/DOCX) is required" });
    }

    const uploaded = await uploadBufferToCloudinary(req.file, "wirecto/resumes");

    const application = await JobApplication.create({
      career: career._id,
      careerTitle: career.title,
      name,
      email,
      phone,
      experience,
      location,
      comment,
      resumeUrl: uploaded.url,
    });

    res.status(201).json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || "Application submission failed" });
  }
});

// Admin: list applications for one specific job posting
router.get("/:id/applications", protect, requireSuperAdmin, async (req, res) => {
  try {
    const applications = await JobApplication.find({ career: req.params.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Standard CRUD: GET /, GET /:id, POST /, PUT /:id, DELETE /:id
router.use("/", makeCrudRouter(Career));

export default router;
