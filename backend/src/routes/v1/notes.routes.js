import { Router } from "express";
import {
  deleteNoteController,
  getNoteByIdController,
  getNotesController,
  uploadNoteController,
} from "../../controllers/note.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { uploadNoteFile } from "../../middlewares/upload.middleware.js";

const router = Router();

router.use(protect);

router.post("/upload", uploadNoteFile, uploadNoteController);
router.get("/", getNotesController);
router.get("/:id", getNoteByIdController);
router.delete("/:id", deleteNoteController);

export default router;

