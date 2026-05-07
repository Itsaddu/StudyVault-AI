import { ApiError } from "../utils/apiError.js";
import {
  normalizeAiProvider,
  normalizeOpenRouterModel,
} from "../providers/aiProviderManager.js";

export const validateAiPayload = (payload = {}) => {
  const noteId = typeof payload.noteId === "string" ? payload.noteId.trim() : "";
  const provider = normalizeAiProvider(payload.provider || "auto");
  const model = normalizeOpenRouterModel(payload.model || "");

  if (!noteId) {
    throw new ApiError(400, "noteId is required.");
  }

  return {
    noteId,
    provider,
    model,
  };
};
