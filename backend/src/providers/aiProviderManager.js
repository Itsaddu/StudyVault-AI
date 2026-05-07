import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";
import { geminiProvider } from "./gemini.provider.js";
import { openAiProvider } from "./openai.provider.js";
import { openRouterProvider } from "./openrouter.provider.js";

export const PROVIDER_AUTO = "auto";
export const SUPPORTED_AI_PROVIDERS = ["gemini", "openai", "openrouter"];
export const SUPPORTED_PROVIDER_OPTIONS = [PROVIDER_AUTO, ...SUPPORTED_AI_PROVIDERS];
export const OPENROUTER_MODEL_OPTIONS = [
  "openai/gpt-oss-120b",
  "nvidia/nemotron-3-super",
];

const providers = {
  openai: openAiProvider,
  gemini: geminiProvider,
  openrouter: openRouterProvider,
};

export const normalizeAiProvider = (provider = PROVIDER_AUTO) => {
  const normalizedProvider = String(provider || PROVIDER_AUTO).trim().toLowerCase();

  if (!SUPPORTED_PROVIDER_OPTIONS.includes(normalizedProvider)) {
    throw new ApiError(400, "Invalid AI provider. Use auto, openai, gemini, or openrouter.");
  }

  return normalizedProvider;
};

export const normalizeOpenRouterModel = (model = "") => {
  const normalizedModel = String(model || "").trim();

  if (!normalizedModel) {
    return "";
  }

  const isSafeModelName =
    normalizedModel.length <= 120 &&
    /^[a-z0-9][a-z0-9._:-]*\/[a-z0-9][a-z0-9._:-]*$/i.test(normalizedModel);

  if (!isSafeModelName) {
    throw new ApiError(
      400,
      "Invalid OpenRouter model. Use a provider/model value like openai/gpt-oss-120b."
    );
  }

  return normalizedModel;
};

const getDefaultProvider = () => {
  return SUPPORTED_AI_PROVIDERS.includes(env.defaultAiProvider)
    ? env.defaultAiProvider
    : PROVIDER_AUTO;
};

const getConfiguredFallbackChain = () => {
  const providersFromEnv = env.aiFallbackChain
    .split(",")
    .map((provider) => provider.trim().toLowerCase())
    .filter((provider) => SUPPORTED_AI_PROVIDERS.includes(provider));

  const uniqueProviders = [...new Set(providersFromEnv)];
  const missingProviders = SUPPORTED_AI_PROVIDERS.filter(
    (provider) => !uniqueProviders.includes(provider)
  );

  return uniqueProviders.length > 0
    ? [...uniqueProviders, ...missingProviders]
    : ["gemini", "openai", "openrouter"];
};

const getAttemptOrder = (requestedProvider) => {
  const fallbackChain = getConfiguredFallbackChain();

  if (requestedProvider === PROVIDER_AUTO) {
    const defaultProvider = getDefaultProvider();

    if (defaultProvider === PROVIDER_AUTO) {
      return fallbackChain;
    }

    return [
      defaultProvider,
      ...fallbackChain.filter((provider) => provider !== defaultProvider),
    ];
  }

  return [
    requestedProvider,
    ...fallbackChain.filter((provider) => provider !== requestedProvider),
  ];
};

const shouldFallback = (error) => {
  if (error?.isRetryableAiProviderError) {
    return true;
  }

  return [408, 429, 500, 502, 503, 504].includes(error?.statusCode);
};

const getModelUsed = (providerName, requestedModel) => {
  if (providerName === "openrouter") {
    return requestedModel || env.openRouterDefaultModel;
  }

  if (providerName === "openai") {
    return env.openaiModel;
  }

  if (providerName === "gemini") {
    return env.geminiModel;
  }

  return "";
};

const buildFinalError = (errors) => {
  const retryableQuotaError = errors.find(({ error }) => error.statusCode === 429);
  const unavailableError = errors.find(({ error }) => error.statusCode === 503);

  if (retryableQuotaError && errors.length > 1) {
    throw new ApiError(
      429,
      "AI generation failed after fallback: one provider hit quota or rate limits, and another provider was unavailable or rejected the request. Please try again later."
    );
  }

  if (retryableQuotaError) {
    throw new ApiError(
      429,
      "All AI providers are currently quota-limited or rate-limited. Please try again later."
    );
  }

  if (unavailableError) {
    throw new ApiError(
      503,
      "No AI provider is currently available. Configure OPENAI_API_KEY, GEMINI_API_KEY, or OPENROUTER_API_KEY."
    );
  }

  throw new ApiError(502, "AI providers are temporarily unavailable. Please try again later.");
};

export const generateAiProviderResponse = async ({
  provider = PROVIDER_AUTO,
  schemaName,
  schema,
  systemPrompt,
  userPrompt,
  model,
}) => {
  const requestedProvider = normalizeAiProvider(provider);
  const requestedModel = normalizeOpenRouterModel(model);
  const attemptOrder = getAttemptOrder(requestedProvider);
  const errors = [];

  for (const [index, providerName] of attemptOrder.entries()) {
    try {
      const payload = await providers[providerName].generateStructuredResponse({
        schemaName,
        schema,
        systemPrompt,
        userPrompt,
        model: providerName === "openrouter" ? requestedModel : "",
      });

      const fallbackUsed = index > 0;
      const previousProvider = attemptOrder[index - 1];
      const modelUsed = getModelUsed(providerName, requestedModel);
      const fallbackReason = fallbackUsed ? errors[errors.length - 1]?.error?.message || "" : "";

      return {
        payload,
        providerRequested: requestedProvider,
        providerUsed: providerName,
        requestedProvider,
        modelUsed,
        fallbackUsed,
        fallbackReason,
        attemptedProviders: attemptOrder.slice(0, index + 1),
        fallbackMessage: fallbackUsed
          ? `${providers[previousProvider].label} was unavailable, so StudyVault automatically switched to ${providers[providerName].label}.`
          : "",
      };
    } catch (error) {
      errors.push({ provider: providerName, error });

      const hasNextProvider = index < attemptOrder.length - 1;

      if (hasNextProvider && shouldFallback(error)) {
        const nextProvider = attemptOrder[index + 1];
        console.warn(
          `AI provider fallback: ${providerName} failed (${error.message}); trying ${nextProvider}.`
        );
        continue;
      }

      break;
    }
  }

  buildFinalError(errors);
};
