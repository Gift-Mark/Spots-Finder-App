import express from "express";
import {
  getActiveCampaigns,
  getMyCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from "../controllers/campaignController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route to fetch active promoted banners
router.get("/active", getActiveCampaigns);

// Protected routes for vendors and admins
router.get("/my-campaigns", protect, authorizeRoles("vendor", "admin"), getMyCampaigns);
router.post("/", protect, authorizeRoles("vendor", "admin"), createCampaign);
router.put("/:id", protect, authorizeRoles("vendor", "admin"), updateCampaign);
router.delete("/:id", protect, authorizeRoles("vendor", "admin"), deleteCampaign);

export default router;