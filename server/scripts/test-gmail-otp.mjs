import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const user = process.env.EMAIL || process.env.NODEMAILER_EMAIL;
const pass = process.env.EMAIL_PASSWORD || process.env.NODEMAILER_PASSWORD;
const to = process.argv[2] || "sachincyberaranpura@gmail.com";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: { user, pass },
});

try {
  await transporter.verify();
  console.log("VERIFY_OK from", user, "to", to);
  const info = await transporter.sendMail({
    from: `"Pratibha Khoj 2026" <${user}>`,
    to,
    subject: "OTP Test – Pratibha Khoj",
    html: "<p>Test OTP <b>123456</b>. If you got this, Gmail delivery works.</p>",
  });
  console.log("SEND_OK", info.messageId);
  console.log("RESPONSE", info.response);
  console.log("ACCEPTED", info.accepted);
  console.log("REJECTED", info.rejected);
} catch (e) {
  console.log("FAIL_CODE", e.code || "");
  console.log("FAIL_RESPONSE", e.response || "");
  console.log("FAIL_MSG", e.message || "");
  process.exit(1);
}
