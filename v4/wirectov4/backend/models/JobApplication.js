import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    career: { type: mongoose.Schema.Types.ObjectId, ref: "Career", required: true },
    careerTitle: { type: String, trim: true }, // snapshot, so it still reads well if the job is later edited/removed
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    experience: { type: String, required: true, trim: true }, // in years
    location: { type: String, required: true, trim: true },
    resumeUrl: { type: String, required: true },
    comment: { type: String, trim: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("JobApplication", jobApplicationSchema);
