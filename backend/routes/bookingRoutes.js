import express from "express";
import {
  createStayBooking,
  getBookingByReference,
  getMyBookings,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Enforce authentication on all booking operations
router.use(protect);

router.post("/", createStayBooking);
router.get("/my-bookings", getMyBookings);
router.get("/:reference", getBookingByReference);
export default router;