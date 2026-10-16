import express from "express";
import { searchFlights } from "../controllers/flightControllers.js";

const router = express.Router();

router.get("/search", searchFlights);

export default router;