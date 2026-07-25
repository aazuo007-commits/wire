import mongoose from "mongoose";
import { slugify, ensureUniqueSlug } from "../utils/slugify.js";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true, lowercase: true },
    client: { type: String, trim: true },
    category: { type: String, trim: true },
    description: { type: String, trim: true },
    imageUrl: { type: String, required: true }, // primary/cover image
    gallery: [{ type: String }], // additional gallery images
    technologiesUsed: [{ type: String, trim: true }],
    features: { type: String, trim: true },
    challenges: { type: String, trim: true },
    solution: { type: String, trim: true },
    results: { type: String, trim: true },
    projectUrl: { type: String, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Auto-generate a unique slug from the title if none was supplied.
projectSchema.pre("validate", async function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
  if (this.isModified("slug") || this.isNew) {
    this.slug = await ensureUniqueSlug(this.constructor, slugify(this.slug || this.title), this._id);
  }
  next();
});

export default mongoose.model("Project", projectSchema);
