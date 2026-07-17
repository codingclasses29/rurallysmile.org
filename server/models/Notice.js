import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    titleHindi: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    descriptionHindi: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["notice", "exam_update", "result_date", "registration"],
      default: "notice",
    },
    published: {
      type: Boolean,
      default: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notice", noticeSchema);
