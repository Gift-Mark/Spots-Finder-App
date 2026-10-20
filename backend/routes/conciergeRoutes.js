import express from "express";
import { submitEnquiry, getConciergeEnquiries, updateConciergeStatus } from "../controllers/conciergeController.js";

const router = express.Router();

// Use "/" instead of "/enquiries" so it matches /api/v1/concierge directly
router.post("/", submitEnquiry);
router.get("/", getConciergeEnquiries);
router.patch("/:reference", updateConciergeStatus);

export default router;