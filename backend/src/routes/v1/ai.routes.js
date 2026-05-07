import { Router } from "express";
import {
  generateFlashcardsController,
  generateQuizController,
  getAiActivityController,
  summarizeNoteController,
} from "../../controllers/ai.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { aiRateLimitMiddleware } from "../../middlewares/aiRateLimit.middleware.js";

const router = Router();

router.use(protect);

router.get("/activity", getAiActivityController);
router.post("/summarize", aiRateLimitMiddleware, summarizeNoteController);
router.post("/quiz", aiRateLimitMiddleware, generateQuizController);
router.post("/flashcards", aiRateLimitMiddleware, generateFlashcardsController);

export default router;

