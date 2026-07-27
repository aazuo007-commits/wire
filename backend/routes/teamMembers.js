import express from "express";
import TeamMember from "../models/TeamMember.js";
import { makeCrudRouter } from "./crudFactory.js";

const router = express.Router();

/**
 * GET /api/team-members
 *   ?homepage=true&limit=N   -> active + showOnHomepage=true, ordered, limited
 *   ?all=true                -> everything, including inactive (admin listing)
 *   (no flags)               -> all active members, ordered
 */
router.get("/", async (req, res) => {
  try {
    const { homepage, limit, all } = req.query;
    const filter = all === "true" ? {} : { isActive: true };
    if (homepage === "true") filter.showOnHomepage = true;

    let query = TeamMember.find(filter).sort({ order: 1, createdAt: 1 });
    if (homepage === "true" && limit) query = query.limit(parseInt(limit, 10) || 4);

    const members = await query;
    res.json({ success: true, data: members });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Standard CRUD for everything else: GET /:id, POST /, PUT /:id, DELETE /:id
router.use("/", makeCrudRouter(TeamMember));

export default router;
