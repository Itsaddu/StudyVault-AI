import { ApiError } from "../utils/apiError.js";

const sanitizeString = (value) => (typeof value === "string" ? value.trim() : "");

export const validateRegisterPayload = (payload = {}) => {
  const name = sanitizeString(payload.name);
  const email = sanitizeString(payload.email).toLowerCase();
  const password = typeof payload.password === "string" ? payload.password : "";

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required.");
  }

  if (name.length < 2) {
    throw new ApiError(400, "Name must be at least 2 characters long.");
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new ApiError(400, "Please provide a valid email address.");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long.");
  }

  return { name, email, password };
};

export const validateLoginPayload = (payload = {}) => {
  const email = sanitizeString(payload.email).toLowerCase();
  const password = typeof payload.password === "string" ? payload.password : "";

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new ApiError(400, "Please provide a valid email address.");
  }

  return { email, password };
};
