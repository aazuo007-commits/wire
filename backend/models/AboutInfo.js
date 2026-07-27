import mongoose from "mongoose";

// Singleton-style document (always read/write the one with key "about"),
// same pattern as Settings.
const aboutInfoSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: "about" },
    whoWeAreTitle: { type: String, trim: true, default: "Who We Are" },
    whoWeAreContent: { type: String, default: "" }, // rich text (HTML)
    whoWeAreImage: { type: String, default: "" },
    coreValues: [
      {
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        icon: { type: String, trim: true }, // optional class name or emoji
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("AboutInfo", aboutInfoSchema);
