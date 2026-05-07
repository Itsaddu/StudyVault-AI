import { createContext, useEffect, useState } from "react";
import { aiApi } from "../services/api";
import { useNotes } from "../hooks/useNotes";
import { getProviderLabel } from "../components/dashboard/ProviderBadge";

const defaultAiStats = {
  totalSummaries: 0,
  totalQuizzes: 0,
  totalFlashcardSets: 0,
  totalAiGenerations: 0,
  totalOpenAiGenerations: 0,
  totalGeminiGenerations: 0,
  totalOpenRouterGenerations: 0,
  fallbackGenerations: 0,
};

const AI_PROVIDER_STORAGE_KEY = "studyvault_ai_provider";
const OPENROUTER_MODEL_STORAGE_KEY = "studyvault_openrouter_model";
const DEFAULT_OPENROUTER_MODEL = "openai/gpt-oss-120b";
const supportedProviders = new Set(["auto", "openai", "gemini", "openrouter"]);
const supportedOpenRouterModels = new Set([
  "openai/gpt-oss-120b",
  "nvidia/nemotron-3-super",
]);

const getInitialProvider = () => {
  try {
    const storedProvider = sessionStorage.getItem(AI_PROVIDER_STORAGE_KEY);
    return supportedProviders.has(storedProvider) ? storedProvider : "auto";
  } catch (_error) {
    return "auto";
  }
};

const getInitialOpenRouterModel = () => {
  try {
    const storedModel = sessionStorage.getItem(OPENROUTER_MODEL_STORAGE_KEY);
    return supportedOpenRouterModels.has(storedModel) ? storedModel : DEFAULT_OPENROUTER_MODEL;
  } catch (_error) {
    return DEFAULT_OPENROUTER_MODEL;
  }
};

export const AIContext = createContext(null);

export function AIProvider({ children }) {
  const { showToast } = useNotes();
  const [aiStats, setAiStats] = useState(defaultAiStats);
  const [recentAiActivity, setRecentAiActivity] = useState([]);
  const [materialsByNoteId, setMaterialsByNoteId] = useState({});
  const [isLoadingAiActivity, setIsLoadingAiActivity] = useState(true);
  const [isLoadingMaterialNoteId, setIsLoadingMaterialNoteId] = useState("");
  const [activeGenerationType, setActiveGenerationType] = useState("");
  const [aiError, setAiError] = useState("");
  const [selectedProvider, setSelectedProviderState] = useState(getInitialProvider);
  const [selectedOpenRouterModel, setSelectedOpenRouterModelState] =
    useState(getInitialOpenRouterModel);

  const setSelectedProvider = (provider) => {
    const safeProvider = supportedProviders.has(provider) ? provider : "auto";
    try {
      sessionStorage.setItem(AI_PROVIDER_STORAGE_KEY, safeProvider);
    } catch (_error) {
      // Storage can be blocked in strict browser privacy modes; keep in-memory state.
    }
    setSelectedProviderState(safeProvider);
  };

  const setSelectedOpenRouterModel = (model) => {
    const safeModel = supportedOpenRouterModels.has(model) ? model : DEFAULT_OPENROUTER_MODEL;
    try {
      sessionStorage.setItem(OPENROUTER_MODEL_STORAGE_KEY, safeModel);
    } catch (_error) {
      // Storage can be blocked in strict browser privacy modes; keep in-memory state.
    }
    setSelectedOpenRouterModelState(safeModel);
  };

  const mergeLatestMaterials = (noteId, latestMaterials) => {
    setMaterialsByNoteId((currentValue) => ({
      ...currentValue,
      [noteId]: {
        summary: latestMaterials?.summary || currentValue[noteId]?.summary || null,
        quiz: latestMaterials?.quiz || currentValue[noteId]?.quiz || null,
        flashcards: latestMaterials?.flashcards || currentValue[noteId]?.flashcards || null,
      },
    }));
  };

  const refreshAiActivity = async () => {
    setIsLoadingAiActivity(true);

    try {
      const response = await aiApi.getActivity();
      setAiStats(response.stats);
      setRecentAiActivity(response.recentActivity);
      setAiError("");
    } catch (error) {
      setAiError(error.message);
      showToast("error", error.message);
    } finally {
      setIsLoadingAiActivity(false);
    }
  };

  useEffect(() => {
    refreshAiActivity();
  }, []);

  const loadNoteMaterials = async (noteId) => {
    if (!noteId) {
      return null;
    }

    setIsLoadingMaterialNoteId(noteId);

    try {
      const response = await aiApi.getActivity(noteId);
      setAiStats(response.stats);
      setRecentAiActivity(response.recentActivity);
      mergeLatestMaterials(noteId, response.latestMaterials);
      return response.latestMaterials;
    } catch (error) {
      showToast("error", error.message);
      throw error;
    } finally {
      setIsLoadingMaterialNoteId("");
    }
  };

  const generateWithRefresh = async ({ noteId, type, request }) => {
    setActiveGenerationType(type);

    try {
      const response = await request();

      setMaterialsByNoteId((currentValue) => ({
        ...currentValue,
        [noteId]: {
          ...currentValue[noteId],
          [type]: response[type],
        },
      }));

      await refreshAiActivity();
      const provider = response.provider || {};
      const providerLabel = getProviderLabel(provider.providerUsed || response[type]?.providerUsed);
      const successMessage =
        provider.fallbackUsed && provider.fallbackMessage
          ? provider.fallbackMessage
          : `${type.charAt(0).toUpperCase()}${type.slice(1)} generated with ${providerLabel}.`;

      showToast("success", successMessage);
      return response[type];
    } catch (error) {
      showToast("error", error.message);
      throw error;
    } finally {
      setActiveGenerationType("");
    }
  };

  const buildGenerationPayload = (noteId, provider) => ({
    noteId,
    provider,
    model: provider === "openrouter" ? selectedOpenRouterModel : undefined,
  });

  const generateSummary = async (noteId, provider = selectedProvider) => {
    return generateWithRefresh({
      noteId,
      type: "summary",
      request: () => aiApi.summarize(buildGenerationPayload(noteId, provider)),
    });
  };

  const generateQuiz = async (noteId, provider = selectedProvider) => {
    return generateWithRefresh({
      noteId,
      type: "quiz",
      request: () => aiApi.generateQuiz(buildGenerationPayload(noteId, provider)),
    });
  };

  const generateFlashcards = async (noteId, provider = selectedProvider) => {
    return generateWithRefresh({
      noteId,
      type: "flashcards",
      request: () => aiApi.generateFlashcards(buildGenerationPayload(noteId, provider)),
    });
  };

  const value = {
    aiStats,
    recentAiActivity,
    materialsByNoteId,
    isLoadingAiActivity,
    isLoadingMaterialNoteId,
    activeGenerationType,
    aiError,
    selectedProvider,
    selectedOpenRouterModel,
    setSelectedProvider,
    setSelectedOpenRouterModel,
    refreshAiActivity,
    loadNoteMaterials,
    generateSummary,
    generateQuiz,
    generateFlashcards,
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}
