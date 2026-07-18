import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Otp || mongoose.model("Otp", otpSchema);
