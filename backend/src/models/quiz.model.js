import mongoose from "mongoose";

const generatedQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length === 4,
        message: "Each quiz question must have exactly 4 options.",
      },
    },
    correctAnswer: {
      type: String,
      required: true,
      trim: true,
    },
    difficultyLevel: {
      type: String,
      required: true,
      trim: true,
    },
    explanation: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const quizSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: true,
      index: true,
    },
    providerRequested: {
      type: String,
      enum: ["auto", "openai", "gemini", "openrouter"],
      default: "auto",
    },
    providerUsed: {
      type: String,
      enum: ["openai", "gemini", "openrouter"],
      default: "openai",
      index: true,
    },
    modelUsed: {
      type: String,
      default: "",
      trim: true,
      maxlength: 120,
    },
    fallbackUsed: {
      type: Boolean,
      default: false,
      index: true,
    },
    fallbackReason: {
      type: String,
      default: "",
      trim: true,
      maxlength: 240,
    },
    generatedQuestions: {
      type: [generatedQuestionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

quizSchema.methods.toClientObject = function toClientObject() {
  return {
    id: this._id.toString(),
    userId: this.userId?.toString?.() || this.userId,
    noteId: this.noteId?.toString?.() || this.noteId,
    providerRequested: this.providerRequested || "auto",
    providerUsed: this.providerUsed || "openai",
    modelUsed: this.modelUsed || "",
    fallbackUsed: Boolean(this.fallbackUsed),
    fallbackReason: this.fallbackReason || "",
    generatedQuestions: this.generatedQuestions,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const Quiz = mongoose.model("Quiz", quizSchema);
