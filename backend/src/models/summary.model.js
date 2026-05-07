import mongoose from "mongoose";

const summarySchema = new mongoose.Schema(
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
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    keyPoints: {
      type: [String],
      default: [],
    },
    keyConcepts: {
      type: [String],
      default: [],
    },
    importantPoints: {
      type: [String],
      default: [],
    },
    examExplanation: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

summarySchema.methods.toClientObject = function toClientObject() {
  return {
    id: this._id.toString(),
    userId: this.userId?.toString?.() || this.userId,
    noteId: this.noteId?.toString?.() || this.noteId,
    providerRequested: this.providerRequested || "auto",
    providerUsed: this.providerUsed || "openai",
    modelUsed: this.modelUsed || "",
    fallbackUsed: Boolean(this.fallbackUsed),
    fallbackReason: this.fallbackReason || "",
    summary: this.summary,
    keyPoints: this.keyPoints,
    keyConcepts: this.keyConcepts,
    importantPoints: this.importantPoints,
    examExplanation: this.examExplanation,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const Summary = mongoose.model("Summary", summarySchema);
