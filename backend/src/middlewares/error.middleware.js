export const errorMiddleware = (error, _request, response, _next) => {
  if (error?.message === "Origin not allowed by CORS") {
    return response.status(403).json({
      success: false,
      message: "This origin is not allowed to access the API.",
      details: null,
    });
  }

  if (error?.code === 11000) {
    return response.status(409).json({
      success: false,
      message: "A record with this value already exists.",
      details: error.keyValue || null,
    });
  }

  if (error?.name === "ValidationError") {
    return response.status(400).json({
      success: false,
      message: "Validation failed.",
      details: Object.values(error.errors).map((validationError) => validationError.message),
    });
  }

  if (error?.name === "CastError") {
    return response.status(400).json({
      success: false,
      message: "Invalid resource identifier.",
      details: null,
    });
  }

  if (error?.type === "entity.too.large") {
    return response.status(413).json({
      success: false,
      message: "Request payload is too large.",
      details: null,
    });
  }

  response.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
    details:
      process.env.NODE_ENV === "development"
        ? error.details || error.stack || null
        : error.details || null,
  });
};
