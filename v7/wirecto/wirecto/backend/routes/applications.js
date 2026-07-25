import express from "express";
import JobApplication from "../models/JobApplication.js";
import { protect, requireSuperAdmin } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/applications?search=...&sort=latest|oldest
 * Admin-only. Searches across name, email, and phone (case-insensitive).
 */
router.get("/", protect, requireSuperAdmin, async (req, res) => {
  try {
    const { search, sort } = req.query;
    const filter = {};

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    const sortOrder = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 }; // default: latest first

    const applications = await JobApplication.find(filter).populate("career", "title slug").sort(sortOrder);
    res.json({ success: true, data: applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/:id", protect, requireSuperAdmin, async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id).populate("career", "title slug");
    if (!application) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/:id/read", protect, requireSuperAdmin, async (req, res) => {
  const application = await JobApplication.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
  res.json({ success: true, data: application });
});

router.delete("/:id", protect, requireSuperAdmin, async (req, res) => {
  const application = await JobApplication.findByIdAndDelete(req.params.id);
  if (!application) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, message: "Deleted successfully" });
});

export default router;
