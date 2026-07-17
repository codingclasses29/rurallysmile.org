import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    titleHindi: { type: String, trim: true },
    imageUrl: { type: String, required: true },
    category: {
      type: String,
      enum: ["competition", "award_ceremony", "foundation_activities"],
      default: "competition",
    },
    description: String,
    isPublished: { type: Boolean, default: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

export default mongoose.model("Gallery", gallerySchema);
