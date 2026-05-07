import fs from "fs/promises";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";
import { ApiError } from "./apiError.js";

export const extractTextFromFile = async ({ filePath, mimeType }) => {
  if (mimeType === "text/plain") {
    return fs.readFile(filePath, "utf-8");
  }

  const fileBuffer = await fs.readFile(filePath);

  if (mimeType === "application/pdf") {
    const pdfData = await pdfParse(fileBuffer);
    return pdfData.text || "";
  }

  if (
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const docxData = await mammoth.extractRawText({
      buffer: fileBuffer,
    });

    return docxData.value || "";
  }

  throw new ApiError(400, "Unsupported file type for text extraction.");
};

