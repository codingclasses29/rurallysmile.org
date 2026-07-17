import mongoose from "mongoose";

const cookieConsentSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    consent: {
      type: String,
      enum: ["accepted", "rejected", "customized"],
      required: true,
    },
    preferences: {
      necessary: { type: Boolean, default: true },
      analytics: { type: Boolean, default: false },
      marketing: { type: Boolean, default: false },
    },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Cookie", cookieConsentSchema);
