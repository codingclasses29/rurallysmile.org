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

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendOtpEmail(to: string, otp: string) {
  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error(
      "EMAIL/EMAIL_PASSWORD missing on Vercel. Add Gmail app password in Project → Settings → Environment Variables."
    );
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    connectionTimeout: 12_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });

  const info = await transporter.sendMail({
    from: `"Pratibha Khoj 2026" <${EMAIL_USER}>`,
    to,
    subject: "OTP Verification – Pratibha Khoj 2026",
    html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto">
      <h2 style="color:#0F172A">Email OTP Verification</h2>
      <p>प्रतिभा खोज प्रतियोगिता 2026 पंजीकरण के लिए आपका OTP:</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:6px;color:#2563EB">${otp}</p>
      <p>यह OTP <strong>5 मिनट</strong> तक मान्य है। किसी के साथ साझा न करें।</p>
      <p>— Rurally Smile Foundation</p>
    </div>`,
  });

  return info.messageId;
}

async function withMongo<T>(
  fn: (db: ReturnType<MongoClient["db"]>) => Promise<T>
) {
  if (!MONGO_URI) {
    throw new Error(
      "MONGO_URI missing on Vercel. Add the same MongoDB URI used by the API."
    );
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
 * Self-contained OTP on Vercel:
 * 1) Store OTP in Mongo (same collection Render verify reads)
 * 2) Send email via Gmail SMTP from Vercel (Render free blocks SMTP)
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

    const messageId = await sendOtpEmail(email, otp);

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email",
      data: {
        email,
        channel: "email",
        expiresIn: 300,
        ...(process.env.NODE_ENV !== "production" ? { devOtp: otp } : {}),
      },
      errors: null,
      meta: { messageId },
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
