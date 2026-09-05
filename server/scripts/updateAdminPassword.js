import mongoose from "mongoose";
import "../config/env.js";
import Admin from "../models/Admin.js";

async function updatePassword() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUri);

    const email = "codingclasses29@gmail.com";
    const newPassword = "Sachin7323@#";

    let admin = await Admin.findOne({ email });
    if (!admin) {
      console.log(`Admin with email ${email} not found. Creating new Super Admin...`);
      admin = new Admin({
        name: "Super Admin",
        email,
        password: newPassword,
        role: "SUPER_ADMIN",
        isActive: true,
      });
      await admin.save();
      console.log(`Super Admin created successfully with email ${email} and new password!`);
    } else {
      admin.password = newPassword;
      admin.isActive = true;
      await admin.save();
      console.log(`Password updated successfully for admin: ${email}`);
    }

    // Verify password with comparePassword
    const testAdmin = await Admin.findOne({ email }).select("+password");
    const isMatch = await testAdmin.comparePassword(newPassword);
    console.log(`Verification: Password match test is ${isMatch ? "SUCCESSFUL (TRUE)" : "FAILED (FALSE)"}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Failed to update password:", err);
    process.exit(1);
  }
}

updatePassword();
