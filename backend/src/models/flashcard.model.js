import mongoose from "mongoose";

const flashcardSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const flashcardSetSchema = new mongoose.Schema(
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
    cards: {
      type: [flashcardSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

flashcardSetSchema.methods.toClientObject = function toClientObject() {
  return {
    id: this._id.toString(),
    userId: this.userId?.toString?.() || this.userId,
    noteId: this.noteId?.toString?.() || this.noteId,
    providerRequested: this.providerRequested || "auto",
    providerUsed: this.providerUsed || "openai",
    modelUsed: this.modelUsed || "",
    fallbackUsed: Boolean(this.fallbackUsed),
    fallbackReason: this.fallbackReason || "",
    cards: this.cards,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const Flashcard = mongoose.model("Flashcard", flashcardSetSchema);
