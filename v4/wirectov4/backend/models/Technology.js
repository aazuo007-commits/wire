import mongoose from "mongoose";

const technologySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, trim: true }, // e.g. Frontend, Backend, Mobile, Database
    logoUrl: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Technology", technologySchema);
