import nodemailer from "nodemailer";
import config from "./index.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  connectionTimeout: 15_000,
  greetingTimeout: 10_000,
  socketTimeout: 20_000,
  auth: {
    user: config.EMAIL,
    pass: config.EMAIL_PASSWORD,
  },
});

export default transporter;
