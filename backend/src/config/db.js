import mongoose from "mongoose";
import { env } from "./env.js";
import { ApiError } from "../utils/apiError.js";

export const connectToDatabase = async () => {
  if (!env.mongodbUri) {
    throw new ApiError(500, "MONGODB_URI is not configured.");
  }

  mongoose.set("strictQuery", true);
  mongoose.set("sanitizeFilter", true);
  await mongoose.connect(env.mongodbUri);
  console.log("MongoDB connected");
};
