import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { sendResponse } from "../utils/apiResponse.js";
import { generateToken } from "../utils/jwt.js";
import {
  validateLoginPayload,
  validateRegisterPayload,
} from "../validators/auth.validator.js";

const buildAuthPayload = async (user) => {
  const token = await generateToken({ userId: user._id.toString() });

  return {
    token,
    user: user.toSafeObject(),
  };
};

export const registerController = asyncHandler(async (request, response) => {
  const { name, email, password } = validateRegisterPayload(request.body);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const authPayload = await buildAuthPayload(user);

  return sendResponse(response, {
    statusCode: 201,
    message: "Registration successful.",
    data: authPayload,
  });
});

export const loginController = asyncHandler(async (request, response) => {
  const { email, password } = validateLoginPayload(request.body);

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const authPayload = await buildAuthPayload(user);

  return sendResponse(response, {
    statusCode: 200,
    message: "Login successful.",
    data: authPayload,
  });
});

export const profileController = asyncHandler(async (request, response) => {
  if (!request.user) {
    throw new ApiError(401, "Authentication required.");
  }

  return sendResponse(response, {
    statusCode: 200,
    message: "Profile fetched successfully.",
    data: {
      user: request.user.toSafeObject(),
    },
  });
});
