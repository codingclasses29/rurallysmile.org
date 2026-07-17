import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";
import ExamCenter from "../models/ExamCenter.js";
import Setting from "../models/Setting.js";
import { ROLES } from "./constants.js";

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL || "admin@rurallysmile.org";
    const password = process.env.ADMIN_PASSWORD || "Admin@2026";

    let admin = await Admin.findOne({ email });
    if (!admin) {
      admin = await Admin.create({
        name: "Super Admin",
        email,
        password,
        role: ROLES.SUPER_ADMIN,
      });
      console.log("Super Admin created:", email);
    } else {
      console.log("Super Admin already exists:", email);
    }

    const centerCode = "RSP-RATANPURA";
    let center = await ExamCenter.findOne({ centerCode });
    if (!center) {
      center = await ExamCenter.create({
        centerCode,
        centerName: "Utkramit Uchch Vidyalaya, Ratnpura",
        centerNameHindi: "उत्क्रमित उच्च विद्यालय, रतनपुरा",
        address: "Ratnpura, Rurally Smile Foundation",
        district: "Ratnpura",
        capacity: 300,
        reportingTime: "09:00 AM",
        mobile: "9934276672",
        contactPerson: "Exam Coordinator",
      });
      console.log("Default exam center created");
    }

    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create({
        siteName: "Pratibha Khoj Competition 2026",
        registrationOpen: true,
        resultPublished: false,
        admitAvailable: false,
        cookieEnabled: true,
        contactPhone: ["9934276672", "7016772619"],
        contactWebsite: "www.rurallysmile.org",
      });
      console.log("Website settings created");
    }

    console.log("Seed completed");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
