import Business from "../models/Businesses.js";

/**
 * @desc    Get all businesses (Public listings / Vendor directory)
 * @route   GET /api/businesses
 * @access  Public
 */
export const getAllBusinesses = async (req, res) => {
  try {
    const { category, city, status, verificationStatus, search, page = 1, limit = 12 } = req.query;

    const query = {};

    if (category) query.category = category;
    if (city) query.city = city;
    
    // Default public view to active businesses unless specified
    query.status = status || "active";

    if (verificationStatus) {
      query["verification.status"] = verificationStatus;
    }

    if (search) {
      query.$or = [
        { businessName: { $regex: search,$options: "i" } },
        { description: { $regex: search,$options: "i" } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const businesses = await Business.find(query)
      .populate("ownerId", "firstName lastName email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await Business.countDocuments(query);

    res.status(200).json({
      success: true,
      count: businesses.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: businesses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get business details by ID
 * @route   GET /api/businesses/:id
 * @access  Public
 */
export const getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id).populate(
      "ownerId",
      "firstName lastName email role"
    );

    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found." });
    }

    res.status(200).json({
      success: true,
      data: business,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Register a new business profile
 * @route   POST /api/businesses
 * @access  Private (Vendor / Admin)
 */
export const createBusiness = async (req, res) => {
  try {
    const {
      businessName,
      description,
      category,
      address,
      city,
      state,
      latitude,
      longitude,
      phone,
      email,
      website,
      images,
      openingHours,
    } = req.body;

    const ownerId = req.user._id;

    // Check if vendor already registered a business profile
    const existingBusiness = await Business.findOne({ ownerId });
    if (existingBusiness && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "You have already registered a business account.",
      });
    }

    const business = await Business.create({
      ownerId,
      businessName,
      description,
      category,
      address,
      city,
      state,
      latitude,
      longitude,
      phone,
      email,
      website,
      images: images || [],
      openingHours: openingHours || "",
      status: "pending", // Requires admin approval to activate
    });

    res.status(201).json({
      success: true,
      message: "Business profile created successfully! Submitted for review.",
      data: business,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update business details
 * @route   PUT /api/businesses/:id
 * @access  Private (Vendor Owner / Admin)
 */
export const updateBusiness = async (req, res) => {
  try {
    let business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found." });
    }

    // Role Guard: Vendors can only update their own business profile
    if (
      req.user.role !== "admin" &&
      business.ownerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this business profile.",
      });
    }

    business = await Business.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Business updated successfully.",
      data: business,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Submit verification documents (CAC, Utility Bill, Business Permit)
 * @route   POST /api/businesses/:id/verify
 * @access  Private (Vendor Owner)
 */
export const submitVerification = async (req, res) => {
  try {
    const { cacDocument, utilityBill, businessPermit } = req.body;
    let business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found." });
    }

    if (
      req.user.role !== "admin" &&
      business.ownerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to submit verification for this business.",
      });
    }

    business.verification = {
      cacDocument: cacDocument || business.verification.cacDocument,
      utilityBill: utilityBill || business.verification.utilityBill,
      businessPermit: businessPermit || business.verification.businessPermit,
      status: "pending_review",
      rejectionReason: "",
      submittedAt: new Date(),
    };

    await business.save();

    res.status(200).json({
      success: true,
      message: "Verification documents submitted successfully for admin review.",
      data: business,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Admin endpoint to review verification and change status (verified/rejected/active)
 * @route   PATCH /api/businesses/:id/review-verification
 * @access  Private (Admin Only)
 */
export const reviewVerification = async (req, res) => {
  try {
    const { verificationStatus, rejectionReason, businessStatus } = req.body;

    let business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found." });
    }

    if (verificationStatus) {
      business.verification.status = verificationStatus;
    }

    if (rejectionReason !== undefined) {
      business.verification.rejectionReason = rejectionReason;
    }

    if (businessStatus) {
      business.status = businessStatus;
    }

    await business.save();

    res.status(200).json({
      success: true,
      message: `Business verification updated to ${verificationStatus}`,
      data: business,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};