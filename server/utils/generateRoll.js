import Student from "../models/Student.js";

/**
 * Generate sequential collision-safe roll numbers starting from RSF0001
 * Format: RSF0001, RSF0002, RSF0003, ...
 */
export const generateRoll = async () => {
  try {
    // Find the highest existing rollNumber starting with RSF
    const lastStudent = await Student.findOne({ rollNumber: /^RSF\d+$/i })
      .sort({ rollNumber: -1 })
      .select("rollNumber")
      .lean();

    let maxNum = 0;
    if (lastStudent && lastStudent.rollNumber) {
      const match = lastStudent.rollNumber.match(/^RSF(\d+)$/i);
      if (match) {
        maxNum = parseInt(match[1], 10) || 0;
      }
    }

    // Allocate the next available sequential roll number
    for (let attempt = 1; attempt <= 500; attempt++) {
      const nextNum = maxNum + attempt;
      const candidate = `RSF${String(nextNum).padStart(4, "0")}`;
      const exists = await Student.exists({ rollNumber: candidate });
      if (!exists) {
        return candidate;
      }
    }

    // Fallback if loop exceeded
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `RSF${rand}`;
  } catch {
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `RSF${rand}`;
  }
};

export default generateRoll;
