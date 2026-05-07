import { Router } from "express";
import aiRoutes from "./ai.routes.js";
import authRoutes from "./auth.routes.js";
import notesRoutes from "./notes.routes.js";
import { sendResponse } from "../../utils/apiResponse.js";

const router = Router();

router.get("/", (_request, response) => {
  sendResponse(response, {
    statusCode: 200,
    message: "StudyVault AI API v1",
  });
});

router.use("/auth", authRoutes);
router.use("/notes", notesRoutes);
router.use("/ai", aiRoutes);

export default router;
