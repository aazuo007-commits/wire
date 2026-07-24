import express from "express";
import Blog from "../models/Blog.js";
import BlogCategory from "../models/BlogCategory.js";
import { makeCrudRouter } from "./crudFactory.js";

const router = express.Router();

// Public: fetch a single blog post by slug, e.g. GET /api/blogs/slug/my-first-post
router.get("/slug/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug.toLowerCase(), isActive: true }).populate(
      "category",
      "name slug"
    );
    if (!blog) return res.status(404).json({ success: false, message: "Blog post not found" });
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Public: fetch all blog posts in one category, e.g. GET /api/blogs/category/web-development
router.get("/category/:categorySlug", async (req, res) => {
  try {
    const category = await BlogCategory.findOne({ slug: req.params.categorySlug.toLowerCase() });
    if (!category) return res.json({ success: true, data: [] });
    const blogs = await Blog.find({ category: category._id, isActive: true })
      .populate("category", "name slug")
      .sort({ publishedAt: -1 });
    res.json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Override the factory's public list so blogs come back newest-first with category populated.
router.get("/", async (req, res) => {
  try {
    const includeInactive = req.query.all === "true";
    const filter = includeInactive ? {} : { isActive: true };
    const blogs = await Blog.find(filter).populate("category", "name slug").sort({ publishedAt: -1 });
    res.json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Standard CRUD for everything else: GET /:id, POST /, PUT /:id, DELETE /:id
router.use("/", makeCrudRouter(Blog, { sortField: "publishedAt" }));

export default router;
