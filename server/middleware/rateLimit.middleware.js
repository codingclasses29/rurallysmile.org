import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  // Do not count successful GETs as aggressively for shared hosting
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
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message:
      "Too many login attempts. Please wait 5–10 minutes, then try again with the correct password.",
    data: null,
    errors: null,
  },
});

export const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Registration limit reached, please try again later",
    data: null,
    errors: null,
  },
});

export default limiter;
