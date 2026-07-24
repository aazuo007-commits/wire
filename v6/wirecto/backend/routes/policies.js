import express from "express";
import Policy from "../models/Policy.js";
import { makeCrudRouter } from "./crudFactory.js";

const router = express.Router();

// Public: fetch a single policy page by slug, e.g. GET /api/policies/slug/privacy-policy
router.get("/slug/:slug", async (req, res) => {
  try {
    const policy = await Policy.findOne({ slug: req.params.slug.toLowerCase(), isActive: true });
    if (!policy) return res.status(404).json({ success: false, message: "Policy not found" });
    res.json({ success: true, data: policy });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Standard CRUD: GET /, GET /:id, POST /, PUT /:id, DELETE /:id (list defaults to active-only, ordered)
router.use("/", makeCrudRouter(Policy));

export default router;
