import express from "express";
import { listAmenities } from "../controllers/amenityController.js";

const router = express.Router();
router.get("/", listAmenities);

export default router;