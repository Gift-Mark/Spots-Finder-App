import Booking from "../models/Booking.js";

/**
 * @desc    Create a new booking/reservation
 * @route   POST /api/bookings
 * @access  Private
 */
export const createBooking = async (req, res) => {
  try {
    const {
      bookingType,
      provider,
      destination,
      startDate,
      endDate,
      amount,
      paymentStatus,
    } = req.body;

    const userId = req.user._id;

    // Generate unique alphanumeric booking reference code (e.g., JOS-8F92A1)
    const bookingReference = `JOS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const booking = await Booking.create({
      userId,
      bookingType,
      provider,
      destination,
      bookingReference,
      startDate,
      endDate,
      amount,
      paymentStatus: paymentStatus || "pending",
      status: paymentStatus === "paid" ? "confirmed" : "pending_confirmation",
    });

    res.status(201).json({
      success: true,
      message: "Booking submitted successfully!",
      data: booking,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate booking reference generated. Please try again.",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all bookings for the logged-in user
 * @route   GET /api/bookings/my-bookings
 * @access  Private
 */
export const getMyBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { userId: req.user._id };

    if (status) query.status = status;

    // Leverages compound index { userId: 1, startDate: 1, status: 1 }
    const bookings = await Booking.find(query)
      .sort({ startDate: 1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get booking details by reference code or ID
 * @route   GET /api/bookings/:identifier
 * @access  Private
 */
export const getBookingByIdentifier = async (req, res) => {
  try {
    const { identifier } = req.params;

    const query = identifier.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: identifier }
      : { bookingReference: identifier.toUpperCase() };

    const booking = await Booking.findOne(query).populate("userId", "firstName lastName email phone");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking record not found." });
    }

    // Role Guard: Ensure user owns the booking unless they are an admin
    if (
      req.user.role !== "admin" &&
      booking.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this booking.",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update booking status or payment status
 * @route   PUT /api/bookings/:id
 * @access  Private (Vendor / Admin / Owner)
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const { paymentStatus, status } = req.body;
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    // Guard: Normal users can only cancel their pending bookings
    if (
      req.user.role !== "admin" &&
      req.user.role !== "vendor" &&
      booking.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this booking.",
      });
    }

    if (paymentStatus) booking.paymentStatus = paymentStatus;
    if (status) booking.status = status;

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully.",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};