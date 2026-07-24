import mongoose from "mongoose";
import { slugify, ensureUniqueSlug } from "../utils/slugify.js";

const policySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true, lowercase: true },
    content: { type: String }, // rich text (HTML)
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Auto-generate a unique slug from the title if none was supplied.
policySchema.pre("validate", async function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
  if (this.isModified("slug") || this.isNew) {
    this.slug = await ensureUniqueSlug(this.constructor, slugify(this.slug || this.title), this._id);
  }
  next();
});

export default mongoose.model("Policy", policySchema);
