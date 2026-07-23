import express from "express";
import Settings from "../models/Settings.js";
import { protect, requireSuperAdmin } from "../middleware/auth.js";

const router = express.Router();

const getOrCreateSettings = async () => {
  let settings = await Settings.findOne({ key: "site" });
  if (!settings) settings = await Settings.create({ key: "site" });
  return settings;
};

// GET /api/settings - public, used by the homepage to know how many services to show
router.get("/", async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/settings - superadmin only
router.put("/", protect, requireSuperAdmin, async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    if (req.body.homeServicesCount !== undefined) {
      settings.homeServicesCount = req.body.homeServicesCount;
    }
    await settings.save();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
