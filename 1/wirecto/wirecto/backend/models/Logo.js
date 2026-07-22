import mongoose from "mongoose";

// Only one logo document is meant to be "active" at a time, but we keep
// it as a collection so the admin can upload/keep a history and switch.
const logoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, default: "Wirecto" },
    imageUrl: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Logo", logoSchema);
