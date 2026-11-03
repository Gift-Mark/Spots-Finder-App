import express from "express";
import {
  getAllEvents,
  getEventByIdentifier,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {autoDiscoverAndScrapeEvents} from "../jobs/eventCronJob.js";

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:identifier", getEventByIdentifier);

// Protected routes for vendors & admins
router.post("/", protect, authorizeRoles("vendor", "admin"), upload.single("image"), createEvent);
router.put("/:id", protect, authorizeRoles("vendor", "admin"), updateEvent);
router.delete("/:id", protect, authorizeRoles("vendor", "admin"), deleteEvent);

router.get("/trigger-scrape", async (req, res) => {
  try {
    await autoDiscoverAndScrapeEvents();
    res.status(200).json({ success: true, message: "Scraper triggered successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;