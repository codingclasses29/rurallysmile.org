import config from "../config/index.js";
import logger from "../utils/logger.js";

const getCreds = () => ({
  sid: process.env.TWILIO_ACCOUNT_SID || config.TWILIO_ACCOUNT_SID,
  token: process.env.TWILIO_AUTH_TOKEN || config.TWILIO_AUTH_TOKEN,
  from: process.env.TWILIO_PHONE_NUMBER || config.TWILIO_PHONE_NUMBER,
});

const formatMobile = (mobile) => {
  const digits = String(mobile).replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.startsWith("91") && digits.length === 12) return `+${digits}`;
  if (String(mobile).startsWith("+")) return String(mobile);
  return `+91${digits}`;
};

async function twilioSend({ to, body, channel = "sms" }) {
  const { sid, token, from } = getCreds();
  if (!sid || !token || !from) {
    logger.warn(`Messaging not configured — to ${to}: ${String(body).slice(0, 60)}…`);
    return { skipped: true };
  }

  const payload = {
    To: channel === "whatsapp" ? `whatsapp:${formatMobile(to)}` : formatMobile(to),
    From: channel === "whatsapp"
      ? `whatsapp:${from.replace(/^whatsapp:/, "")}`
      : from,
    Body: body,
  };

  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(payload),
    }
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Twilio error ${res.status}`);
  }
  return data;
}

export const sendWhatsApp = async (to, body) => {
  try {
    const msg = await twilioSend({ to, body, channel: "whatsapp" });
    if (msg.skipped) return msg;
    logger.info(`WhatsApp sent to ${to}: ${msg.sid}`);
    return msg;
  } catch (err) {
    try {
      const msg = await twilioSend({ to, body, channel: "sms" });
      if (msg.skipped) return msg;
      logger.info(`SMS fallback sent to ${to}: ${msg.sid}`);
      return msg;
    } catch (e) {
      logger.error(`WhatsApp/SMS failed: ${e.message}`);
      return { skipped: true, error: e.message };
    }
  }
};

export const sendRegistrationWhatsApp = async (student) => {
  const text = `प्रिय विद्यार्थी,

आपका Registration सफलतापूर्वक हो गया है।

Registration Number
${student.registrationNumber}

धन्यवाद
Rurally Smile Foundation`;

  return sendWhatsApp(student.whatsapp || student.mobile, text);
};

export const sendOtpWhatsApp = async (mobile, otp) => {
  const text = `Pratibha Khoj 2026 OTP: ${otp}
वैधता: 5 मिनट
Rurally Smile Foundation`;
  return sendWhatsApp(mobile, text);
};

export default { sendWhatsApp, sendRegistrationWhatsApp, sendOtpWhatsApp };
