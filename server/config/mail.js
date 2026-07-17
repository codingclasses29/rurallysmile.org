import nodemailer from "nodemailer";
import config from "./index.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL,
    pass: config.EMAIL_PASSWORD,
  },
});

export default transporter;
