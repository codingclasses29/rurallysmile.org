import Admin from "../models/Admin.js";

export const createAdmin = (data) => Admin.create(data);

export const findAdminById = (id) => Admin.findById(id);

export const findAdminByEmail = (email) =>
  Admin.findOne({ email: String(email).toLowerCase() }).select("+password");

export const updateAdmin = (id, data) =>
  Admin.findByIdAndUpdate(id, data, { new: true });

export const countAdmins = (query = {}) => Admin.countDocuments(query);
