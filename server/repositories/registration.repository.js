import Student from "../models/Student.js";
import Registration from "../models/Registration.js";

export const findStudentByMobile = (mobile) => Student.findOne({ mobile });
export const findStudentByReg = (registrationNumber) =>
  Student.findOne({ registrationNumber: String(registrationNumber).toUpperCase() });
export const createStudent = (payload) => Student.create(payload);
export const createRegistrationRecord = (payload) => Registration.create(payload);
export const countByClass = (cls) => Student.countDocuments({ class: String(cls) });

export default {
  findStudentByMobile,
  findStudentByReg,
  createStudent,
  createRegistrationRecord,
  countByClass,
};
