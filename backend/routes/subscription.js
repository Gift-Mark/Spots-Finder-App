import express from "express";
import {
  initializeSubscription,
  verifySubscription,
  getBusinessSubscription,
  getAllSubscriptions,
} from "../controllers/subscriptionController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/initialize", protect, initializeSubscription);
router.post("/verify", protect, verifySubscription);
router.get("/business/:businessId", protect, getBusinessSubscription);
router.get("/", protect, authorizeRoles("admin"), getAllSubscriptions);

export default router;