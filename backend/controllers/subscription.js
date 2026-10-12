import Subscription from "../models/Subscriber.js";

/**
 * @desc    Initiate a business subscription / promotion purchase
 * @route   POST /api/subscriptions/initialize
 * @access  Private (Business / Admin)
 */
export const initializeSubscription = async (req, res) => {
  try {
    const { businessId, plan, amount, billingCycle, transactionReference, durationDays } = req.body;

    // Calculate billing active timeframe
    const days = durationDays || (billingCycle === "yearly" ? 365 : 30);
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);

    const subscription = await Subscription.create({
      businessId: businessId || req.user.businessId,
      plan,
      amount,
      billingCycle: billingCycle || "monthly",
      startDate,
      endDate,
      paymentStatus: "unpaid",
      transactionReference,
    });

    res.status(201).json({
      success: true,
      message: "Subscription initialized successfully",
      data: subscription,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate transaction reference provided.",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Verify and activate subscription after payment gateway callback (e.g. Paystack / Stripe)
 * @route   POST /api/subscriptions/verify
 * @access  Private
 */
export const verifySubscription = async (req, res) => {
  try {
    const { transactionReference, status } = req.body;

    const subscription = await Subscription.findOne({ transactionReference });
    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription record not found." });
    }

    // Update payment status (e.g. 'paid', 'failed')
    subscription.paymentStatus = status || "paid";
    await subscription.save();

    res.status(200).json({
      success: true,
      message: `Subscription status updated to ${subscription.paymentStatus}`,
      data: subscription,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get subscription status for a specific business (used in Vendor Dashboard)
 * @route   GET /api/subscriptions/business/:businessId
 * @access  Private
 */
export const getBusinessSubscription = async (req, res) => {
  try {
    const { businessId } = req.params;

    // Find the latest active subscription where endDate is in the future and payment is paid
    const activeSub = await Subscription.findOne({
      businessId,
      paymentStatus: "paid",
      endDate: { $gte: new Date() },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      isSubscribed: Boolean(activeSub),
      data: activeSub || null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all subscriptions (used in PromotedVenuesTable inside Admin Dashboard)
 * @route   GET /api/subscriptions
 * @access  Private (Admin)
 */
export const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate("businessId", "name owner email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};