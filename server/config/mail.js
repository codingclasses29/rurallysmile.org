import nodemailer from "nodemailer";
import config from "./index.js";

/**
 * Gmail SMTP works locally / on paid hosts.
 * Render *free* web services block outbound SMTP (25/465/587), so keep
 * timeouts short and let callers fall back to HTTPS (Resend) or SMS.
 */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  connectionTimeout: 8_000,
  greetingTimeout: 8_000,
  socketTimeout: 12_000,
  auth: {
    user: config.EMAIL,
    pass: config.EMAIL_PASSWORD,
  },
});

export default transporter;
