import mongoose from "mongoose";
import { slugify, ensureUniqueSlug } from "../utils/slugify.js";

const technologySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true, lowercase: true },
    category: { type: String, trim: true }, // e.g. Frontend, Backend, Mobile, Database
    logoUrl: { type: String, required: true },
    bannerImage: { type: String },
    shortDescription: { type: String, trim: true, maxlength: 250 },
    description: { type: String }, // full rich text (HTML)
    keyFeatures: [{ type: String, trim: true }],
    benefits: [{ type: String, trim: true }],
    order: { type: Number, default: 0 },
    featuredOnHome: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Auto-generate a unique slug from the name if none was supplied.
technologySchema.pre("validate", async function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }
  if (this.isModified("slug") || this.isNew) {
    this.slug = await ensureUniqueSlug(this.constructor, slugify(this.slug || this.name), this._id);
  }
  next();
});

export default mongoose.model("Technology", technologySchema);
