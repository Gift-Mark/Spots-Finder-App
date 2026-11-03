import express from "express";
import {
  getAllPlaces,
  getPlaceByIdentifier,
  createPlace,
  updatePlace,
  deletePlace,
} from "../controllers/place.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

import upload from '../middleware/uploadMiddleware.js'

const router = express.Router();

router.get("/", getAllPlaces);
router.get("/:identifier", getPlaceByIdentifier);

// Protected routes for vendors & admins
router.post("/", protect, authorizeRoles("vendor", "admin"), upload.single("heroImage"), createPlace);
router.put("/:id", protect, authorizeRoles("vendor", "admin"), upload.single("heroImage"), updatePlace);
router.delete("/:id", protect, authorizeRoles("vendor", "admin"), deletePlace);

// Use upload.single('heroImage') to catch the uploaded file
router.post('/places', upload.single('heroImage'), createPlace);

export default router;
