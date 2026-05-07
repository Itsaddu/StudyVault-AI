import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "./apiError.js";

export const generateToken = async (payload) => {
  if (!env.jwtSecret) {
    throw new ApiError(500, "JWT_SECRET is not configured.");
  }

  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

export const verifyToken = async (token) => {
  if (!env.jwtSecret) {
    throw new ApiError(500, "JWT_SECRET is not configured.");
  }

  try {
    return jwt.verify(token, env.jwtSecret);
  } catch (_error) {
    throw new ApiError(401, "Invalid or expired token.");
  }
};

