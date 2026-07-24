import mongoose from "mongoose";
import { slugify, ensureUniqueSlug } from "../utils/slugify.js";

const parentMenuSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true, lowercase: true },
    icon: { type: String, trim: true }, // optional icon class name or emoji
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    showInHeader: { type: Boolean, default: true },
    showInFooter: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-generate a unique slug from the title if none was supplied.
parentMenuSchema.pre("validate", async function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
  if (this.isModified("slug") || this.isNew) {
    this.slug = await ensureUniqueSlug(this.constructor, slugify(this.slug || this.title), this._id);
  }
  next();
});

export default mongoose.model("ParentMenu", parentMenuSchema);
