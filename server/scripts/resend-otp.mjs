import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { MongoClient } from "mongodb";

dotenv.config();

const email = (process.argv[2] || "sachincyberaranpura@gmail.com").trim().toLowerCase();
const user = process.env.EMAIL || process.env.NODEMAILER_EMAIL;
const pass = process.env.EMAIL_PASSWORD || process.env.NODEMAILER_PASSWORD;
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);
await client.connect();
const db = client.db();
const key = `reg:${email}`;
let doc = await db.collection("otps").findOne({ key });

let otp = doc?.otp;
if (!otp) {
  otp = String(Math.floor(100000 + Math.random() * 900000));
}

const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
await db.collection("otps").updateOne(
  { key },
  {
    $set: { key, otp, expiresAt, updatedAt: new Date() },
    $setOnInsert: { createdAt: new Date() },
  },
  { upsert: true }
);
await client.close();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: { user, pass },
});

const info = await transporter.sendMail({
  from: `"Pratibha Khoj 2026" <${user}>`,
  to: email,
  subject: "OTP Verification – Pratibha Khoj 2026",
  text: `Your OTP is ${otp}. Valid for 5 minutes.`,
  html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto">
    <h2>Email OTP Verification</h2>
    <p>आपका OTP:</p>
    <p style="font-size:28px;font-weight:700;letter-spacing:6px">${otp}</p>
    <p>Valid for 5 minutes.</p>
    <p>— Rurally Smile Foundation</p>
  </div>`,
});

console.log("TO", email);
console.log("OTP", otp);
console.log("SENT", info.messageId);
console.log("ACCEPTED", info.accepted);
console.log("REJECTED", info.rejected);
console.log("RESPONSE", info.response);
