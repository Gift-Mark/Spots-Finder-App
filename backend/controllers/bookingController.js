import Booking from "../models/Booking.js";

/**
 * @desc    Create a new booking/reservation
 * @route   POST /api/bookings
 * @access  Private
 */

// POST /api/v1/bookings — Create a secure stay reservation
export const createStayBooking = async (req, res) => {
  try {
    const { 
      userId, 
      propertyName, 
      neighborhood, 
      checkIn, 
      checkOut, 
      totalAmount, 
      bookingReference 
    } = req.body;

    if (!userId || !checkIn || !checkOut || !totalAmount || !bookingReference) {
      return res.status(400).json({ success: false, message: 'Missing required booking parameters.' });
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    if (startDate >= endDate) {
      return res.status(400).json({ success: false, message: 'Check-out date must occur after check-in date.' });
    }

    // Create reservation using your unified Booking model
    const newBooking = await Booking.create({
      userId,
      bookingType: 'stay',
      provider: propertyName,
      destination: neighborhood,
      bookingReference,
      startDate,
      endDate,
      amount: totalAmount,
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

// GET /api/v1/bookings/:reference — Retrieve a secure booking by reference
export const getBookingByReference = async (req, res) => {
  try {
    const { reference } = req.params;
    const booking = await Booking.findOne({ bookingReference: reference });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking reference not found.' });
    }

    return res.status(200).json({ success: true, data: booking });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error retrieving booking details', error: err.message });
  }
};