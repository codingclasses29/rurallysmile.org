import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: "Pratibha Khoj Competition 2026",
    },
    logo: String,
    banner: String,
    registrationOpen: {
      type: Boolean,
      default: true,
    },
    resultPublished: {
      type: Boolean,
      default: false,
    },
    admitAvailable: {
      type: Boolean,
      default: false,
    },
    cookieEnabled: {
      type: Boolean,
      default: true,
    },
    examDate: {
      type: Date,
      default: () => new Date("2026-09-05"),
    },
    medium: {
      type: String,
      default: "Hindi",
    },
    contactPhone: [String],
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    contactWebsite: {
      type: String,
      default: "www.rurallysmile.org",
    },
    /** Connected Google Sheet for result import */
    googleSheetUrl: {
      type: String,
      default:
        "https://docs.google.com/spreadsheets/d/1vD120fHSi5laXN2Gw8mcEBOmaExbqug7r3B8BPfYAwU/edit?usp=sharing",
    },
    googleSheetLastSync: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Setting", settingSchema);
