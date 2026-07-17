import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Free"],
      default: "Free",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    academicYear: {
      type: String,
      default: "2026",
    },
    examName: {
      type: String,
      default: "Pratibha Khoj Competition 2026",
    },
  },
  { timestamps: true }
);

registrationSchema.index({ student: 1, academicYear: 1 }, { unique: true });

export default mongoose.model("Registration", registrationSchema);
