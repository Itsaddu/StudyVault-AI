import OpenAI from "openai";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";

let openaiClient;

const createOpenAiError = (statusCode, message, { retryable = true } = {}) => {
  const error = new ApiError(statusCode, message);
  error.provider = "openai";
  error.isAiProviderError = true;
  error.isRetryableAiProviderError = retryable;
  return error;
};

const getOpenAiClient = () => {
  if (!env.openaiApiKey) {
    throw createOpenAiError(503, "OpenAI is not configured. Add OPENAI_API_KEY.");
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: env.openaiApiKey,
      timeout: env.aiProviderTimeoutMs,
    });
  }

  return openaiClient;
};

export const openAiProvider = {
  name: "openai",
  label: "OpenAI",

  async generateStructuredResponse({ schemaName, schema, systemPrompt, userPrompt }) {
    const client = getOpenAiClient();

    let response;

    try {
      response = await client.responses.create(
        {
          model: env.openaiModel,
          input: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: userPrompt,
            },
          ],
          text: {
            format: {
              type: "json_schema",
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
      if (error.status === 401) {
        throw createOpenAiError(502, "OpenAI authentication failed. Check OPENAI_API_KEY.");
      }

      if (error.status === 429) {
        throw createOpenAiError(429, "OpenAI quota or rate limit reached.");
      }

      if (error.code === "ETIMEDOUT" || error.name === "TimeoutError") {
        throw createOpenAiError(504, "OpenAI request timed out.");
      }

      if (error.status >= 400 && error.status < 500) {
        throw createOpenAiError(502, "OpenAI rejected the generation request.");
      }

      throw createOpenAiError(502, "OpenAI is unavailable.");
    }

    if (!response.output_text) {
      throw createOpenAiError(502, "OpenAI returned an empty response.");
    }

    try {
      return JSON.parse(response.output_text);
    } catch (_error) {
      throw createOpenAiError(502, "OpenAI returned invalid structured data.");
    }
  },
};
