import Campaign from "../models/Campaigns.js";

/**
 * @desc    Get active sponsored campaigns (Ad Banners for Mobile & Web Feeds)
 * @route   GET /api/campaigns/active
 * @access  Public
 */
export const getActiveCampaigns = async (req, res) => {
  try {
    const { category, location } = req.query;
    const currentDate = new Date();

    // Leverages compound index { status: 1, startDate: 1, endDate: 1 }
    const query = {
      status: "active",
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    };

    if (category && category !== "All") {
      query.$or = [{ targetCategory: category }, { targetCategory: "All" }];
    }

    if (location && location !== "All") {
      query.$or = [{ targetLocation: location }, { targetLocation: "All" }];
    }

    const activeCampaigns = await Campaign.find(query)
      .populate("businessId", "name email contactPhone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: activeCampaigns.length,
      data: activeCampaigns,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all campaigns owned by a specific business (Vendor Dashboard)
 * @route   GET /api/campaigns/my-campaigns
 * @access  Private (Vendor / Admin)
 */
export const getMyCampaigns = async (req, res) => {
  try {
    const businessId = req.user.businessId;

    if (!businessId && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "No business profile linked to this user account.",
      });
    }

    const query = req.user.role === "admin" ? {} : { businessId };

    const campaigns = await Campaign.find(query)
      .populate("businessId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: campaigns.length,
      data: campaigns,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create a new ad promotion campaign
 * @route   POST /api/campaigns
 * @access  Private (Vendor / Admin)
 */
export const createCampaign = async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      targetLocation,
      targetCategory,
      startDate,
      endDate,
      budget,
    } = req.body;

    const businessId = req.user.businessId || req.body.businessId;

    if (!businessId) {
      return res.status(400).json({
        success: false,
        message: "businessId is required to launch a campaign.",
      });
    }

    const campaign = await Campaign.create({
      businessId,
      title,
      description,
      image: image || "",
      targetLocation: targetLocation || "All",
      targetCategory: targetCategory || "All",
      startDate,
      endDate,
      budget,
      status: "pending_approval", // Requires admin review before going active
    });

    res.status(201).json({
      success: true,
      message: "Campaign submitted for review!",
      data: campaign,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update campaign status or details (Approve, Pause, Complete)
 * @route   PUT /api/campaigns/:id
 * @access  Private (Vendor / Admin)
 */
export const updateCampaign = async (req, res) => {
  try {
    let campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found." });
    }

    // Role Guard: Vendors can only modify their own campaigns
    if (
      req.user.role !== "admin" &&
      campaign.businessId.toString() !== req.user.businessId?.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to modify this campaign.",
      });
    }

    // Restrict approval rights to admins
    if (req.body.status === "active" && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only administrators can approve campaigns to active status.",
      });
    }

    campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Campaign updated successfully.",
      data: campaign,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete a campaign
 * @route   DELETE /api/campaigns/:id
 * @access  Private (Vendor Owner / Admin)
 */
export const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found." });
    }

    if (
      req.user.role !== "admin" &&
      campaign.businessId.toString() !== req.user.businessId?.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this campaign.",
      });
    }

    await campaign.deleteOne();

    res.status(200).json({
      success: true,
      message: "Campaign deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};