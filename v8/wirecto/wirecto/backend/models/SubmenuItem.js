import mongoose from "mongoose";
import { slugify, ensureUniqueSlug } from "../utils/slugify.js";

const submenuItemSchema = new mongoose.Schema(
  {
    parentMenu: { type: mongoose.Schema.Types.ObjectId, ref: "ParentMenu", required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true, lowercase: true },
    shortDescription: { type: String, trim: true, maxlength: 250 },
    description: { type: String }, // full rich text (HTML) content
    featuredImage: { type: String },
    bannerImage: { type: String },

    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    showOnHomepage: { type: Boolean, default: false },

    seo: {
      title: { type: String, trim: true },
      keywords: { type: String, trim: true },
      description: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

// Auto-generate a unique, SEO-friendly slug from the name if none was supplied.
// Slugs are unique across ALL submenu items (not just within one parent), which keeps
// every submenu detail URL /<parentSlug>/<submenuSlug> unambiguous.
submenuItemSchema.pre("validate", async function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }
  if (this.isModified("slug") || this.isNew) {
    this.slug = await ensureUniqueSlug(this.constructor, slugify(this.slug || this.name), this._id);
  }
  next();
});

export default mongoose.model("SubmenuItem", submenuItemSchema);
