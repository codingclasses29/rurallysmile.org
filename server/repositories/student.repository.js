import Student from "../models/Student.js";

export const createStudent = (data) => Student.create(data);

export const findStudent = (id) => Student.findById(id);

export const findStudentByMobile = (mobile) => Student.findOne({ mobile });

export const findStudentByRegistration = (registrationNumber) =>
  Student.findOne({ registrationNumber: String(registrationNumber).toUpperCase() });

export const findStudentByRoll = (rollNumber) =>
  Student.findOne({ rollNumber: String(rollNumber).toUpperCase() });

export const updateStudent = (id, data) =>
  Student.findByIdAndUpdate(id, data, { new: true, runValidators: true });

export const listStudents = (query = {}, options = {}) => {
  const { page = 1, limit = 20, sort = { createdAt: -1 } } = options;
  return Student.find(query)
    .sort(sort)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));
};

export const countStudents = (query = {}) => Student.countDocuments(query);
