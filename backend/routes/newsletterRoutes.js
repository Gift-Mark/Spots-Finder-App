import express from "express";
import {
  subscribeNewsletter,
  unsubscribeNewsletter,
  getActiveSubscribers,
} from "../controllers/newsletterController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Enforce authentication on subscription endpoints
router.post("/subscribe", protect, subscribeNewsletter);
router.post("/unsubscribe", protect, unsubscribeNewsletter);
router.get("/subscribers", protect, authorizeRoles("admin"), getActiveSubscribers);

export default router;