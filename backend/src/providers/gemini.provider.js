import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";

let geminiClient;

const createGeminiError = (statusCode, message, { retryable = true } = {}) => {
  const error = new ApiError(statusCode, message);
  error.provider = "gemini";
  error.isAiProviderError = true;
  error.isRetryableAiProviderError = retryable;
  return error;
};

const getGeminiClient = () => {
  if (!env.geminiApiKey) {
    throw createGeminiError(503, "Gemini is not configured. Add GEMINI_API_KEY.");
  }

  if (!geminiClient) {
    geminiClient = new GoogleGenerativeAI(env.geminiApiKey);
  }

  return geminiClient;
};

const toGeminiSchema = (schema) => {
  if (!schema || typeof schema !== "object") {
    return schema;
  }

  const result = {
    type: schema.type,
  };

  if (schema.properties) {
    result.properties = Object.fromEntries(
      Object.entries(schema.properties).map(([key, value]) => [key, toGeminiSchema(value)])
    );
  }

  if (schema.items) {
    result.items = toGeminiSchema(schema.items);
  }

  if (schema.required) {
    result.required = schema.required;
  }

  if (schema.description) {
    result.description = schema.description;
  }

  return result;
};

const stripJsonFences = (value) => {
  return value
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
};

const getGeminiStatus = (error) => {
  return error.status || error.statusCode || error.response?.status || 0;
};

export const geminiProvider = {
  name: "gemini",
  label: "Gemini",

  async generateStructuredResponse({ schema, systemPrompt, userPrompt }) {
    const client = getGeminiClient();
    const model = client.getGenerativeModel(
      {
        model: env.geminiModel,
        systemInstruction: systemPrompt,
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: toGeminiSchema(schema),
        },
      },
      {
        timeout: env.aiProviderTimeoutMs,
      }
    );

    let result;

    try {
      result = await model.generateContent(
        {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${userPrompt}

Return only valid JSON. Do not include markdown, commentary, or extra keys.`,
                },
              ],
            },
          ],
        },
        {
          timeout: env.aiProviderTimeoutMs,
        }
      );
    } catch (error) {
      const status = getGeminiStatus(error);
      const message = error.message || "";

      const normalizedMessage = message.toLowerCase();

      if (
        status === 401 ||
        status === 403 ||
        normalizedMessage.includes("api key") ||
        normalizedMessage.includes("api_key_invalid") ||
        normalizedMessage.includes("key not valid")
      ) {
        throw createGeminiError(502, "Gemini authentication failed. Check GEMINI_API_KEY.");
      }

      if (status === 429 || normalizedMessage.includes("quota")) {
        throw createGeminiError(429, "Gemini quota or rate limit reached.");
      }

      if (status === 408 || normalizedMessage.includes("timeout")) {
        throw createGeminiError(504, "Gemini request timed out.");
      }

      if (status >= 400 && status < 500) {
        throw createGeminiError(502, "Gemini rejected the generation request.");
      }

      throw createGeminiError(502, "Gemini is unavailable.");
    }

    const text = result.response.text();

    if (!text) {
      throw createGeminiError(502, "Gemini returned an empty response.");
    }

    try {
      return JSON.parse(stripJsonFences(text));
    } catch (_error) {
      throw createGeminiError(502, "Gemini returned invalid structured data.");
    }
  },
};
