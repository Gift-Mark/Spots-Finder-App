import express from "express";
import {
  logLocationActivity,
  getLatestLocation,
  getLocationHistory,
} from "../controllers/locationControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/log", protect, logLocationActivity);
router.get("/latest", protect, getLatestLocation);
router.get("/history", protect, getLocationHistory);

export default router;
