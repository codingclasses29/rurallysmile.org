import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { MongoClient } from "mongodb";

export const runtime = "nodejs";
export const maxDuration = 60;

const EMAIL_USER =
  process.env.EMAIL ||
  process.env.NODEMAILER_EMAIL ||
  process.env.SMTP_USER ||
  "";
const EMAIL_PASS =
  process.env.EMAIL_PASSWORD ||
  process.env.NODEMAILER_PASSWORD ||
  process.env.SMTP_PASS ||
  "";
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "";
const GMAIL_WEBAPP_URL = (process.env.GMAIL_WEBAPP_URL || "").trim();
const GMAIL_WEBAPP_SECRET = (process.env.GMAIL_WEBAPP_SECRET || "").trim();

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function otpHtml(otp: string) {
  return `<div style="font-family:sans-serif;max-width:560px;margin:0 auto">
    <h2 style="color:#0F172A">Email OTP Verification</h2>
    <p>प्रतिभा खोज प्रतियोगिता 2026 पंजीकरण के लिए आपका OTP:</p>
    <p style="font-size:28px;font-weight:700;letter-spacing:6px;color:#2563EB">${otp}</p>
    <p>यह OTP <strong>5 मिनट</strong> तक मान्य है। किसी के साथ साझा न करें।</p>
    <p>— Rurally Smile Foundation</p>
  </div>`;
}

/** Preferred on Vercel/Render free — HTTPS to Google Apps Script (GmailApp). */
async function sendViaGmailWebApp(to: string, otp: string) {
  if (!GMAIL_WEBAPP_URL || !GMAIL_WEBAPP_SECRET) return null;

  const res = await fetch(GMAIL_WEBAPP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: GMAIL_WEBAPP_SECRET,
      to,
      subject: "OTP Verification – Pratibha Khoj 2026",
      text: `Your OTP is ${otp}. Valid for 5 minutes.`,
      html: otpHtml(otp),
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.ok === false) {
    throw new Error(data?.error || `Gmail webapp error ${res.status}`);
  }
  return { transport: "gmail-webapp" as const, id: "webapp" };
}

/** Local / paid hosts only — Vercel & Render free usually block SMTP. */
async function sendViaSmtp(to: string, otp: string) {
  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error("EMAIL/EMAIL_PASSWORD missing");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    socketTimeout: 12_000,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });

  const info = await transporter.sendMail({
    from: `"Pratibha Khoj 2026" <${EMAIL_USER}>`,
    to,
    subject: "OTP Verification – Pratibha Khoj 2026",
    text: `Your OTP is ${otp}. Valid for 5 minutes.`,
    html: otpHtml(otp),
  });

  if (info.rejected?.length) {
    throw new Error(`Gmail rejected: ${info.rejected.join(", ")}`);
  }

  return { transport: "smtp" as const, id: info.messageId };
}

async function sendOtpEmail(to: string, otp: string) {
  const viaWebApp = await sendViaGmailWebApp(to, otp);
  if (viaWebApp) return viaWebApp;

  try {
    return await sendViaSmtp(to, otp);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Student email pe OTP nahi bhej paye (${msg}). ` +
        `Vercel/Render free SMTP block karte hain — Google Apps Script setup karein ` +
        `(server/scripts/gmail-otp-webapp.gs) aur GMAIL_WEBAPP_URL + GMAIL_WEBAPP_SECRET set karein.`
    );
  }
}

async function withMongo<T>(
  fn: (db: ReturnType<MongoClient["db"]>) => Promise<T>
) {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI missing on Vercel");
  }
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  try {
    return await fn(client.db());
  } finally {
    await client.close();
  }
}

/**
 * Registration OTP → student's email via Gmail.
 * Production: Google Apps Script (HTTPS). Local: Gmail SMTP.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter a valid email address",
          data: null,
          errors: null,
        },
        { status: 400 }
      );
    }

    const otp = generateOtp();
    const key = `reg:${email}`;
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await withMongo(async (db) => {
      const existing = await db.collection("students").findOne({ email });
      if (existing) {
        const err = new Error("Email already registered");
        (err as Error & { status: number }).status = 409;
        throw err;
      }
    });

    const delivery = await sendOtpEmail(email, otp);

    await withMongo(async (db) => {
      await db.collection("otps").updateOne(
        { key },
        {
          $set: {
            key,
            otp,
            expiresAt,
            updatedAt: new Date(),
          },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
      );
    });

    return NextResponse.json({
      success: true,
      message: `OTP sent to ${email}`,
      data: {
        email,
        channel: "email",
        expiresIn: 300,
        transport: delivery.transport,
      },
      errors: null,
    });
  } catch (err) {
    const status =
      typeof err === "object" && err && "status" in err
        ? Number((err as { status: number }).status)
        : 502;
    const message =
      err instanceof Error ? err.message : "OTP email could not be sent";

    return NextResponse.json(
      { success: false, message, data: null, errors: null },
      { status: status >= 400 && status < 600 ? status : 502 }
    );
  }
}
