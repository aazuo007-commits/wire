import mongoose from "mongoose";
import { slugify, ensureUniqueSlug } from "../utils/slugify.js";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true, lowercase: true },
    shortDescription: { type: String, trim: true },
    description: { type: String, trim: true },
    imageUrl: { type: String },
    videoUrl: { type: String }, // optional short intro/demo video (Cloudinary)
    brochureUrl: { type: String }, // optional PDF/DOC brochure or spec sheet (Cloudinary)
    icon: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Auto-generate a unique slug from the title if none was supplied (or re-derive
// it if the title changed and no explicit slug override was given at the same time).
serviceSchema.pre("validate", async function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
  if (this.isModified("slug") || this.isNew) {
    this.slug = await ensureUniqueSlug(this.constructor, slugify(this.slug || this.title), this._id);
  }
  next();
});

export default mongoose.model("Service", serviceSchema);
