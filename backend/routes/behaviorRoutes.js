import express from "express";
import {
  logEvent,
  getAnalytics,
  getSessionHistory,
} from "../controllers/behaviourController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public log ingestion (captured for both guests & logged-in users via sessionId)
router.post("/log", logEvent);
router.get("/session/:sessionId", getSessionHistory);

// Protected admin analytics
router.get("/analytics", protect, authorizeRoles("admin"), getAnalytics);

export default router;