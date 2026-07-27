import mongoose from "mongoose";

// Singleton-style settings document. We always read/write the single
// document with key "site" so there's only ever one settings record.
const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: "site" },
    homeServicesCount: { type: Number, default: 6, min: 1, max: 24 },
    homeBlogsCount: { type: Number, default: 3, min: 1, max: 24 },
    homeTopicsCount: { type: Number, default: 4, min: 1, max: 24 },
    homeTechnologiesCount: { type: Number, default: 8, min: 1, max: 24 },
    partnerSliderSpeed: { type: Number, default: 30, min: 5, max: 120 }, // seconds per full loop
    homeTeamCount: { type: Number, default: 4, min: 1, max: 24 },
    homeAdvisoryCount: { type: Number, default: 4, min: 1, max: 24 },

    // Company info shown in the Footer (and available anywhere else on the site)
    companyTagline: { type: String, trim: true, default: "" }, // short punchline / description

    // Footer "Get In Touch" contact details
    contactPhone: { type: String, trim: true, default: "" },
    contactEmail: { type: String, trim: true, default: "" },
    contactAddress: { type: String, trim: true, default: "" },

    // Footer social media icons — any left blank simply won't render
    social: {
      facebook: { type: String, trim: true, default: "" },
      twitter: { type: String, trim: true, default: "" },
      linkedin: { type: String, trim: true, default: "" },
      instagram: { type: String, trim: true, default: "" },
      youtube: { type: String, trim: true, default: "" },
      whatsapp: { type: String, trim: true, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
