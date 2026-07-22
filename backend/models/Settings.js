import mongoose from "mongoose";

// Singleton-style settings document. We always read/write the single
// document with key "site" so there's only ever one settings record.
const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: "site" },
    homeServicesCount: { type: Number, default: 6, min: 1, max: 24 },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
