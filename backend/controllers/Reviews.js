import Review from "../models/Reviews.js";

/**
 * @desc    Submit a review or guest tip with photo(s)
 * @route   POST /api/reviews
 * @access  Public (Guest & Authenticated Users)
 */
export const createReview = async (req, res) => {
  try {
    const { placeId, rating, comment, guestName, guestHandle, photos } = req.body;

    // Check if request has an authenticated user attached via middleware (if provided)
    const userId = req.user ? req.user._id : null;
    const isGuest = !userId;

    const reviewData = {
      userId,
      placeId: placeId || null,
      rating: rating || 5,
      comment,
      photos: photos || [],
      isGuest,
      guestName: isGuest ? (guestName || "Anonymous Guest") : undefined,
      guestHandle: isGuest ? guestHandle : undefined,
    };

    const review = await Review.create(reviewData);

    // Populate user details if it wasn't a guest submission
    if (review.userId) {
      await review.populate("userId", "firstName lastName profileImage");
    }

    res.status(201).json({
      success: true,
      message: isGuest ? "Tip & photo shared successfully!" : "Review posted successfully!",
      data: review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all guest tips & reviews (e.g., for Culture Page Feed or Place Feed)
 * @route   GET /api/reviews
 * @access  Public
 */
export const getAllReviews = async (req, res) => {
  try {
    const { placeId } = req.query;
    const filter = placeId ? { placeId } : {};

    const reviews = await Review.find(filter)
      .populate("userId", "firstName lastName profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete a review or guest tip (Admin moderation)
 * @route   DELETE /api/reviews/:id
 * @access  Private (Admin)
 */
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Tip or review not found." });
    }

    // Only allow account owner or admin to delete
    if (
      req.user.role !== "admin" &&
      (!review.userId || review.userId.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this post.",
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: "Post removed successfully.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};