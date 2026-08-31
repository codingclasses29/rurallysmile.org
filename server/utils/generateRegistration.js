import Student from "../models/Student.js";

/**
 * Sequential class-aware registration format starting from 1: RSF26-CC0001
 * Example:
 * Class 7: RSF26-070001, RSF26-070002, ...
 * Class 8: RSF26-080001, RSF26-080002, ...
 * Class 9: RSF26-090001, RSF26-090002, ...
 * Class 10: RSF26-100001, RSF26-100002, ...
 */
export const generateRegistration = async (studentClass = "8") => {
  const classPad = String(studentClass || "8").padStart(2, "0");
  const prefix = `RSF26-${classPad}`;

  try {
    const lastStudent = await Student.findOne({
      registrationNumber: new RegExp(`^${prefix}\\d+$`, "i"),
    })
      .sort({ registrationNumber: -1 })
      .select("registrationNumber")
      .lean();

    let maxNum = 0;
    if (lastStudent && lastStudent.registrationNumber) {
      const match = lastStudent.registrationNumber.match(
        new RegExp(`^${prefix}(\\d+)$`, "i")
      );
      if (match) {
        maxNum = parseInt(match[1], 10) || 0;
      }
    }

    for (let attempt = 1; attempt <= 500; attempt++) {
      const nextNum = maxNum + attempt;
      const candidate = `${prefix}${String(nextNum).padStart(4, "0")}`;
      const exists = await Student.exists({ registrationNumber: candidate });
      if (!exists) {
        return candidate;
      }
    }

    const rand = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${rand}`;
  } catch {
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${rand}`;
  }
};

export default generateRegistration;
