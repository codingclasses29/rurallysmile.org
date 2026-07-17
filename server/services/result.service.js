import Student from "../models/Student.js";
import * as resultRepo from "../repositories/result.repository.js";
import ApiError from "../utils/ApiError.js";
import Result from "../models/Result.js";
import { assignCompetitionRanks } from "../utils/adminWorkflow.js";

export const upsertResult = async ({ rollNumber, marks, total }) => {
  const student = await Student.findOne({
    rollNumber: String(rollNumber).toUpperCase(),
  });
  if (!student) throw new ApiError(404, "Student / roll number not found");

  const value = Math.min(100, Math.max(0, Math.round(Number(marks ?? total ?? 0))));

  let result = await resultRepo.findResultByStudent(student._id);
  if (result) {
    result.marks = value;
    result.total = value;
    result.maxMarks = 100;
    result.hindi = 0;
    result.math = 0;
    result.gk = 0;
    result.gs = 0;
    await result.save();
  } else {
    result = await resultRepo.createResult({
      student: student._id,
      marks: value,
      total: value,
      maxMarks: 100,
      hindi: 0,
      math: 0,
      gk: 0,
      gs: 0,
    });
  }
  return result;
};

export const getPublishedResultByRoll = async (rollNumber, dob) => {
  const student = await Student.findOne({
    rollNumber: String(rollNumber).toUpperCase(),
  });
  if (!student) throw new ApiError(404, "Student not found");

  if (dob) {
    const studentDob = new Date(student.dob).toISOString().slice(0, 10);
    const queryDob = new Date(dob).toISOString().slice(0, 10);
    if (studentDob !== queryDob) {
      throw new ApiError(400, "DOB does not match");
    }
  }

  const result = await resultRepo.findResultByStudent(student._id);
  if (!result || !result.published) {
    throw new ApiError(404, "Result not found or not published");
  }

  await result.populate(
    "student",
    "name fatherName dob class schoolName rollNumber"
  );
  return result;
};

export const getMeritList = async (studentClass) => {
  let filter = {};
  if (studentClass) {
    const students = await Student.find({ class: studentClass }).select("_id");
    filter.student = { $in: students.map((s) => s._id) };
  }
  return resultRepo.listPublishedResults(filter);
};

export const publishResults = async (adminId) => {
  return resultRepo.publishAllResults(adminId);
};

export const recalculatePublishedMerit = async ({ classes } = {}) => {
  const studentFilter =
    Array.isArray(classes) && classes.length ? { class: { $in: classes.map(String) } } : {};
  const students = await Student.find(studentFilter)
    .select("_id class rollNumber registrationNumber")
    .lean();
  const studentById = new Map(students.map((student) => [String(student._id), student]));
  const results = await Result.find({
    published: true,
    student: { $in: students.map((student) => student._id) },
  })
    .select("_id student total percentage")
    .lean();
  const ranked = assignCompetitionRanks(
    results.map((result) => {
      const student = studentById.get(String(result.student));
      return {
        id: result._id,
        studentClass: student?.class || "",
        rollNumber: student?.rollNumber || student?.registrationNumber || "",
        score: Number(result.total ?? result.percentage ?? 0),
      };
    })
  );
  if (ranked.length) {
    await Result.bulkWrite(
      ranked.map((row) => ({
        updateOne: {
          filter: { _id: row.id },
          update: {
            $set: {
              rank: row.rank,
              meritPosition: row.rank <= 100 ? row.rank : null,
            },
          },
        },
      }))
    );
  }
  return {
    recalculated: ranked.length,
    classes: [...new Set(ranked.map((row) => row.studentClass))].sort(),
  };
};

export default {
  upsertResult,
  getPublishedResultByRoll,
  getMeritList,
  publishResults,
  recalculatePublishedMerit,
};
