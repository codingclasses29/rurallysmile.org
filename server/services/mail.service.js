import transporter from "../config/mail.js";
import config from "../config/index.js";
import logger from "../utils/logger.js";

export const sendMail = async (to, subject, html) => {
  if (!config.EMAIL || !config.EMAIL_PASSWORD) {
    logger.warn("Email not configured — skipping sendMail");
    return { skipped: true };
  }

  const info = await transporter.sendMail({
    from: `"Pratibha Khoj 2026" <${config.EMAIL}>`,
    to,
    subject,
    html,
  });

  logger.info(`Email sent to ${to}: ${info.messageId}`);
  return info;
};

export const sendRegistrationMail = async (student) => {
  if (!student.email) return { skipped: true };

  return sendMail(
    student.email,
    "Registration Successful – Pratibha Khoj 2026",
    `<div style="font-family:sans-serif;max-width:560px;margin:0 auto">
      <h2 style="color:#0F172A">Registration Successful</h2>
      <p>नमस्कार <strong>${student.name}</strong>,</p>
      <p>आपका पंजीकरण सफलतापूर्वक प्राप्त हो गया है।</p>
      <p><strong>Registration Number:</strong> ${student.registrationNumber}</p>
      <p><strong>Class:</strong> ${student.class}</p>
      <h3>Next Steps</h3>
      <ol>
        <li>Admin verification की प्रतीक्षा करें</li>
        <li>Approval के बाद Admit Card डाउनलोड करें</li>
        <li>परीक्षा तिथि: 05 September 2026</li>
      </ol>
      <p>— Rurally Smile Foundation</p>
    </div>`
  );
};

export const sendOtpMail = async (email, otp) => {
  return sendMail(
    email,
    "OTP Verification – Pratibha Khoj 2026",
    `<div style="font-family:sans-serif;max-width:560px;margin:0 auto">
      <h2 style="color:#0F172A">Email OTP</h2>
      <p>Your verification OTP is:</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:6px;color:#2563EB">${otp}</p>
      <p>Valid for 5 minutes. Do not share this code.</p>
      <p>— Rurally Smile Foundation</p>
    </div>`
  );
};

export default { sendMail, sendRegistrationMail, sendOtpMail };
