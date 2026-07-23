import mongoose from "mongoose";

const careerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
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

export default mongoose.model("Career", careerSchema);
