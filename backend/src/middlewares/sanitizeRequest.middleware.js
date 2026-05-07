const sanitizeValue = (value) => {
  if (typeof value === "string") {
    return value.replace(/\u0000/g, "").trim();
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }

  if (value && typeof value === "object") {
    return Object.entries(value).reduce((result, [key, nestedValue]) => {
      const safeKey = key.replace(/^\$+/g, "").replace(/\./g, "");

      if (!safeKey) {
        return result;
      }

      result[safeKey] = sanitizeValue(nestedValue);
      return result;
    }, {});
  }

  return value;
};

export const sanitizeRequestMiddleware = (request, _response, next) => {
  if (request.body) {
    request.body = sanitizeValue(request.body);
  }

  if (request.query) {
    request.query = sanitizeValue(request.query);
  }

  if (request.params) {
    request.params = sanitizeValue(request.params);
  }

  next();
};

