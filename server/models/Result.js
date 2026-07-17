import mongoose from "mongoose";

/** Exam paper = 100 marks total (single entry, not per-subject) */
const PAPER_MAX = 100;

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true,
    },
    /** Optional subject breakdown (legacy) — not used for total calc */
    hindi: { type: Number, default: 0, min: 0 },
    math: { type: Number, default: 0, min: 0 },
    gk: { type: Number, default: 0, min: 0 },
    gs: { type: Number, default: 0, min: 0 },
    marks: {
      type: Number,
      default: 0,
      min: 0,
      max: PAPER_MAX,
    },
    total: {
      type: Number,
      default: 0,
      min: 0,
      max: PAPER_MAX,
    },
    maxMarks: {
      type: Number,
      default: PAPER_MAX,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    grade: String,
    rank: Number,
    meritPosition: Number,
    status: {
      type: String,
      enum: ["Pass", "Fail"],
      default: "Fail",
    },
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: Date,
    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

resultSchema.pre("save", function (next) {
  this.maxMarks = PAPER_MAX;

  // Prefer explicit marks/total (0–100). Subjects are ignored for scoring.
  let obtained = Number(this.marks ?? this.total ?? 0);
  if (!Number.isFinite(obtained)) obtained = 0;
  obtained = Math.min(PAPER_MAX, Math.max(0, Math.round(obtained)));

  this.total = obtained;
  this.marks = obtained;
  // Clear subject fields so UI/PDF don't show fake per-subject scores
  this.hindi = 0;
  this.math = 0;
  this.gk = 0;
  this.gs = 0;

  this.percentage = Math.round((this.total / PAPER_MAX) * 10000) / 100;
  this.status = this.percentage >= 33 ? "Pass" : "Fail";

  if (this.percentage >= 80) this.grade = "A+";
  else if (this.percentage >= 70) this.grade = "A";
  else if (this.percentage >= 60) this.grade = "B+";
  else if (this.percentage >= 50) this.grade = "B";
  else if (this.percentage >= 40) this.grade = "C";
  else if (this.percentage >= 33) this.grade = "D";
  else this.grade = "E";

  next();
});

export default mongoose.model("Result", resultSchema);
