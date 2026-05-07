import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../../../");
const uploadRoot = path.resolve(projectRoot, env.uploadDir);

const supportedMimeTypes = new Set([
  "application/pdf",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const supportedExtensions = new Set([".pdf", ".txt", ".docx"]);

const ensureDirectory = (directoryPath) => {
  fs.mkdirSync(directoryPath, { recursive: true });
};

const storage = multer.diskStorage({
  destination: (request, _file, callback) => {
    const userDirectory = path.join(uploadRoot, request.user.id);
    ensureDirectory(userDirectory);
    callback(null, userDirectory);
  },
  filename: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    callback(null, safeName);
  },
});

const fileFilter = (_request, file, callback) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const sanitizedOriginalName = path.basename(file.originalname);

  if (!sanitizedOriginalName || sanitizedOriginalName.length > 180) {
    callback(new ApiError(400, "File name is missing or too long."));
    return;
  }

  if (!supportedExtensions.has(extension) || !supportedMimeTypes.has(file.mimetype)) {
    callback(new ApiError(400, "Only PDF, TXT, and DOCX files are allowed."));
    return;
  }

  callback(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: env.maxUploadSizeBytes,
  },
  fileFilter,
});

export const uploadNoteFile = (request, response, next) => {
  upload.single("file")(request, response, (error) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      next(new ApiError(400, `File size must be ${env.maxUploadSizeMb}MB or less.`));
      return;
    }

    next(error);
  });
};
