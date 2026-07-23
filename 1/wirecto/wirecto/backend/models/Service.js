import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
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

export default mongoose.model("Service", serviceSchema);
