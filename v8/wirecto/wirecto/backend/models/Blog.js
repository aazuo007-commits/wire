import mongoose from "mongoose";
import { slugify, ensureUniqueSlug } from "../utils/slugify.js";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true, lowercase: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "BlogCategory" },
    author: { type: String, trim: true, default: "Wirecto Team" },
    coverImage: { type: String },
    excerpt: { type: String, trim: true }, // short summary shown on grid/list cards
    content: { type: String }, // HTML from the rich text editor
    tags: [{ type: String, trim: true }],

    // SEO
    seo: {
      metaTitle: { type: String, trim: true },
      metaDescription: { type: String, trim: true },
      metaKeywords: { type: String, trim: true },
      ogImage: { type: String, trim: true },
      canonicalUrl: { type: String, trim: true },
    },

    order: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }, // acts as "published"
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Auto-generate a unique slug from the title if none was supplied.
blogSchema.pre("validate", async function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
  if (this.isModified("slug") || this.isNew) {
    this.slug = await ensureUniqueSlug(this.constructor, slugify(this.slug || this.title), this._id);
  }
  next();
});

export default mongoose.model("Blog", blogSchema);
