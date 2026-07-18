import transporter from "../config/mail.js";
import config from "../config/index.js";
import logger from "../utils/logger.js";

const RESEND_API = "https://api.resend.com/emails";

function isSmtpBlockedError(err) {
  const code = String(err?.code || "");
  const msg = String(err?.message || "").toLowerCase();
  return (
    code === "ETIMEDOUT" ||
    code === "ECONNREFUSED" ||
    code === "ESOCKET" ||
    code === "ECONNECTION" ||
    msg.includes("timeout") ||
    msg.includes("connection closed") ||
    msg.includes("greeting never received")
  );
}

async function sendViaResend(to, subject, html) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  const from =
    process.env.RESEND_FROM ||
    `Pratibha Khoj 2026 <${config.EMAIL || "onboarding@resend.dev"}>`;

  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || `Resend error ${res.status}`);
  }

  logger.info(`Email sent via Resend to ${to}: ${data.id}`);
  return { ...data, transport: "resend" };
}

async function sendViaSmtp(to, subject, html) {
  if (!config.EMAIL || !config.EMAIL_PASSWORD) {
    return { skipped: true, reason: "smtp_not_configured" };
  }

  const info = await transporter.sendMail({
    from: `"Pratibha Khoj 2026" <${config.EMAIL}>`,
    to,
    subject,
    html,
  });

  logger.info(`Email sent via SMTP to ${to}: ${info.messageId}`);
  return { ...info, transport: "smtp" };
}

export const sendMail = async (to, subject, html) => {
  // Prefer HTTPS (works on Render free). SMTP is for local / paid hosts.
  try {
    const viaResend = await sendViaResend(to, subject, html);
    if (viaResend) return viaResend;
  } catch (err) {
    logger.error(`Resend failed for ${to}: ${err.message}`);
    // Fall through to SMTP when Resend is misconfigured
  }

  try {
    return await sendViaSmtp(to, subject, html);
  } catch (err) {
    if (isSmtpBlockedError(err)) {
      err.isSmtpBlocked = true;
      err.message =
        "SMTP blocked on this host (common on Render free). Use RESEND_API_KEY or SMS fallback.";
    }
    throw err;
  }
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
