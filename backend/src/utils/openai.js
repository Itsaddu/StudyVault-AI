import { openAiProvider } from "../providers/openai.provider.js";

export const generateStructuredAiResponse = (payload) => {
  return openAiProvider.generateStructuredResponse(payload);
};
