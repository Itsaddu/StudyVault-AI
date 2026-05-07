import fs from "fs/promises";
import { Note } from "../models/note.model.js";
import { ApiError } from "../utils/apiError.js";
import { sendResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { extractTextFromFile } from "../utils/fileExtraction.js";
import { validateUploadPayload } from "../validators/note.validator.js";

const calculateStats = (notes) => {
  const totalNotes = notes.length;
  const totalStorageBytes = notes.reduce((sum, note) => sum + note.fileSize, 0);
  const uploadsThisWeek = notes.filter((note) => {
    const uploadTime = new Date(note.uploadDate).getTime();
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return uploadTime >= oneWeekAgo;
  }).length;

  const uniqueFileTypes = new Set(notes.map((note) => note.mimeType)).size;

  return {
    totalNotes,
    totalStorageBytes,
    uploadsThisWeek,
    uniqueFileTypes,
  };
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const safelyDeleteFile = async (filePath) => {
  if (!filePath) {
    return;
  }

  try {
    await fs.unlink(filePath);
  } catch (_error) {
    // Ignore cleanup failures to avoid masking the original error path.
  }
};

export const uploadNoteController = asyncHandler(async (request, response) => {
  try {
    const { title } = validateUploadPayload(request.body, request.file);

    const extractedText = await extractTextFromFile({
      filePath: request.file.path,
      mimeType: request.file.mimetype,
    });

    const note = await Note.create({
      title,
      originalFileName: request.file.originalname,
      uploadedBy: request.user.id,
      extractedText,
      uploadDate: new Date(),
      filePath: request.file.path,
      fileSize: request.file.size,
      mimeType: request.file.mimetype,
    });

    return sendResponse(response, {
      statusCode: 201,
      message: "Note uploaded successfully.",
      data: {
        note: note.toDetailObject(),
      },
    });
  } catch (error) {
    await safelyDeleteFile(request.file?.path);
    throw error;
  }
});

export const getNotesController = asyncHandler(async (request, response) => {
  const search = typeof request.query.search === "string" ? request.query.search.trim() : "";
  const query = {
    uploadedBy: request.user.id,
  };

  if (search) {
    const searchPattern = new RegExp(escapeRegExp(search), "i");

    query.$or = [
      { title: searchPattern },
      { originalFileName: searchPattern },
      { extractedText: searchPattern },
    ];
  }

  const notes = await Note.find(query).sort({ uploadDate: -1 });

  return sendResponse(response, {
    statusCode: 200,
    message: "Notes fetched successfully.",
    data: {
      notes: notes.map((note) => note.toSummaryObject()),
      stats: calculateStats(notes),
    },
  });
});

export const getNoteByIdController = asyncHandler(async (request, response) => {
  const note = await Note.findOne({
    _id: request.params.id,
    uploadedBy: request.user.id,
  });

  if (!note) {
    throw new ApiError(404, "Note not found.");
  }

  return sendResponse(response, {
    statusCode: 200,
    message: "Note fetched successfully.",
    data: {
      note: note.toDetailObject(),
    },
  });
});

export const deleteNoteController = asyncHandler(async (request, response) => {
  const note = await Note.findOne({
    _id: request.params.id,
    uploadedBy: request.user.id,
  });

  if (!note) {
    throw new ApiError(404, "Note not found.");
  }

  await Note.deleteOne({ _id: note._id });
  await safelyDeleteFile(note.filePath);

  return sendResponse(response, {
    statusCode: 200,
    message: "Note deleted successfully.",
    data: {
      note: note.toSummaryObject(),
    },
  });
});
