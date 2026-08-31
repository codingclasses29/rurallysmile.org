import mongoose from "mongoose";
import "../config/env.js";
import Student from "../models/Student.js";
import Registration from "../models/Registration.js";
import AdmitCard from "../models/AdmitCard.js";
import Result from "../models/Result.js";

async function reset() {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      "mongodb://localhost:27017/online_exam_portal";

    console.log("Connecting to MongoDB for data reset...");
    await mongoose.connect(mongoUri);

    const [delStudents, delRegs, delAdmits, delResults] = await Promise.all([
      Student.deleteMany({}),
      Registration.deleteMany({}),
      AdmitCard.deleteMany({}),
      Result.deleteMany({}),
    ]);

    console.log("=========================================");
    console.log("DATA RESET SUCCESSFUL!");
    console.log("=========================================");
    console.log(`Students deleted:       ${delStudents.deletedCount}`);
    console.log(`Registrations deleted:  ${delRegs.deletedCount}`);
    console.log(`Admit cards deleted:    ${delAdmits.deletedCount}`);
    console.log(`Results deleted:        ${delResults.deletedCount}`);
    console.log("=========================================");
    console.log("New student registrations will now start fresh from 1 (RSF26-080001 & RSF0001)!");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Reset error:", err);
    process.exit(1);
  }
}

reset();

