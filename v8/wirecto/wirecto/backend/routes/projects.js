import express from "express";
import Project from "../models/Project.js";
import { makeCrudRouter } from "./crudFactory.js";

const router = express.Router();

// Public: fetch a single project by slug, plus 4-6 related projects (same category,
// topped off with the latest projects if there aren't enough in that category).
router.get("/slug/:slug", async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug.toLowerCase(), isActive: true });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const related = await Project.find({
      _id: { $ne: project._id },
      isActive: true,
      ...(project.category ? { category: project.category } : {}),
    })
      .sort({ order: 1, createdAt: -1 })
      .limit(6);

    if (related.length < 6) {
      const existingIds = related.map((r) => r._id).concat(project._id);
      const extra = await Project.find({ _id: { $nin: existingIds }, isActive: true })
        .sort({ createdAt: -1 })
        .limit(6 - related.length);
      related.push(...extra);
    }

    res.json({ success: true, data: project, related });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Standard CRUD for everything else: GET /, GET /:id, POST /, PUT /:id, DELETE /:id
router.use("/", makeCrudRouter(Project));

export default router;
