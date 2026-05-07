import { Flashcard } from "../models/flashcard.model.js";
import { Note } from "../models/note.model.js";
import { Quiz } from "../models/quiz.model.js";
import { Summary } from "../models/summary.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { sendResponse } from "../utils/apiResponse.js";
import { flashcardSchema, quizSchema, summarySchema } from "../utils/aiSchemas.js";
import {
  SUPPORTED_AI_PROVIDERS,
  generateAiProviderResponse,
} from "../providers/aiProviderManager.js";
import { sanitizeAiResponse } from "../utils/sanitizeAiResponse.js";
import { validateAiPayload } from "../validators/ai.validator.js";

const MAX_SOURCE_CHARACTERS = 24000;

const buildSourceText = (note) => {
  const extractedText = typeof note.extractedText === "string" ? note.extractedText.trim() : "";

  if (!extractedText) {
    throw new ApiError(400, "This note does not contain extracted text for AI generation.");
  }

  if (extractedText.length <= MAX_SOURCE_CHARACTERS) {
    return extractedText;
  }

  return `${extractedText.slice(0, MAX_SOURCE_CHARACTERS)}\n\n[Source text truncated for length.]`;
};

const getOwnedNote = async ({ noteId, userId }) => {
  const note = await Note.findOne({
    _id: noteId,
    uploadedBy: userId,
  });

  if (!note) {
    throw new ApiError(404, "Note not found.");
  }

  return note;
};

const createPromptContext = (note) => {
  return `Note title: ${note.title}
Original file name: ${note.originalFileName}

Extracted study text:
${buildSourceText(note)}`;
};

const ensureSummaryShape = (payload) => {
  if (!payload.summary || !payload.examExplanation) {
    throw new ApiError(502, "AI provider returned an incomplete summary.");
  }

  if (!Array.isArray(payload.keyConcepts) || !Array.isArray(payload.importantPoints)) {
    throw new ApiError(502, "AI provider returned invalid summary lists.");
  }
};

const ensureQuizShape = (payload) => {
  if (!Array.isArray(payload.generatedQuestions) || payload.generatedQuestions.length !== 10) {
    throw new ApiError(502, "AI provider did not return exactly 10 quiz questions.");
  }

  payload.generatedQuestions.forEach((question) => {
    if (!Array.isArray(question.options) || question.options.length !== 4) {
      throw new ApiError(502, "Each generated quiz question must contain exactly 4 options.");
    }

    if (!question.options.includes(question.correctAnswer)) {
      throw new ApiError(502, "Quiz answer validation failed.");
    }
  });
};

const ensureFlashcardShape = (payload) => {
  if (!Array.isArray(payload.cards) || payload.cards.length === 0) {
    throw new ApiError(502, "AI provider returned no flashcards.");
  }
};

const getActivityItem = (item, type) => ({
  id: item._id.toString(),
  type,
  noteId: item.noteId?._id?.toString?.() || item.noteId?.toString?.() || item.noteId,
  noteTitle: item.noteId?.title || "Untitled note",
  providerRequested: item.providerRequested || "auto",
  providerUsed: item.providerUsed || "openai",
  modelUsed: item.modelUsed || "",
  fallbackUsed: Boolean(item.fallbackUsed),
  fallbackReason: item.fallbackReason || "",
  createdAt: item.createdAt,
});

const countProviderUsage = async (userId) => {
  const counts = await Promise.all(
    SUPPORTED_AI_PROVIDERS.map(async (provider) => {
      const [summaryCount, quizCount, flashcardCount] = await Promise.all([
        Summary.countDocuments({ userId, providerUsed: provider }),
        Quiz.countDocuments({ userId, providerUsed: provider }),
        Flashcard.countDocuments({ userId, providerUsed: provider }),
      ]);

      return [provider, summaryCount + quizCount + flashcardCount];
    })
  );

  return Object.fromEntries(counts);
};

const fetchAiActivity = async (userId, noteId = "") => {
  const [
    summaryCount,
    quizCount,
    flashcardCount,
    fallbackSummaryCount,
    fallbackQuizCount,
    fallbackFlashcardCount,
    providerUsage,
    recentSummaries,
    recentQuizzes,
    recentFlashcards,
  ] = await Promise.all([
      Summary.countDocuments({ userId }),
      Quiz.countDocuments({ userId }),
      Flashcard.countDocuments({ userId }),
      Summary.countDocuments({ userId, fallbackUsed: true }),
      Quiz.countDocuments({ userId, fallbackUsed: true }),
      Flashcard.countDocuments({ userId, fallbackUsed: true }),
      countProviderUsage(userId),
      Summary.find({ userId })
        .populate("noteId", "title")
        .sort({ createdAt: -1 })
        .limit(5),
      Quiz.find({ userId })
        .populate("noteId", "title")
        .sort({ createdAt: -1 })
        .limit(5),
      Flashcard.find({ userId })
        .populate("noteId", "title")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

  const recentActivity = [
    ...recentSummaries.map((item) => getActivityItem(item, "summary")),
    ...recentQuizzes.map((item) => getActivityItem(item, "quiz")),
    ...recentFlashcards.map((item) => getActivityItem(item, "flashcards")),
  ]
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, 8);

  const latestMaterials = noteId
    ? {
        summary: await Summary.findOne({ userId, noteId }).sort({ createdAt: -1 }),
        quiz: await Quiz.findOne({ userId, noteId }).sort({ createdAt: -1 }),
        flashcards: await Flashcard.findOne({ userId, noteId }).sort({ createdAt: -1 }),
      }
    : null;

  return {
    stats: {
      totalSummaries: summaryCount,
      totalQuizzes: quizCount,
      totalFlashcardSets: flashcardCount,
      totalAiGenerations: summaryCount + quizCount + flashcardCount,
      totalOpenAiGenerations: providerUsage.openai || 0,
      totalGeminiGenerations: providerUsage.gemini || 0,
      totalOpenRouterGenerations: providerUsage.openrouter || 0,
      fallbackGenerations: fallbackSummaryCount + fallbackQuizCount + fallbackFlashcardCount,
    },
    recentActivity,
    latestMaterials: latestMaterials
      ? {
          summary: latestMaterials.summary?.toClientObject() || null,
          quiz: latestMaterials.quiz?.toClientObject() || null,
          flashcards: latestMaterials.flashcards?.toClientObject() || null,
        }
      : null,
  };
};

export const getAiActivityController = asyncHandler(async (request, response) => {
  const noteId = typeof request.query.noteId === "string" ? request.query.noteId.trim() : "";

  if (noteId) {
    await getOwnedNote({
      noteId,
      userId: request.user.id,
    });
  }

  const activity = await fetchAiActivity(request.user.id, noteId);

  return sendResponse(response, {
    statusCode: 200,
    message: "AI activity fetched successfully.",
    data: activity,
  });
});

export const summarizeNoteController = asyncHandler(async (request, response) => {
  const { noteId, provider, model } = validateAiPayload(request.body);
  const note = await getOwnedNote({
    noteId,
    userId: request.user.id,
  });

  const generation = await generateAiProviderResponse({
    provider,
    schemaName: "study_summary",
    schema: summarySchema,
    model,
    systemPrompt:
      "You are an educational assistant. Generate accurate, concise study summaries from the provided source material. Stay grounded in the source text and avoid fabricating facts.",
    userPrompt: `Generate a JSON summary package for the following note.\n\n${createPromptContext(note)}`,
  });

  const sanitizedResult = sanitizeAiResponse(generation.payload);
  ensureSummaryShape(sanitizedResult);

  const summary = await Summary.create({
    userId: request.user.id,
    noteId: note._id,
    providerRequested: generation.providerRequested,
    providerUsed: generation.providerUsed,
    modelUsed: generation.modelUsed,
    fallbackUsed: generation.fallbackUsed,
    fallbackReason: generation.fallbackReason,
    summary: sanitizedResult.summary,
    keyPoints: sanitizedResult.keyPoints,
    keyConcepts: sanitizedResult.keyConcepts,
    importantPoints: sanitizedResult.importantPoints,
    examExplanation: sanitizedResult.examExplanation,
  });

  return sendResponse(response, {
    statusCode: 201,
    message: generation.fallbackMessage || "Summary generated successfully.",
    data: {
      summary: summary.toClientObject(),
      provider: generation,
    },
  });
});

export const generateQuizController = asyncHandler(async (request, response) => {
  const { noteId, provider, model } = validateAiPayload(request.body);
  const note = await getOwnedNote({
    noteId,
    userId: request.user.id,
  });

  const generation = await generateAiProviderResponse({
    provider,
    schemaName: "study_quiz",
    schema: quizSchema,
    model,
    systemPrompt:
      "You are an educational quiz generator. Create exam-style multiple-choice questions strictly from the source material. Always provide 10 questions and exactly 4 options per question.",
    userPrompt: `Generate a JSON quiz package for the following note.\n\n${createPromptContext(note)}`,
  });

  const sanitizedResult = sanitizeAiResponse(generation.payload);
  ensureQuizShape(sanitizedResult);

  const quiz = await Quiz.create({
    userId: request.user.id,
    noteId: note._id,
    providerRequested: generation.providerRequested,
    providerUsed: generation.providerUsed,
    modelUsed: generation.modelUsed,
    fallbackUsed: generation.fallbackUsed,
    fallbackReason: generation.fallbackReason,
    generatedQuestions: sanitizedResult.generatedQuestions,
  });

  return sendResponse(response, {
    statusCode: 201,
    message: generation.fallbackMessage || "Quiz generated successfully.",
    data: {
      quiz: quiz.toClientObject(),
      provider: generation,
    },
  });
});

export const generateFlashcardsController = asyncHandler(async (request, response) => {
  const { noteId, provider, model } = validateAiPayload(request.body);
  const note = await getOwnedNote({
    noteId,
    userId: request.user.id,
  });

  const generation = await generateAiProviderResponse({
    provider,
    schemaName: "study_flashcards",
    schema: flashcardSchema,
    model,
    systemPrompt:
      "You are an educational flashcard generator. Create concise, study-friendly flashcards strictly from the provided note. Prefer direct question-answer wording.",
    userPrompt: `Generate a JSON flashcard package for the following note.\n\n${createPromptContext(note)}`,
  });

  const sanitizedResult = sanitizeAiResponse(generation.payload);
  ensureFlashcardShape(sanitizedResult);

  const flashcards = await Flashcard.create({
    userId: request.user.id,
    noteId: note._id,
    providerRequested: generation.providerRequested,
    providerUsed: generation.providerUsed,
    modelUsed: generation.modelUsed,
    fallbackUsed: generation.fallbackUsed,
    fallbackReason: generation.fallbackReason,
    cards: sanitizedResult.cards,
  });

  return sendResponse(response, {
    statusCode: 201,
    message: generation.fallbackMessage || "Flashcards generated successfully.",
    data: {
      flashcards: flashcards.toClientObject(),
      provider: generation,
    },
  });
});
