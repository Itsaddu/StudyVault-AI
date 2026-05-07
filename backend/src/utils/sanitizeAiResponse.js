const normalizeWhitespace = (value) => {
  return value.replace(/\r/g, "").replace(/\n{3,}/g, "\n\n").trim();
};

export const sanitizeAiResponse = (value) => {
  if (typeof value === "string") {
    return normalizeWhitespace(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeAiResponse(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, sanitizeAiResponse(nestedValue)])
    );
  }

  return value;
};

