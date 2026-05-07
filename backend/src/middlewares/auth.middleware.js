import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyToken } from "../utils/jwt.js";

const getBearerToken = (authorizationHeader = "") => {
  if (!authorizationHeader.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.split(" ")[1];
};

export const protect = asyncHandler(async (request, _response, next) => {
  const token = getBearerToken(request.headers.authorization);

  if (!token) {
    throw new ApiError(401, "Authorization token is required.");
  }

  const decodedToken = await verifyToken(token);

  const user = await User.findById(decodedToken.userId);

  if (!user) {
    throw new ApiError(401, "User associated with this token no longer exists.");
  }

  request.user = user;
  next();
});

