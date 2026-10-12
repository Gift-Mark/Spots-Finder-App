import express from "express";
import {
  createReview,
  getAllReviews,
  deleteReview,
} from "../controllers/Reviews.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Middleware to extract user if token exists, but don't block guests
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    return protect(req, res, next);
  }
  next();
};

router.post("/", optionalAuth, createReview);
router.get("/", getAllReviews);
router.delete("/:id", protect, authorizeRoles("admin"), deleteReview);

export default router;