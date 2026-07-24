import mongoose from "mongoose";

// A "Template" is a flexible content block that can be:
//  - typed in directly by the admin (html/json), or
//  - imported from any external REST API (sourceUrl) and cached locally.
const templateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    key: { type: String, required: true, unique: true, trim: true, lowercase: true }, // used to fetch/render it, e.g. "home-hero-alt"
    type: { type: String, enum: ["html", "json", "external-url"], default: "html" },
    content: { type: mongoose.Schema.Types.Mixed }, // HTML string, or arbitrary JSON, depending on `type`
    sourceUrl: { type: String, trim: true }, // the external REST API this was imported from (if any)
    placement: { type: String, trim: true, default: "custom" }, // e.g. "home", "about", "footer", "custom"
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Template", templateSchema);
