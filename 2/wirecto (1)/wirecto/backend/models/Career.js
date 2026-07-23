import mongoose from "mongoose";
import { slugify, ensureUniqueSlug } from "../utils/slugify.js";

const careerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true, lowercase: true },
    department: { type: String, trim: true },
    location: { type: String, trim: true },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Remote"],
      default: "Full-time",
    },
    experience: { type: String, trim: true }, // e.g. "2-4 years"
    description: { type: String, trim: true },
    requirements: { type: String, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Auto-generate a unique slug from the job title if none was supplied.
careerSchema.pre("validate", async function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
  if (this.isModified("slug") || this.isNew) {
    this.slug = await ensureUniqueSlug(this.constructor, slugify(this.slug || this.title), this._id);
  }
  next();
});

export default mongoose.model("Career", careerSchema);
