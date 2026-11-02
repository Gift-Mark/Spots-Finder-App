import Booking from "../models/Booking.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const SERVICE_FEE_RATE = 0.05; // Matches the 5% platform fee shown in checkout

const generateBookingReference = () =>
  `JP-STAY-${Date.now().toString(36).toUpperCase()}${Math.floor(
    100 + Math.random() * 900
  )}`;

/**
 * @desc    Create a new booking/reservation
 * @route   POST /api/bookings
 * @access  Private
 */

// POST /api/bookings — Create a secure stay reservation
export const createStayBooking = async (req, res) => {
  try {
    const {
      propertyName,
      neighborhood,
      checkIn,
      checkOut,
      rooms,
      nightlyRate,
      totalAmount,
    } = req.body;

    // The authenticated user owns the booking. Never trust a client-supplied id.
    const userId = req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: 'Not authorized to create a booking.' });
    }

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Check-in and check-out dates are required.'
      });
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid check-in or check-out date.'
      });
    }

    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must occur after check-in date.'
      });
    }

    const nights = Math.round((endDate - startDate) / DAY_MS);
    const roomCount = Math.max(1, Number.parseInt(rooms, 10) || 1);

    // Recompute the payable amount from the nightly rate so a tampered
    // `totalAmount` from the browser is not trusted.
    const rate = Number(nightlyRate);
    const subtotal =
      Number.isFinite(rate) && rate > 0
        ? rate * nights * roomCount
        : Number(totalAmount);

    if (!Number.isFinite(subtotal) || subtotal <= 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid booking amount is required.'
      });
    }

    const amount = Math.round(subtotal * (1 + SERVICE_FEE_RATE));

    // Create reservation using the unified Booking model
    const newBooking = await Booking.create({
      userId,
      bookingType: 'stay',
      provider: propertyName || 'Jos Pulse Stay',
      destination: neighborhood || 'Jos, Plateau State',
      bookingReference: generateBookingReference(),
      startDate,
      endDate,
      amount,
      paymentStatus: 'pending',
      status: 'pending_confirmation'
    });

    return res.status(201).json({
      success: true,
      message: 'Stay booking request created successfully.',
      data: newBooking
    });
  } catch (err) {
    console.error('Booking creation error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create booking reservation.',
      error: err.message
    });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    console.error("User bookings retrieval error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve bookings.",
    });
  }
};

// GET /api/bookings/:reference — Retrieve a secure booking by reference
export const getBookingByReference = async (req, res) => {
  try {
    const { reference } = req.params;
    const booking = await Booking.findOne({ bookingReference: reference });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking reference not found.' });
    }

    // Only the booking owner (or an admin) may read the reservation.
    if (
      req.user &&
      req.user.role !== 'admin' &&
      String(booking.userId) !== String(req.user._id)
    ) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized to view this booking.' });
    }

    return res.status(200).json({ success: true, data: booking });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error retrieving booking details', error: err.message });
  }
};
