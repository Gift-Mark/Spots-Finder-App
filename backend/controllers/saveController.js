import Save from "../models/Save.js";

/**
 * @desc    Toggle bookmarking a place (Save if not saved, Remove if already saved)
 * @route   POST /api/saves/toggle
 * @access  Private
 */
export const toggleSaveSpot = async (req, res) => {
  try {
    const { placeId } = req.body;
    const userId = req.user._id;

    if (!placeId) {
      return res.status(400).json({ success: false, message: "Place ID is required." });
    }

    // Check if place is already saved by this user
    const existingSave = await Save.findOne({ userId, placeId });

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
    const newSave = await Save.create({ userId, placeId });

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
    const savedSpots = await Save.find({ userId: req.user._id })
      .populate("placeId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: savedSpots.length,
      data: savedSpots.map((item) => item.placeId),
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

    const savedRecord = await Save.findOne({ userId, placeId });

    res.status(200).json({
      success: true,
      isSaved: Boolean(savedRecord),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};