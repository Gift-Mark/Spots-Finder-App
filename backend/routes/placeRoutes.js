import express from "express";
import mongoose from 'mongoose';
import {
  getAllPlaces,
  getPlaceByIdentifier,
  createPlace,
  updatePlace,
  deletePlace,
} from "../controllers/place.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllPlaces);
router.get("/:identifier", getPlaceByIdentifier);

// Protected routes for vendors & admins
router.post("/", protect, authorizeRoles("vendor", "admin"), createPlace);
router.put("/:id", protect, authorizeRoles("vendor", "admin"), updatePlace);
router.delete("/:id", protect, authorizeRoles("vendor", "admin"), deletePlace);

// 1. Mongoose Schema for Flagged Reports
const reportSchema = new mongoose.Schema({
  venueName: String,
  contentType: { type: String, default: 'Review' },
  contentSnippet: String,
  reason: String,
  status: { type: String, enum: ['pending', 'resolved', 'ignored'], default: 'pending' },
}, { timestamps: true });

const FlaggedReport = mongoose.model('FlaggedReport', reportSchema);

// 2. GET: Fetch pending flagged items
router.get('/flagged-content', async (req, res) => {
  try {
    const reports = await FlaggedReport.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. DELETE: Remove flagged content
router.delete('/flagged-content/:id', async (req, res) => {
  try {
    await FlaggedReport.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Content deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. PATCH: Ignore/Dismiss report
router.patch('/flagged-content/:id/ignore', async (req, res) => {
  try {
    await FlaggedReport.findByIdAndUpdate(req.params.id, { status: 'ignored' });
    res.json({ success: true, message: 'Report ignored' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
