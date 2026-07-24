import mongoose from "mongoose";
import { slugify, ensureUniqueSlug } from "../utils/slugify.js";

const blogCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true, lowercase: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Auto-generate a unique slug from the category name if none was supplied.
blogCategorySchema.pre("validate", async function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }
  if (this.isModified("slug") || this.isNew) {
    this.slug = await ensureUniqueSlug(this.constructor, slugify(this.slug || this.name), this._id);
  }
  next();
});

export default mongoose.model("BlogCategory", blogCategorySchema);
