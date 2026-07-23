import express from "express";
import Service from "../models/Service.js";
import { makeCrudRouter } from "./crudFactory.js";

const router = express.Router();

// Public: fetch a single service by its slug, e.g. GET /api/services/slug/web-design-development
// Used by the /services/:slug detail page on the frontend.
router.get("/slug/:slug", async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug.toLowerCase(), isActive: true });
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    res.json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.use("/", makeCrudRouter(Service));

export default router;
