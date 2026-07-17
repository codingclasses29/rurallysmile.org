import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    actorType: {
      type: String,
      enum: ["admin", "student", "system"],
      default: "system",
    },
    actorId: { type: mongoose.Schema.Types.ObjectId },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: { type: String },
    details: { type: mongoose.Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

logSchema.index({ createdAt: -1 });

export default mongoose.model("Log", logSchema);
