import express from "express";
import {
  toggleSaveSpot,
  getMySavedSpots,
  checkIsSaved,
} from "../controllers/saveController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/toggle", protect, toggleSaveSpot);
router.get("/my-saves", protect, getMySavedSpots);
router.get("/check/:placeId", protect, checkIsSaved);

export default router;