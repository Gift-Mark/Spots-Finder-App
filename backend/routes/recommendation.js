import express from "express";
import {
  getMyRecommendations,
  createRecommendation,
  batchCreateRecommendations,
  dismissRecommendation,
} from "../controllers/recommendationController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my-recommendations", protect, getMyRecommendations);
router.post("/", protect, authorizeRoles("admin"), createRecommendation);
router.post("/batch", protect, authorizeRoles("admin"), batchCreateRecommendations);
router.delete("/:id", protect, dismissRecommendation);

export default router;