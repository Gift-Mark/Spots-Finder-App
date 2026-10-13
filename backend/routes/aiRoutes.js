import express from "express";
import { getAIRecommendation, getAISupportResponse } from "../controllers/aiController.js";

const router = express.Router();

// Website AI support & recommendations — public for guests and members.
router.post("/support", getAISupportResponse);
router.post("/recommend", getAIRecommendation);

export default router;
