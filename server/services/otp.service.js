import Otp from "../models/Otp.js";
import logger from "../utils/logger.js";

/** In-memory fallback when Mongo is briefly unavailable */
const memoryStore = new Map();

/** OTP expiry: 5 minutes */
const DEFAULT_TTL = 5 * 60 * 1000;

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const setMemory = (key, otp, ttlMs) => {
  memoryStore.set(String(key), {
    otp: String(otp),
    expiresAt: Date.now() + ttlMs,
  });
};

const getMemory = (key) => {
  const record = memoryStore.get(String(key));
  if (!record) return null;
  if (Date.now() > record.expiresAt) {
    memoryStore.delete(String(key));
    return null;
  }
  return record;
};

export const saveOTP = async (key, otp, ttlMs = DEFAULT_TTL) => {
  const k = String(key);
  const expiresAt = new Date(Date.now() + ttlMs);
  setMemory(k, otp, ttlMs);

  try {
    await Otp.findOneAndUpdate(
      { key: k },
      { otp: String(otp), expiresAt },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } catch (err) {
    logger.warn(`OTP Mongo save failed for ${k}: ${err.message}`);
  }
};

export const peekOTP = async (key) => {
  const k = String(key);
  const mem = getMemory(k);
  if (mem) return mem.otp;

  try {
    const record = await Otp.findOne({ key: k });
    if (!record) return null;
    if (record.expiresAt.getTime() <= Date.now()) {
      await Otp.deleteOne({ key: k });
      return null;
    }
    return record.otp;
  } catch (err) {
    logger.warn(`OTP Mongo peek failed for ${k}: ${err.message}`);
    return null;
  }
};

export const verifyOTP = async (key, otp) => {
  const k = String(key);
  const expected = String(otp);

  const mem = getMemory(k);
  if (mem) {
    const valid = mem.otp === expected;
    if (valid) memoryStore.delete(k);
    if (valid) {
      try {
        await Otp.deleteOne({ key: k });
      } catch {
        /* ignore */
      }
      return true;
    }
  }

  try {
    const record = await Otp.findOne({ key: k });
    if (!record) return false;
    if (record.expiresAt.getTime() <= Date.now()) {
      await Otp.deleteOne({ key: k });
      return false;
    }
    const valid = record.otp === expected;
    if (valid) {
      memoryStore.delete(k);
      await Otp.deleteOne({ key: k });
    }
    return valid;
  } catch (err) {
    logger.warn(`OTP Mongo verify failed for ${k}: ${err.message}`);
    return false;
  }
};

/** Consume a previously marked verified registration session (keyed by email) */
export const consumeVerifiedSession = async (email) => {
  const key = `reg-verified:${String(email).trim().toLowerCase()}`;
  const ok = await verifyOTP(key, "OK");
  return ok;
};

export default {
  generateOTP,
  saveOTP,
  verifyOTP,
  peekOTP,
  consumeVerifiedSession,
};
