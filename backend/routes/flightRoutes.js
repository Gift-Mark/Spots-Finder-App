import express from "express";
import { listAirports, listPublishedRoutes, getAirportFlightStatus } from "../controllers/flightController.js";

const router = express.Router();
router.get("/airports", listAirports);
router.get("/routes/published", listPublishedRoutes);
router.get("/airports/:airportCode/flights", getAirportFlightStatus);

export default router;