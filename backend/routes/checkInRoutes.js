import express from "express";
import {
  createCheckIn,
  getMyCheckIns,
  getPlaceCheckIns,
} from "../controllers/checkInController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createCheckIn);
router.get("/my-checkins", protect, getMyCheckIns);
router.get("/place/:placeId", getPlaceCheckIns);

export default router;