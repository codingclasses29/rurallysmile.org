import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too Many Requests",
    data: null,
    errors: null,
  },
});

export const generalLimiter = limiter;

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many login attempts, please try again later",
    data: null,
    errors: null,
  },
});

export const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Registration limit reached, please try again later",
    data: null,
    errors: null,
  },
});

export default limiter;
