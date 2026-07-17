import mongoose from "mongoose";

const examCenterSchema = new mongoose.Schema(
  {
    centerCode: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
      trim: true,
    },
    centerName: {
      type: String,
      required: true,
      trim: true,
    },
    centerNameHindi: {
      type: String,
      trim: true,
    },
    address: String,
    district: String,
    block: String,
    village: String,
    capacity: {
      type: Number,
      default: 200,
    },
    contactPerson: String,
    mobile: String,
    reportingTime: {
      type: String,
      default: "09:00 AM",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ExamCenter", examCenterSchema);
