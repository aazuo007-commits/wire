import express from "express";
import { protect, requireSuperAdmin } from "../middleware/auth.js";

/**
 * Builds a standard CRUD router for a given Mongoose model.
 *
 * Public routes:
 *   GET    /            -> list active items (sorted)
 *   GET    /:id         -> get single item
 *
 * Protected (superadmin) routes:
 *   POST   /            -> create
 *   PUT    /:id         -> update
 *   DELETE /:id         -> delete
 */
export function makeCrudRouter(Model, { sortField = "order", publicFilter = { isActive: true } } = {}) {
  const router = express.Router();

  // Public: list
  router.get("/", async (req, res) => {
    try {
      const includeInactive = req.query.all === "true";
      const filter = includeInactive ? {} : publicFilter;
      const items = await Model.find(filter).sort({ [sortField]: 1, createdAt: -1 });
      res.json({ success: true, data: items });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // Public: single
  router.get("/:id", async (req, res) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: "Not found" });
      res.json({ success: true, data: item });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // Protected: create
  router.post("/", protect, requireSuperAdmin, async (req, res) => {
    try {
      const item = await Model.create(req.body);
      res.status(201).json({ success: true, data: item });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  // Protected: update
  router.put("/:id", protect, requireSuperAdmin, async (req, res) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!item) return res.status(404).json({ success: false, message: "Not found" });
      res.json({ success: true, data: item });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  // Protected: delete
  router.delete("/:id", protect, requireSuperAdmin, async (req, res) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: "Not found" });
      res.json({ success: true, message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  return router;
}
