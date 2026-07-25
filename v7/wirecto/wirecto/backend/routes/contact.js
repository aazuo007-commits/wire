import express from "express";
import Contact from "../models/Contact.js";
import { protect, requireSuperAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public: submit contact form
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Name, email and message are required" });
    }
    const contact = await Contact.create(req.body);
    res.status(201).json({ success: true, data: contact });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Admin: list messages
router.get("/", protect, requireSuperAdmin, async (req, res) => {
  const items = await Contact.find().sort({ createdAt: -1 });
  res.json({ success: true, data: items });
});

// Admin: mark as read / delete
router.put("/:id/read", protect, requireSuperAdmin, async (req, res) => {
  const item = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
  res.json({ success: true, data: item });
});

router.delete("/:id", protect, requireSuperAdmin, async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Deleted successfully" });
});

export default router;
