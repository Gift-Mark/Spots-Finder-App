import express from "express";
import { 
  getAllUsers, 
  deleteUser, 
  updateUserRole,
  getFlaggedContent,
  getAds,
  createAd,
  deleteAd,
  getSystemLogs,
  clearSystemLogs
} from "../controllers/adminController.js";
import { getAdminEvents } from "../controllers/eventController.js";
import {getPlaces} from "../controllers/placeController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes here require authentication AND admin privileges
router.use(protect, adminOnly);

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/role", updateUserRole);
router.get("/flagged-content", getFlaggedContent);
router.get("/events", getAdminEvents);

// Venue Management routes (Mapped directly to your Places database)
router.get("/venues", getPlaces);

// Ads Management routes
router.get("/ads", getAds);
router.post("/ads", createAd);
router.delete("/ads/:id", deleteAd);

// System Logs routes
router.get("/logs", getSystemLogs);
router.delete("/logs", clearSystemLogs);

export default router;