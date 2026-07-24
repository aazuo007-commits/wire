import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    client: { type: String, trim: true },
    category: { type: String, trim: true },
    description: { type: String, trim: true },
    imageUrl: { type: String, required: true },
    projectUrl: { type: String, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
