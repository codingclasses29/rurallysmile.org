import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const maxDuration = 60;

const API_ORIGIN = (
  process.env.API_PROXY_TARGET ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://rurallysmile-org-4.onrender.com"
)
  .replace(/\/$/, "")
  .replace(/\/api\/v1$/, "");

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

function isSmtpBlocked(err: unknown) {
  const e = err as { code?: string; message?: string };
  const code = String(e?.code || "");
  const msg = String(e?.message || "").toLowerCase();
  return (
    code === "ETIMEDOUT" ||
    code === "ECONNREFUSED" ||
    code === "ESOCKET" ||
    msg.includes("timeout") ||
    msg.includes("connection")
  );
}

async function sendOtpEmail(to: string, otp: string) {
  if (!EMAIL_USER || !EMAIL_PASS) {
    return { skipped: true as const, reason: "not_configured" };
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    connectionTimeout: 10_000,
    greetingTimeout: 8_000,
    socketTimeout: 15_000,
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

  return { skipped: false as const, messageId: info.messageId };
}

/**
 * Registration OTP: prefer email from Vercel (SMTP allowed here),
 * while OTP is stored on Render. Relay secret lets Render return the OTP
 * only to this trusted route.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const mobile = String(body.mobile || "").trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { success: false, message: "Enter a valid email address", data: null, errors: null },
      { status: 400 }
    );
  }

  const relaySecret = process.env.OTP_RELAY_SECRET || "";
  const prepareHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (relaySecret) {
    prepareHeaders["x-otp-relay-secret"] = relaySecret;
  }

  // 1) Ask Render to create + store OTP (relay mode returns otp for Vercel email)
  const prepareRes = await fetch(`${API_ORIGIN}/api/v1/registration/send-otp`, {
    method: "POST",
    headers: prepareHeaders,
    body: JSON.stringify({
      email,
      mobile: mobile || undefined,
      prepareOnly: Boolean(relaySecret),
    }),
  });

  const prepareJson = await prepareRes.json().catch(() => ({}));

  // If Render already delivered (email/SMS), pass through
  if (prepareRes.ok && prepareJson?.data?.channel && prepareJson.data.channel !== "pending") {
    return NextResponse.json(prepareJson, { status: prepareRes.status });
  }

  const relayOtp = prepareJson?.data?.relayOtp || prepareJson?.data?.devOtp;
  if (!prepareRes.ok || !relayOtp) {
    // Fall back: return Render error (SMS may still work after server deploy)
    return NextResponse.json(
      prepareJson?.message
        ? prepareJson
        : {
            success: false,
            message: "OTP could not be prepared. Redeploy the API on Render.",
            data: null,
            errors: null,
          },
      { status: prepareRes.status || 502 }
    );
  }

  // 2) Send email from Vercel (bypasses Render free SMTP block)
  try {
    const delivery = await sendOtpEmail(email, String(relayOtp));
    if (delivery.skipped) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Add EMAIL and EMAIL_PASSWORD on Vercel (Gmail app password) to send OTP email.",
          data: null,
          errors: null,
        },
        { status: 503 }
      );
    }
  } catch (err) {
    const blocked = isSmtpBlocked(err);
    return NextResponse.json(
      {
        success: false,
        message: blocked
          ? "Vercel could not reach Gmail SMTP. Add RESEND_API_KEY or use Twilio SMS on Render."
          : err instanceof Error
            ? err.message
            : "OTP email failed",
        data: null,
        errors: null,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "OTP sent to your email",
    data: {
      email,
      channel: "email",
      expiresIn: 300,
    },
    errors: null,
  });
}
