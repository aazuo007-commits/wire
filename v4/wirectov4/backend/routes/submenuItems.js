import express from "express";
import SubmenuItem from "../models/SubmenuItem.js";
import ParentMenu from "../models/ParentMenu.js";
import { makeCrudRouter } from "./crudFactory.js";
import { protect, requireSuperAdmin } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/submenu-items
 *   ?parent=<parentMenuId>            -> active submenu items under one parent, ordered
 *   ?homepage=true&limit=N            -> active + showOnHomepage=true, ordered, limited
 *   ?admin=true&search=&status=&parent=&sortBy=&page=&limit=   -> superadmin, paginated
 *   (no flags)                        -> all active submenu items, ordered
 */
router.get("/", async (req, res) => {
  try {
    const { parent, homepage, admin, search, status, sortBy, page, limit } = req.query;

    if (admin === "true") {
      return protect(req, res, () =>
        requireSuperAdmin(req, res, async () => {
          const filter = {};
          if (status === "active") filter.isActive = true;
          else if (status === "inactive") filter.isActive = false;
          if (parent) filter.parentMenu = parent;

          if (search && search.trim()) {
            const regex = new RegExp(search.trim(), "i");
            filter.$or = [{ name: regex }, { slug: regex }];
          }

          const sort =
            sortBy === "latest"
              ? { createdAt: -1 }
              : sortBy === "oldest"
              ? { createdAt: 1 }
              : { order: 1, createdAt: -1 };

          const pageNum = Math.max(parseInt(page, 10) || 1, 1);
          const pageSize = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

          const [items, total] = await Promise.all([
            SubmenuItem.find(filter)
              .populate("parentMenu", "title slug")
              .sort(sort)
              .skip((pageNum - 1) * pageSize)
              .limit(pageSize),
            SubmenuItem.countDocuments(filter),
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

    const filter = req.query.all === "true" ? {} : { isActive: true };
    if (parent) filter.parentMenu = parent;
    if (homepage === "true") filter.showOnHomepage = true;

    let query = SubmenuItem.find(filter).populate("parentMenu", "title slug").sort({ order: 1, createdAt: -1 });
    if (homepage === "true" && limit) query = query.limit(parseInt(limit, 10) || 4);

    const items = await query;
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * Public: GET /api/submenu-items/lookup/:parentSlug/:submenuSlug
 * Resolves the full /<parentSlug>/<submenuSlug> URL to a submenu item, and
 * returns a handful of related submenu items (same parent, excluding itself)
 * for the "Related" sections on the detail page.
 */
router.get("/lookup/:parentSlug/:submenuSlug", async (req, res) => {
  try {
    const parentMenu = await ParentMenu.findOne({
      slug: req.params.parentSlug.toLowerCase(),
      isActive: true,
    });
    if (!parentMenu) return res.status(404).json({ success: false, message: "Page not found" });

    const item = await SubmenuItem.findOne({
      slug: req.params.submenuSlug.toLowerCase(),
      parentMenu: parentMenu._id,
      isActive: true,
    }).populate("parentMenu", "title slug");
    if (!item) return res.status(404).json({ success: false, message: "Page not found" });

    const related = await SubmenuItem.find({
      parentMenu: parentMenu._id,
      _id: { $ne: item._id },
      isActive: true,
    })
      .sort({ order: 1, createdAt: -1 })
      .limit(3);

    res.json({ success: true, data: item, related });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Standard CRUD for everything else: GET /:id, POST /, PUT /:id, DELETE /:id
router.use("/", makeCrudRouter(SubmenuItem));

export default router;
