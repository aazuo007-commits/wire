import express from "express";
import Template from "../models/Template.js";
import { makeCrudRouter } from "./crudFactory.js";
import { protect, requireSuperAdmin } from "../middleware/auth.js";

const router = express.Router();

// Standard CRUD: GET /, GET /:id, POST /, PUT /:id, DELETE /:id
router.use("/", makeCrudRouter(Template));

/**
 * POST /api/templates/import
 * Body: { name, key, sourceUrl, placement }
 *
 * Fetches JSON (or HTML) from ANY external REST API URL and saves it
 * as a new Template document. This is how "add any template from REST API"
 * is implemented: the admin supplies a URL, the backend calls it server-side
 * (avoids CORS issues) and stores the result, ready to render on the site.
 */
router.post("/import", protect, requireSuperAdmin, async (req, res) => {
  try {
    const { name, key, sourceUrl, placement } = req.body;
    if (!name || !key || !sourceUrl) {
      return res.status(400).json({ success: false, message: "name, key and sourceUrl are required" });
    }

    const response = await fetch(sourceUrl, { headers: { Accept: "application/json, text/html;q=0.9" } });
    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: `Failed to fetch template from source (status ${response.status})`,
      });
    }

    const contentType = response.headers.get("content-type") || "";
    let content;
    let type;

    if (contentType.includes("application/json")) {
      content = await response.json();
      type = "json";
    } else {
      content = await response.text();
      type = "html";
    }

    const template = await Template.create({
      name,
      key: key.toLowerCase(),
      type,
      content,
      sourceUrl,
      placement: placement || "custom",
    });

    res.status(201).json({ success: true, data: template });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/templates/:id/resync
 * Re-fetches an already-imported template from its original sourceUrl,
 * useful when the external API's content has changed.
 */
router.post("/:id/resync", protect, requireSuperAdmin, async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ success: false, message: "Not found" });
    if (!template.sourceUrl) {
      return res.status(400).json({ success: false, message: "This template has no sourceUrl to resync from" });
    }

    const response = await fetch(template.sourceUrl, {
      headers: { Accept: "application/json, text/html;q=0.9" },
    });
    if (!response.ok) {
      return res.status(502).json({ success: false, message: `Resync failed (status ${response.status})` });
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      template.content = await response.json();
      template.type = "json";
    } else {
      template.content = await response.text();
      template.type = "html";
    }

    await template.save();
    res.json({ success: true, data: template });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/templates/by-key/:key  (public - used by the frontend to render a specific template)
router.get("/by-key/:key", async (req, res) => {
  const template = await Template.findOne({ key: req.params.key.toLowerCase(), isActive: true });
  if (!template) return res.status(404).json({ success: false, message: "Template not found" });
  res.json({ success: true, data: template });
});

export default router;
