import rateLimit from "express-rate-limit";

const createRateLimit = ({ windowMs, max, message }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message,
      details: null,
    },
  });

export const apiRateLimitMiddleware = createRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: "Too many API requests. Please try again later.",
});

export const authRateLimitMiddleware = createRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Too many authentication attempts. Please wait and try again.",
});

