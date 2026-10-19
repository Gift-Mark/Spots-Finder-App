import express from "express";
import { submitEnquiry } from "../controllers/conciergeController.js";

const router = express.Router();
router.post("/enquiries", submitEnquiry);

export default router;