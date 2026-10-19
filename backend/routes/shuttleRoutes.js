import express from "express";
import { createShuttleBooking, getShuttleBookingByRef } from "../controllers/shuttleController.js";

const router = express.Router();
router.post("/bookings", createShuttleBooking);
router.get("/bookings/:reference", getShuttleBookingByRef);

export default router;