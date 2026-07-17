import { customAlphabet } from "nanoid";
import Student from "../models/Student.js";

const nanoid = customAlphabet("1234567890", 6);

/**
 * Date-based, collision-resistant format: RSF-YYYYMMDD-CC-NNNNNN.
 * The Student unique index is the final concurrency guard.
 */
export const generateRegistration = async (studentClass = "6", now = new Date()) => {
  const classPad = String(studentClass).padStart(2, "0");
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  for (let attempt = 0; attempt < 25; attempt += 1) {
    const candidate = `RSF-${date}-${classPad}-${nanoid()}`;
    if (!(await Student.exists({ registrationNumber: candidate }))) {
      return candidate;
    }
  }
  throw new Error("Unable to allocate a unique registration number");
};

export default generateRegistration;
