import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true,
    },
    rollNumber: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    fatherName: {
      type: String,
      trim: true,
    },
    motherName: {
      type: String,
      trim: true,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "Male", "Female", "Other"],
    },
    category: {
      type: String,
      enum: ["General", "OBC", "SC", "ST", "EWS", "Other"],
      default: "General",
    },
    medium: {
      type: String,
      default: "Hindi",
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
    parentMobile: {
      type: String,
      trim: true,
    },
    whatsapp: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    class: {
      type: String,
      enum: ["7", "8", "9", "10"],
      required: true,
    },
    schoolName: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
      default: "Bihar",
    },
    district: {
      type: String,
      trim: true,
    },
    block: {
      type: String,
      trim: true,
    },
    village: {
      type: String,
      trim: true,
    },
    pinCode: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    photo: String,
    signature: String,
    aadhaar: String,
    schoolId: String,
    otpVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    rejectionReason: String,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    approvedAt: Date,
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    rejectedAt: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

studentSchema.index({ mobile: 1 });
studentSchema.index({ email: 1 }, { sparse: true });
studentSchema.index({ aadhaar: 1 }, { sparse: true });
studentSchema.index({ status: 1, createdAt: -1 });
studentSchema.index({ class: 1, status: 1, createdAt: -1 });

export default mongoose.model("Student", studentSchema);
