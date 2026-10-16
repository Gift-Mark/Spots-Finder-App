import express from "express";
import {
  getAllEvents,
  getEventByIdentifier,
  createEvent,
  updateEvent,
  deleteEvent,
  getAdminEvents,
  updateEventStatus,
  deleteAdminEvent
} from "../controllers/eventController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:identifier", getEventByIdentifier);

// Protected routes for vendors & admins
router.post("/", protect, authorizeRoles("vendor", "admin"), createEvent);
router.put("/:id", protect, authorizeRoles("vendor", "admin"), updateEvent);
router.delete("/:id", protect, authorizeRoles("vendor", "admin"), deleteEvent);

export default router;