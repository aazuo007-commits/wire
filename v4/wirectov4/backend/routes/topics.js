import express from "express";
import Topic from "../models/Topic.js";
import { makeCrudRouter } from "./crudFactory.js";
import { protect, requireSuperAdmin } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/topics
 * A single endpoint that serves several different consumers via query flags,
 * so the frontend doesn't need separate routes for each placement:
 *
 *   ?navbar=true                -> active topics with showInNavbar=true, ordered
 *   ?footer=true                -> active topics with showInFooter=true, ordered
 *   ?homepage=true&limit=4      -> active topics with showOnHomepage=true, ordered, limited
 *   ?admin=true&search=&status=&sortBy=&page=&limit=  -> superadmin-only paginated list
 *   (no flags)                  -> all active topics, ordered (used by the public /topics listing page)
 */
router.get("/", async (req, res) => {
  try {
    const { navbar, footer, homepage, admin, search, status, sortBy, page, limit } = req.query;

    if (admin === "true") {
      // Admin listing: requires auth, supports search/filter/sort/pagination.
      return protect(req, res, () =>
        requireSuperAdmin(req, res, async () => {
          const filter = {};
          if (status === "active") filter.isActive = true;
          else if (status === "inactive") filter.isActive = false;

          if (search && search.trim()) {
            const regex = new RegExp(search.trim(), "i");
            filter.$or = [{ title: regex }, { slug: regex }];
          }

          const sort =
            sortBy === "latest"
              ? { createdAt: -1 }
              : sortBy === "oldest"
              ? { createdAt: 1 }
              : { order: 1, createdAt: -1 }; // default: display order

          const pageNum = Math.max(parseInt(page, 10) || 1, 1);
          const pageSize = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

          const [items, total] = await Promise.all([
            Topic.find(filter)
              .sort(sort)
              .skip((pageNum - 1) * pageSize)
              .limit(pageSize),
            Topic.countDocuments(filter),
          ]);

          res.json({
            success: true,
            data: items,
            total,
            page: pageNum,
            pages: Math.max(Math.ceil(total / pageSize), 1),
          });
        })
      );
    }

    // Public feeds
    const filter = req.query.all === "true" ? {} : { isActive: true };
    if (navbar === "true") filter.showInNavbar = true;
    if (footer === "true") filter.showInFooter = true;
    if (homepage === "true") filter.showOnHomepage = true;

    let query = Topic.find(filter).sort({ order: 1, createdAt: -1 });
    if (homepage === "true" && limit) query = query.limit(parseInt(limit, 10) || 4);

    const topics = await query;
    res.json({ success: true, data: topics });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Public: fetch a single topic by slug, plus a few related (active) topics for the detail page.
router.get("/slug/:slug", async (req, res) => {
  try {
    const topic = await Topic.findOne({ slug: req.params.slug.toLowerCase(), isActive: true });
    if (!topic) return res.status(404).json({ success: false, message: "Topic not found" });

    const related = await Topic.find({ _id: { $ne: topic._id }, isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(3);

    res.json({ success: true, data: topic, related });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Standard CRUD for everything else: GET /:id, POST /, PUT /:id, DELETE /:id
// (the factory's own GET "/" is registered after ours above, so it never runs for the root path)
router.use("/", makeCrudRouter(Topic));

export default router;
