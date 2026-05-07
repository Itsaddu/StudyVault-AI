import rateLimit from "express-rate-limit";

export const aiRateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 12,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "AI generation limit reached. Please wait a few minutes before trying again.",
    details: null,
  },
});

