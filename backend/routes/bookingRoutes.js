import express from "express";
import {
  createBooking,
  getMyBookings,
  getBookingByIdentifier,
  updateBookingStatus,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Enforce authentication on all booking operations
router.use(protect);

router.post("/", createBooking);
router.get("/my-bookings", getMyBookings);
router.get("/:identifier", getBookingByIdentifier);
router.put("/:id", updateBookingStatus);

export default router;