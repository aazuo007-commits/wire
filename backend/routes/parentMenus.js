import express from "express";
import ParentMenu from "../models/ParentMenu.js";
import { makeCrudRouter } from "./crudFactory.js";

const router = express.Router();

/**
 * GET /api/parent-menus
 *   ?header=true   -> active parent menus with showInHeader=true, ordered (used by the Navbar)
 *   ?footer=true   -> active parent menus with showInFooter=true, ordered (used by the Footer)
 *   ?all=true      -> everything, including inactive (admin listing)
 *   (no flags)     -> all active parent menus, ordered
 */
router.get("/", async (req, res) => {
  try {
    const { header, footer, all } = req.query;
    const filter = all === "true" ? {} : { isActive: true };
    if (header === "true") filter.showInHeader = true;
    if (footer === "true") filter.showInFooter = true;

    const menus = await ParentMenu.find(filter).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: menus });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Public: fetch a single parent menu by slug (used by the generic /:parentSlug listing page)
router.get("/slug/:slug", async (req, res) => {
  try {
    const menu = await ParentMenu.findOne({ slug: req.params.slug.toLowerCase(), isActive: true });
    if (!menu) return res.status(404).json({ success: false, message: "Menu not found" });
    res.json({ success: true, data: menu });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Standard CRUD for everything else: GET /:id, POST /, PUT /:id, DELETE /:id
router.use("/", makeCrudRouter(ParentMenu));

export default router;
