import express from "express";
import {
  createStayBooking,
  getBookingByReference
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Enforce authentication on all booking operations
router.use(protect);

/* router.post("/", createBooking);
router.get("/my-bookings", getMyBookings);
router.get("/:identifier", getBookingByIdentifier);
router.put("/:id", updateBookingStatus); */

router.post('/', createStayBooking);
router.get('/:reference', getBookingByReference);
export default router;