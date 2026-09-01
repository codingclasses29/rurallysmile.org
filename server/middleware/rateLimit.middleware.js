import rateLimit from "express-rate-limit";

// Helper to extract true client IP across Vercel/Render proxy chains
export const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return String(forwarded).split(",")[0].trim();
  }
  return req.headers["x-real-ip"] || req.ip || "127.0.0.1";
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientIp,
  skip: (req) => req.method === "OPTIONS",
  message: {
    success: false,
    message: "Too Many Requests. Please wait a minute and try again.",
    data: null,
    errors: null,
  },
});

export const generalLimiter = limiter;

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: getClientIp,
  message: {
    success: false,
    message:
      "Too many login attempts. Please wait 5–10 minutes, then try again with the correct password.",
    data: null,
    errors: null,
  },
});

export const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000, // High capacity for school labs and mass registrations
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientIp,
  skip: (req) => req.method === "OPTIONS",
  message: {
    success: false,
    message: "Registration limit reached, please try again later",
    data: null,
    errors: null,
  },
});

export default limiter;
