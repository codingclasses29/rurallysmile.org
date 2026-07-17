import mongoose from "mongoose";

const admitSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    examCenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamCenter",
    },
    examDate: {
      type: Date,
      default: () => new Date("2026-09-05"),
    },
    examTime: {
      type: String,
      default: "10:00 AM",
    },
    reportingTime: {
      type: String,
      default: "09:00 AM",
    },
    seatNumber: String,
    roomNumber: String,
    qrCode: String,
    downloadCount: {
      type: Number,
      default: 0,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

admitSchema.index({ student: 1 }, { unique: true });

export default mongoose.model("AdmitCard", admitSchema);
