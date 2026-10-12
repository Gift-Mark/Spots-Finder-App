import express from "express";
import {
  getAllPlaces,
  getPlaceByIdentifier,
  createPlace,
  updatePlace,
  deletePlace,
} from "../controllers/place..js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllPlaces);
router.get("/:identifier", getPlaceByIdentifier);

// Protected routes for vendors & admins
router.post("/", protect, authorizeRoles("vendor", "admin"), createPlace);
router.put("/:id", protect, authorizeRoles("vendor", "admin"), updatePlace);
router.delete("/:id", protect, authorizeRoles("vendor", "admin"), deletePlace);

export default router;
