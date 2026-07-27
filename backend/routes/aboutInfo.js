import express from "express";
import AboutInfo from "../models/AboutInfo.js";
import { protect, requireSuperAdmin } from "../middleware/auth.js";

const router = express.Router();

const getOrCreateAboutInfo = async () => {
  let info = await AboutInfo.findOne({ key: "about" });
  if (!info) info = await AboutInfo.create({ key: "about" });
  return info;
};

// GET /api/about-info - public
router.get("/", async (req, res) => {
  try {
    const info = await getOrCreateAboutInfo();
    res.json({ success: true, data: info });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/about-info - superadmin only
router.put("/", protect, requireSuperAdmin, async (req, res) => {
  try {
    const info = await getOrCreateAboutInfo();
    if (req.body.whoWeAreTitle !== undefined) info.whoWeAreTitle = req.body.whoWeAreTitle;
    if (req.body.whoWeAreContent !== undefined) info.whoWeAreContent = req.body.whoWeAreContent;
    if (req.body.whoWeAreImage !== undefined) info.whoWeAreImage = req.body.whoWeAreImage;
    if (req.body.coreValues !== undefined) info.coreValues = req.body.coreValues;
    await info.save();
    res.json({ success: true, data: info });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
