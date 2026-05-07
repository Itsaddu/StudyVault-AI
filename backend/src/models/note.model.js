import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
      minlength: [2, "Title must be at least 2 characters long."],
      maxlength: [120, "Title cannot exceed 120 characters."],
    },
    originalFileName: {
      type: String,
      required: [true, "Original file name is required."],
      trim: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    extractedText: {
      type: String,
      default: "",
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
      min: [1, "File size must be greater than zero."],
    },
    mimeType: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.methods.toSummaryObject = function toSummaryObject() {
  return {
    id: this._id.toString(),
    title: this.title,
    originalFileName: this.originalFileName,
    uploadedBy: this.uploadedBy?.toString?.() || this.uploadedBy,
    uploadDate: this.uploadDate,
    fileSize: this.fileSize,
    mimeType: this.mimeType,
    extractedTextPreview: this.extractedText.slice(0, 240),
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

noteSchema.methods.toDetailObject = function toDetailObject() {
  return {
    id: this._id.toString(),
    title: this.title,
    originalFileName: this.originalFileName,
    uploadedBy: this.uploadedBy?.toString?.() || this.uploadedBy,
    extractedText: this.extractedText,
    uploadDate: this.uploadDate,
    fileSize: this.fileSize,
    mimeType: this.mimeType,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const Note = mongoose.model("Note", noteSchema);
