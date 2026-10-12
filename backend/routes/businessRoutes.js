import express from "express";
import {
  getAllBusinesses,
  getBusinessById,
  createBusiness,
  updateBusiness,
  submitVerification,
  reviewVerification,
} from "../controllers/businessController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllBusinesses);
router.get("/:id", getBusinessById);

// Vendor & Admin routes
router.post("/", protect, authorizeRoles("vendor", "admin"), createBusiness);
router.put("/:id", protect, authorizeRoles("vendor", "admin"), updateBusiness);
router.post("/:id/verify", protect, authorizeRoles("vendor", "admin"), submitVerification);

// Admin-only route
router.patch(
  "/:id/review-verification",
  protect,
  authorizeRoles("admin"),
  reviewVerification
);

export default router;