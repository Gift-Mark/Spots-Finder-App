import CheckIn from "../models/Checkins.js";
import Place from "../models/Place.js";

/**
 * @desc    Record a live user check-in at a venue
 * @route   POST /api/checkins
 * @access  Private
 */
export const createCheckIn = async (req, res) => {
  try {
    const { placeId, latitude, longitude } = req.body;
    const userId = req.user._id;

    if (!placeId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "placeId, latitude, and longitude are required.",
      });
    }

    // Verify place exists
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ success: false, message: "Place not found." });
    }

    // Optional: Prevent duplicate spam check-ins within a short timeframe (e.g., last 30 mins)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const recentCheckIn = await CheckIn.findOne({
      userId,
      placeId,
      checkInTime: { $gte: thirtyMinutesAgo },
    });

    if (recentCheckIn) {
      return res.status(400).json({
        success: false,
        message: "You have already checked in here recently!",
      });
    }

    const checkIn = await CheckIn.create({
      userId,
      placeId,
      latitude,
      longitude,
      checkInTime: new Date(),
    });

    res.status(201).json({
      success: true,
      message: `Checked in to ${place.name}!`,
      data: checkIn,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get logged-in user's check-in history
 * @route   GET /api/checkins/my-checkins
 * @access  Private
 */
export const getMyCheckIns = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;

    const checkIns = await CheckIn.find({ userId: req.user._id })
      .populate("placeId", "name category location address images slug")
      .sort({ checkInTime: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: checkIns.length,
      data: checkIns,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get check-in count and recent visitors for a specific place (Vendor / Admin analytics)
 * @route   GET /api/checkins/place/:placeId
 * @access  Public
 */
export const getPlaceCheckIns = async (req, res) => {
  try {
    const { placeId } = req.params;

    const totalCheckIns = await CheckIn.countDocuments({ placeId });

    // Fetch recent 5 visitors (populating user names/photos)
    const recentVisitors = await CheckIn.find({ placeId })
      .populate("userId", "firstName lastName profileImage")
      .sort({ checkInTime: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      totalCheckIns,
      recentVisitors,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};