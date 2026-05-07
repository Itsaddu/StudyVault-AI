export const summarySchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string" },
    keyConcepts: {
      type: "array",
      items: { type: "string" },
    },
    importantPoints: {
      type: "array",
      items: { type: "string" },
    },
    examExplanation: { type: "string" },
    keyPoints: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["summary", "keyConcepts", "importantPoints", "examExplanation", "keyPoints"],
};

export const quizSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    generatedQuestions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          question: { type: "string" },
          options: {
            type: "array",
            items: { type: "string" },
          },
          correctAnswer: { type: "string" },
          difficultyLevel: { type: "string" },
          explanation: { type: "string" },
        },
        required: ["question", "options", "correctAnswer", "difficultyLevel", "explanation"],
      },
    },
  },
  required: ["generatedQuestions"],
};

export const flashcardSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cards: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          question: { type: "string" },
          answer: { type: "string" },
        },
        required: ["question", "answer"],
      },
    },
  },
  required: ["cards"],
};

