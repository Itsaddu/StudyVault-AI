import { Router } from "express";
import {
  loginController,
  profileController,
  registerController,
} from "../../controllers/auth.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { authRateLimitMiddleware } from "../../middlewares/rateLimit.middleware.js";

const router = Router();

router.post("/register", authRateLimitMiddleware, registerController);
router.post("/login", authRateLimitMiddleware, loginController);
router.get("/profile", protect, profileController);
router.get("/me", protect, profileController);

export default router;
