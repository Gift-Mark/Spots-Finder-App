import express from "express";
import { listAirports, listPublishedRoutes, getAirportFlightStatus, bookFlight} from "../controllers/flightController.js";

const router = express.Router();
router.get("/airports", listAirports);
router.get("/routes/published", listPublishedRoutes);
router.get("/airports/:airportCode/flights", getAirportFlightStatus);
// Add this POST route for booking confirmation
router.post('/book', bookFlight);

export default router;