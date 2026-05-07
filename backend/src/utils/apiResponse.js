export const sendResponse = (
  response,
  { statusCode = 200, success = true, message = "Request successful.", data = null }
) => {
  return response.status(statusCode).json({
    success,
    message,
    data,
  });
};

