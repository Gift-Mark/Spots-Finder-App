import express from "express";
import {
  logInteraction,
  getMyInteractions,
  getPlaceAnalytics,
  getAdminInteractionStats,
} from "../controllers/interaction.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/log", protect, logInteraction);
router.get("/my-history", protect, getMyInteractions);

// Business analytics for Vendors & Admins
router.get(
  "/place/:placeId",
  protect,
  authorizeRoles("vendor", "admin"),
  getPlaceAnalytics
);

// Global platform telemetry for Super Admins
router.get(
  "/admin-stats",
  protect,
  authorizeRoles("admin"),
  getAdminInteractionStats
);

export default router;
