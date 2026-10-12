import Recommendation from "../models/Recommendation.js";

/**
 * @desc    Get top personalized recommendations for the logged-in user
 * @route   GET /api/recommendations/my-recommendations
 * @access  Private
 */
export const getMyRecommendations = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;

    // Fetch user's top recommended places, sorted by highest score using compound index
    const recommendations = await Recommendation.find({ userId: req.user._id })
      .sort({ score: -1 })
      .limit(limit)
      .populate("placeId", "name category address rating coverImage latitude longitude");

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Generate or insert new recommendations (e.g., from ML backend, cron job, or behavior trigger)
 * @route   POST /api/recommendations
 * @access  Private (Admin / System Internal)
 */
export const createRecommendation = async (req, res) => {
  try {
    const { userId, placeId, reason, score, algorithmVersion } = req.body;

    // Create or update existing recommendation entry for the same user and place
    const recommendation = await Recommendation.findOneAndUpdate(
      { userId, placeId },
      {
        reason,
        score,
        algorithmVersion: algorithmVersion || "v1.0.0",
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json({
      success: true,
      message: "Recommendation saved successfully.",
      data: recommendation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Batch insert generated recommendations for a user
 * @route   POST /api/recommendations/batch
 * @access  Private (Admin / System Internal)
 */
export const batchCreateRecommendations = async (req, res) => {
  try {
    const { recommendations } = req.body; // Expects an array of recommendation objects

    if (!Array.isArray(recommendations) || recommendations.length === 0) {
      return res.status(400).json({ success: false, message: "Please provide an array of recommendations." });
    }

    const inserted = await Recommendation.insertMany(recommendations, { ordered: false });

    res.status(201).json({
      success: true,
      count: inserted.length,
      data: inserted,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete/Dismiss a recommendation (e.g., user clicks "Not interested")
 * @route   DELETE /api/recommendations/:id
 * @access  Private
 */
export const dismissRecommendation = async (req, res) => {
  try {
    const recommendation = await Recommendation.findById(req.params.id);

    if (!recommendation) {
      return res.status(404).json({ success: false, message: "Recommendation not found." });
    }

    if (recommendation.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to remove this recommendation." });
    }

    await recommendation.deleteOne();

    res.status(200).json({
      success: true,
      message: "Recommendation dismissed successfully.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};