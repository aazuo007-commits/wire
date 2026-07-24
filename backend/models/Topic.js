import mongoose from "mongoose";
import { slugify, ensureUniqueSlug } from "../utils/slugify.js";

const topicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true, lowercase: true },
    shortDescription: { type: String, trim: true, maxlength: 250 },
    description: { type: String }, // full rich text (HTML) content
    featuredImage: { type: String },

    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },

    showInNavbar: { type: Boolean, default: false },
    showInFooter: { type: Boolean, default: false },
    showOnHomepage: { type: Boolean, default: false },

    seo: {
      metaTitle: { type: String, trim: true },
      metaDescription: { type: String, trim: true },
      metaKeywords: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

// Auto-generate a unique, SEO-friendly slug from the title if none was supplied.
topicSchema.pre("validate", async function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
  if (this.isModified("slug") || this.isNew) {
    this.slug = await ensureUniqueSlug(this.constructor, slugify(this.slug || this.title), this._id);
  }
  next();
});

export default mongoose.model("Topic", topicSchema);
