import express from "express";
import Technology from "../models/Technology.js";
import { makeCrudRouter } from "./crudFactory.js";

const router = express.Router();

/**
 * GET /api/technologies
 *   ?featured=true&limit=N   -> active + featuredOnHome=true, ordered, limited (homepage section)
 *   ?all=true                -> everything, including inactive (admin listing)
 *   (no flags)               -> all active technologies, ordered
 */
router.get("/", async (req, res) => {
  try {
    const { featured, limit, all } = req.query;
    const filter = all === "true" ? {} : { isActive: true };
    if (featured === "true") filter.featuredOnHome = true;

    let query = Technology.find(filter).sort({ order: 1, createdAt: -1 });
    if (featured === "true" && limit) query = query.limit(parseInt(limit, 10) || 8);

    const technologies = await query;
    res.json({ success: true, data: technologies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Public: fetch a single technology by slug, plus a few related technologies for the detail page.
router.get("/slug/:slug", async (req, res) => {
  try {
    const technology = await Technology.findOne({ slug: req.params.slug.toLowerCase(), isActive: true });
    if (!technology) return res.status(404).json({ success: false, message: "Technology not found" });

    const related = await Technology.find({
      _id: { $ne: technology._id },
      isActive: true,
      ...(technology.category ? { category: technology.category } : {}),
    })
      .sort({ order: 1, createdAt: -1 })
      .limit(4);

    // If category-based matching came up short, top off with any other active technologies.
    if (related.length < 4) {
      const existingIds = related.map((r) => r._id).concat(technology._id);
      const extra = await Technology.find({ _id: { $nin: existingIds }, isActive: true })
        .sort({ order: 1, createdAt: -1 })
        .limit(4 - related.length);
      related.push(...extra);
    }

    res.json({ success: true, data: technology, related });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Standard CRUD for everything else: GET /:id, POST /, PUT /:id, DELETE /:id
router.use("/", makeCrudRouter(Technology));

export default router;
