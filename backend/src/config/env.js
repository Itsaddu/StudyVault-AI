import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
});

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mongodbUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  uploadDir: process.env.UPLOAD_DIR || "uploads",
  maxUploadSizeMb: Number(process.env.MAX_UPLOAD_SIZE_MB || 10),
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  openaiModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  geminiModel: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  openRouterApiKey: process.env.OPENROUTER_API_KEY || "",
  openRouterBaseUrl: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
  openRouterDefaultModel: process.env.OPENROUTER_DEFAULT_MODEL || "openai/gpt-oss-120b",
  defaultAiProvider: (process.env.DEFAULT_AI_PROVIDER || "auto").toLowerCase(),
  aiFallbackChain: process.env.AI_FALLBACK_CHAIN || "gemini,openai,openrouter",
  aiProviderTimeoutMs: Number(process.env.AI_PROVIDER_TIMEOUT_MS || 45000),
  demoEmail: process.env.DEMO_EMAIL || "demo@studyvault.ai",
  demoPassword: process.env.DEMO_PASSWORD || "StudyVault123!",
  demoName: process.env.DEMO_NAME || "StudyVault Demo",
};

env.maxUploadSizeBytes = env.maxUploadSizeMb * 1024 * 1024;
