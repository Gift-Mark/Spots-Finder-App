import Interaction from "../models/interactions.js";

/**
 * @desc    Log a user interaction event (e.g., click, view, search, call_button_clicked)
 * @route   POST /api/interactions/log
 * @access  Private
 */
export const logInteraction = async (req, res) => {
  try {
    const { placeId, interactionType, searchQuery, category, metadata } = req.body;
    const userId = req.user._id;

    if (!interactionType) {
      return res.status(400).json({
        success: false,
        message: "interactionType is required.",
      });
    }

    const interaction = await Interaction.create({
      userId,
      placeId: placeId || null,
      interactionType: interactionType.toLowerCase().trim(),
      searchQuery: searchQuery || "",
      category: category || "",
      metadata: metadata || {},
      timestamp: new Date(),
    });

    res.status(201).json({
      success: true,
      data: interaction,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get recent interaction logs for the current logged-in user
 * @route   GET /api/interactions/my-history
 * @access  Private
 */
export const getMyInteractions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 30;

    // Leverages compound index { userId: 1, timestamp: -1 }
    const history = await Interaction.find({ userId: req.user._id })
      .populate("placeId", "name category coverImage slug")
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

/**
 * @desc    Get aggregated analytics for a specific venue (Vendor Dashboard)
 * @route   GET /api/interactions/place/:placeId
 * @access  Private (Vendor / Admin)
 */
export const getPlaceAnalytics = async (req, res) => {
  try {
    const { placeId } = req.params;

    // Summarize interactions by type for this place
    const analytics = await Interaction.aggregate([
      { $match: { placeId: new mongoose.Types.ObjectId(placeId) } },
      {
        $group: {
          _id: "$interactionType",
          totalEvents: { $sum: 1 },
          lastOccurred: { $max: "$timestamp" },
        },
      },
      { $sort: { totalEvents: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get system-wide analytics (Admin Dashboard)
 * @route   GET /api/interactions/admin-stats
 * @access  Private (Admin)
 */
export const getAdminInteractionStats = async (req, res) => {
  try {
    // Top searched queries
    const topSearches = await Interaction.aggregate([
      { $match: { interactionType: "search", searchQuery: { $ne: "" } } },
      { $group: { _id: "$searchQuery", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Top interaction types across the platform
    const typeDistribution = await Interaction.aggregate([
      { $group: { _id: "$interactionType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      topSearches,
      typeDistribution,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};