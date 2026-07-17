import Result from "../models/Result.js";

export const createResult = (data) => Result.create(data);

export const findResultById = (id) => Result.findById(id);

export const findResultByStudent = (studentId) =>
  Result.findOne({ student: studentId });

export const updateResult = (id, data) =>
  Result.findByIdAndUpdate(id, data, { new: true, runValidators: true });

export const listPublishedResults = (filter = {}, limit = 100) =>
  Result.find({ ...filter, published: true })
    .populate("student", "name schoolName district class rollNumber")
    .sort({ percentage: -1, total: -1 })
    .limit(limit);

export const publishAllResults = (adminId) =>
  Result.updateMany(
    { published: false },
    {
      $set: {
        published: true,
        publishedAt: new Date(),
        publishedBy: adminId,
      },
    }
  );
