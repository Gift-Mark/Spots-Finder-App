import Save from "../models/Save.js";
import Place from "../models/Place.js";
import Accommodation from "../models/Accommodation.js";
import mongoose from "mongoose";

const normalizePlaceId = (placeId) =>
  /^[a-f\d]{24}$/i.test(String(placeId))
    ? new mongoose.Types.ObjectId(String(placeId))
    : String(placeId);

const createPlaceSnapshot = (placeSnapshot, placeId) => {
  if (!placeSnapshot || typeof placeSnapshot !== "object") return null;

  const snapshot = {
    id: String(placeSnapshot.id || placeId),
    slug: String(placeSnapshot.slug || placeId),
  };
  for (const field of ["_id", "title", "name", "category", "location", "address", "heroImage", "coverImage"]) {
    if (typeof placeSnapshot[field] === "string") {
      snapshot[field] = placeSnapshot[field].slice(0, 1000);
    }
  }
  if (Array.isArray(placeSnapshot.images)) {
    snapshot.images = placeSnapshot.images
      .filter((image) => typeof image === "string")
      .slice(0, 10)
      .map((image) => image.slice(0, 1000));
  }
  return snapshot;
};

/**
 * @desc    Toggle bookmarking a place (Save if not saved, Remove if already saved)
 * @route   POST /api/saves/toggle
 * @access  Private
 */
export const toggleSaveSpot = async (req, res) => {
  try {
    const { placeId, placeSnapshot } = req.body;
    const userId = req.user._id;

    if (!placeId) {
      return res.status(400).json({ success: false, message: "Place ID is required." });
    }

    // Check if place is already saved by this user
    const normalizedPlaceId = normalizePlaceId(placeId);
    const existingSave = await Save.findOne({
      userId,
      placeId: normalizedPlaceId,
    });

    if (existingSave) {
      // Unsave / Remove bookmark
      await existingSave.deleteOne();
      return res.status(200).json({
        success: true,
        isSaved: false,
        message: "Spot removed from saved collection.",
      });
    }

    // Save / Bookmark spot
    const newSave = await Save.create({
      userId,
      placeId: normalizedPlaceId,
      placeSnapshot: createPlaceSnapshot(placeSnapshot, placeId),
    });

    res.status(201).json({
      success: true,
      isSaved: true,
      message: "Spot saved successfully!",
      data: newSave,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all saved places for the logged-in user (Populates 'Saved Spots' tab)
 * @route   GET /api/saves/my-saves
 * @access  Private
 */
export const getMySavedSpots = async (req, res) => {
  try {
    const savedSpots = await Save.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    // `Save.placeId` can reference either a Place or an Accommodation. Resolve
    // both, otherwise saved stays populate to null and break the dashboard.
    const ids = savedSpots
      .map((item) => item.placeId)
      .filter((id) => mongoose.isValidObjectId(id));
    const [places, accommodations] = await Promise.all([
      Place.find({ _id: { $in: ids } }).lean(),
      Accommodation.find({ _id: { $in: ids } }).lean(),
    ]);

    const byId = new Map();
    places.forEach((place) => byId.set(String(place._id), place));
    accommodations.forEach((stay) =>
      byId.set(String(stay._id), { ...stay, category: "Stay" })
    );

    const data = savedSpots
      .map((item) => {
        const savedPlace = byId.get(String(item.placeId));
        if (savedPlace) return savedPlace;
        if (!item.placeSnapshot) return null;
        return {
          ...item.placeSnapshot,
          id: item.placeSnapshot.id || String(item.placeId),
          slug: item.placeSnapshot.slug || String(item.placeId),
        };
      })
      .filter(Boolean);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Check if a specific place is saved by the current user
 * @route   GET /api/saves/check/:placeId
 * @access  Private
 */
export const checkIsSaved = async (req, res) => {
  try {
    const { placeId } = req.params;
    const userId = req.user._id;

    const savedRecord = await Save.findOne({
      userId,
      placeId: normalizePlaceId(placeId),
    });

    res.status(200).json({
      success: true,
      isSaved: Boolean(savedRecord),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};