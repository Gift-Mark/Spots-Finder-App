import express from "express";
import {
  sendMessage,
  getChatHistory,
  clearChatHistory,
} from "../controllers/chatbotController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Middleware to optionally capture logged-in userId if token is supplied
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    return protect(req, res, next);
  }
  next();
};

router.post("/message", optionalAuth, sendMessage);
router.get("/history/:sessionId", getChatHistory);
router.delete("/history/:sessionId", clearChatHistory);

export default router;