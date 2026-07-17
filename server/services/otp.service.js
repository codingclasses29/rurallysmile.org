const otpStore = new Map();

/** OTP expiry: 5 minutes (Phase 3.5) */
const DEFAULT_TTL = 5 * 60 * 1000;

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const saveOTP = (key, otp, ttlMs = DEFAULT_TTL) => {
  otpStore.set(String(key), {
    otp: String(otp),
    expiresAt: Date.now() + ttlMs,
  });
};

export const peekOTP = (key) => {
  const record = otpStore.get(String(key));
  if (!record) return null;
  if (Date.now() > record.expiresAt) {
    otpStore.delete(String(key));
    return null;
  }
  return record.otp;
};

export const verifyOTP = (key, otp) => {
  const record = otpStore.get(String(key));
  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    otpStore.delete(String(key));
    return false;
  }
  const valid = record.otp === String(otp);
  if (valid) otpStore.delete(String(key));
  return valid;
};

/** Consume a previously marked verified registration session (keyed by email) */
export const consumeVerifiedSession = (email) => {
  const key = `reg-verified:${String(email).trim().toLowerCase()}`;
  const record = otpStore.get(key);
  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    otpStore.delete(key);
    return false;
  }
  if (record.otp !== "OK") return false;
  otpStore.delete(key);
  return true;
};

export default { generateOTP, saveOTP, verifyOTP, peekOTP, consumeVerifiedSession };
