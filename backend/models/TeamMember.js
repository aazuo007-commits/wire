import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, trim: true }, // e.g. "Lead Frontend Developer"
    department: { type: String, trim: true }, // e.g. "Engineering", "Design"
    photo: { type: String },
    bio: { type: String, trim: true },
    linkedinUrl: { type: String, trim: true },
    twitterUrl: { type: String, trim: true },
    email: { type: String, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    showOnHomepage: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("TeamMember", teamMemberSchema);
