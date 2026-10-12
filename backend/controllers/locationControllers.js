import LocationActivity from "../models/location.js";

/**
 * @desc    Log real-time user location ping or permission status
 * @route   POST /api/location/log
 * @access  Private
 */
export const logLocationActivity = async (req, res) => {
  try {
    const { latitude, longitude, city, permissionGranted } = req.body;
    const userId = req.user._id;

    if (permissionGranted === undefined) {
      return res.status(400).json({
        success: false,
        message: "permissionGranted boolean flag is required.",
      });
    }

    const activity = await LocationActivity.create({
      userId,
      latitude: latitude || 0,
      longitude: longitude || 0,
      city: city || "Jos",
      permissionGranted,
      timestamp: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Location activity recorded.",
      data: activity,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get user's latest recorded location ping
 * @route   GET /api/location/latest
 * @access  Private
 */
export const getLatestLocation = async (req, res) => {
  try {
    // Uses compound index { userId: 1, timestamp: -1 } for fast lookup
    const latestPing = await LocationActivity.findOne({ userId: req.user._id })
      .sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      data: latestPing || null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get user's location ping history
 * @route   GET /api/location/history
 * @access  Private
 */
export const getLocationHistory = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;

    const history = await LocationActivity.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};