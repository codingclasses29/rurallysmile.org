import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export const runtime = "nodejs";
export const maxDuration = 30;

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "";

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

/** Verify registration OTP against Mongo (same store as Vercel send-otp). */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();
    const otp = String(body.otp || "").trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Enter a valid email address", data: null, errors: null },
        { status: 400 }
      );
    }
    if (!otp || otp.length < 4) {
      return NextResponse.json(
        { success: false, message: "Enter valid OTP", data: null, errors: null },
        { status: 400 }
      );
    }

    const key = `reg:${email}`;
    const verifiedKey = `reg-verified:${email}`;

    const result = await withMongo(async (db) => {
      const record = await db.collection("otps").findOne({ key });
      if (!record) return { ok: false as const };
      if (new Date(record.expiresAt).getTime() <= Date.now()) {
        await db.collection("otps").deleteOne({ key });
        return { ok: false as const };
      }
      if (String(record.otp) !== otp) return { ok: false as const };

      await db.collection("otps").deleteOne({ key });
      await db.collection("otps").updateOne(
        { key: verifiedKey },
        {
          $set: {
            key: verifiedKey,
            otp: "OK",
            expiresAt: new Date(Date.now() + 15 * 60 * 1000),
            updatedAt: new Date(),
          },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
      );
      return { ok: true as const };
    });

    if (!result.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired OTP",
          data: null,
          errors: null,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP verified",
      data: { verified: true, email },
      errors: null,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : "OTP verify failed",
        data: null,
        errors: null,
      },
      { status: 502 }
    );
  }
}
