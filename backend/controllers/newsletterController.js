import Newsletter from "../models/Newsletter.js";

/**
 * @desc    Subscribe an authenticated user to the newsletter
 * @route   POST /api/newsletter/subscribe
 * @access  Private (Registered Users Only)
 */
export const subscribeNewsletter = async (req, res) => {
  try {
    // Rely strictly on authenticated user's profile
    const userId = req.user._id;
    const userEmail = req.user.email.toLowerCase().trim();

    // Check if user already has a newsletter subscription entry
    let subscriber = await Newsletter.findOne({
      $or: [{ userId }, { email: userEmail }],
    });

    if (subscriber) {
      // Reactivate if previously unsubscribed
      if (subscriber.subscriptionStatus === "unsubscribed") {
        subscriber.subscriptionStatus = "subscribed";
        subscriber.subscribedAt = new Date();
        subscriber.unsubscribedAt = null;
        subscriber.userId = userId;

        await subscriber.save();

        return res.status(200).json({
          success: true,
          message: "Welcome back! Your newsletter subscription has been reactivated.",
          data: subscriber,
        });
      }

      return res.status(400).json({
        success: false,
        message: "You are already subscribed to the Jos Pulse newsletter.",
      });
    }

    // Create new subscriber linked strictly to the user account
    subscriber = await Newsletter.create({
      userId,
      email: userEmail,
      subscriptionStatus: "subscribed",
      subscribedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Successfully subscribed to Jos Pulse updates!",
      data: subscriber,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Your email is already subscribed.",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Unsubscribe logged-in user from newsletter
 * @route   POST /api/newsletter/unsubscribe
 * @access  Private
 */
export const unsubscribeNewsletter = async (req, res) => {
  try {
    const userId = req.user._id;

    const subscriber = await Newsletter.findOne({ userId });

    if (!subscriber || subscriber.subscriptionStatus === "unsubscribed") {
      return res.status(404).json({
        success: false,
        message: "No active newsletter subscription found for your account.",
      });
    }

    subscriber.subscriptionStatus = "unsubscribed";
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    res.status(200).json({
      success: true,
      message: "You have been successfully unsubscribed from newsletter updates.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all active registered subscribers (Admin Email Broadcasts)
 * @route   GET /api/newsletter/subscribers
 * @access  Private (Admin Only)
 */
export const getActiveSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find({ subscriptionStatus: "subscribed" })
      .populate("userId", "firstName lastName email role")
      .sort({ subscribedAt: -1 });

    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};