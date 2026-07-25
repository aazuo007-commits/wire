import express from "express";
import Service from "../models/Service.js";
import Blog from "../models/Blog.js";
import Technology from "../models/Technology.js";
import Topic from "../models/Topic.js";
import Project from "../models/Project.js";
import SubmenuItem from "../models/SubmenuItem.js";

const router = express.Router();

// GET /api/search?q=...
// Public, site-wide search across the main public content types. Returns a flat,
// unified array so the frontend can render one combined results list.
router.get("/", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json({ success: true, data: [] });

    const regex = new RegExp(q, "i");
    const LIMIT = 8;

    const [services, blogs, technologies, topics, projects, submenuItems] = await Promise.all([
      Service.find({ isActive: true, $or: [{ title: regex }, { shortDescription: regex }] }).limit(LIMIT),
      Blog.find({ isActive: true, $or: [{ title: regex }, { excerpt: regex }] }).limit(LIMIT),
      Technology.find({ isActive: true, $or: [{ name: regex }, { shortDescription: regex }] }).limit(LIMIT),
      Topic.find({ isActive: true, $or: [{ title: regex }, { shortDescription: regex }] }).limit(LIMIT),
      Project.find({ isActive: true, $or: [{ title: regex }, { description: regex }] }).limit(LIMIT),
      SubmenuItem.find({ isActive: true, $or: [{ name: regex }, { shortDescription: regex }] })
        .populate("parentMenu", "title slug")
        .limit(LIMIT),
    ]);

    const results = [
      ...services.map((s) => ({
        type: "Service",
        title: s.title,
        description: s.shortDescription,
        url: `/services/${s.slug}`,
      })),
      ...blogs.map((b) => ({
        type: "Blog",
        title: b.title,
        description: b.excerpt,
        url: `/blog/${b.slug}`,
      })),
      ...technologies.map((t) => ({
        type: "Technology",
        title: t.name,
        description: t.shortDescription,
        url: `/technologies/${t.slug}`,
      })),
      ...topics.map((t) => ({
        type: "Topic",
        title: t.title,
        description: t.shortDescription,
        url: `/topics/${t.slug}`,
      })),
      ...projects.map((p) => ({
        type: "Project",
        title: p.title,
        description: p.category,
        url: `/projects/${p.slug}`,
      })),
      ...submenuItems
        .filter((item) => item.parentMenu)
        .map((item) => ({
          type: item.parentMenu.title,
          title: item.name,
          description: item.shortDescription,
          url: `/${item.parentMenu.slug}/${item.slug}`,
        })),
    ];

    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
