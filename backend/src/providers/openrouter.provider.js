import OpenAI from "openai";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";

let openRouterClient;

const createOpenRouterError = (statusCode, message, { retryable = true } = {}) => {
  const error = new ApiError(statusCode, message);
  error.provider = "openrouter";
  error.isAiProviderError = true;
  error.isRetryableAiProviderError = retryable;
  return error;
};

const stripJsonFences = (value) => {
  return value
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
};

const getOpenRouterClient = () => {
  if (!env.openRouterApiKey) {
    throw createOpenRouterError(503, "OpenRouter API key is missing. Add OPENROUTER_API_KEY.");
  }

  if (!openRouterClient) {
    openRouterClient = new OpenAI({
      apiKey: env.openRouterApiKey,
      baseURL: env.openRouterBaseUrl,
      timeout: env.aiProviderTimeoutMs,
      defaultHeaders: {
        "X-Title": "StudyVault AI",
      },
    });
  }

  return openRouterClient;
};

const getSafeModel = (model) => {
  const modelName = String(model || env.openRouterDefaultModel || "").trim();

  if (!/^[a-z0-9][a-z0-9._:-]*\/[a-z0-9][a-z0-9._:-]*$/i.test(modelName)) {
    throw createOpenRouterError(502, "OpenRouter model is unavailable or invalid.");
  }

  return modelName;
};

export const openRouterProvider = {
  name: "openrouter",
  label: "OpenRouter",

  async generateStructuredResponse({ schemaName, schema, systemPrompt, userPrompt, model }) {
    const client = getOpenRouterClient();
    const modelUsed = getSafeModel(model);

    let response;

    try {
      response = await client.chat.completions.create(
        {
          model: modelUsed,
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: `${userPrompt}

Return only valid JSON matching the requested schema. Do not include markdown or commentary.`,
            },
          ],
          temperature: 0.2,
          response_format: {
            type: "json_schema",
            json_schema: {
              name: schemaName,
              strict: true,
              schema,
            },
          },
        },
        {
          timeout: env.aiProviderTimeoutMs,
        }
      );
    } catch (error) {
      const message = String(error.message || "").toLowerCase();

      if (error.status === 401 || error.status === 403) {
        throw createOpenRouterError(502, "OpenRouter authentication failed. Check OPENROUTER_API_KEY.");
      }

      if (error.status === 404 || message.includes("model")) {
        throw createOpenRouterError(502, "OpenRouter model is unavailable or invalid.");
      }

      if (error.status === 429 || message.includes("quota") || message.includes("rate limit")) {
        throw createOpenRouterError(429, "OpenRouter quota or rate limit reached.");
      }

      if (error.code === "ETIMEDOUT" || error.name === "TimeoutError" || message.includes("timeout")) {
        throw createOpenRouterError(504, "OpenRouter request timed out.");
      }

      if (error.status >= 400 && error.status < 500) {
        throw createOpenRouterError(502, "OpenRouter rejected the generation request.");
      }

      throw createOpenRouterError(502, "OpenRouter is unavailable.");
    }

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
      throw createOpenRouterError(502, "OpenRouter returned an empty response.");
    }

    try {
      return JSON.parse(stripJsonFences(content));
    } catch (_error) {
      throw createOpenRouterError(502, "OpenRouter returned invalid structured data.");
    }
  },
};
