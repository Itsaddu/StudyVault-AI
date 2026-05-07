import { ApiError } from "../utils/apiError.js";

const sanitizeString = (value) => (typeof value === "string" ? value.trim() : "");

export const validateUploadPayload = (payload = {}, file) => {
  const title = sanitizeString(payload.title);

  if (!title) {
    throw new ApiError(400, "Title is required.");
  }

  if (title.length < 2) {
    throw new ApiError(400, "Title must be at least 2 characters long.");
  }

  if (title.length > 120) {
    throw new ApiError(400, "Title cannot exceed 120 characters.");
  }

  if (!file) {
    throw new ApiError(400, "A file is required.");
  }

  return { title };
};

