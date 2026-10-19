import ShuttleBooking from "../models/ShuttleBooking.js";
import crypto from "crypto";

export const createShuttleBooking = async (req, res, next) => {
  try {
    const { customerName, email, phone, pickupLocation, destination, pickupDateTime, passengerCount, luggageDetails, specialInstructions } = req.body;

    if (!customerName || !email || !phone || !pickupLocation || !pickupDateTime || !passengerCount) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Missing required booking fields." } });
    }

    const reference = `JOS-SHT-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
    const baseFarePerPassenger = 7500;
    const fareAmount = baseFarePerPassenger * Number(passengerCount);

    const booking = await ShuttleBooking.create({
      reference,
      customerName,
      email,
      phone,
      pickupLocation,
      destination: destination || "Jos City Centre / Rayfield",
      pickupDateTime: new Date(pickupDateTime),
      passengerCount: Number(passengerCount),
      luggageDetails: luggageDetails || "Standard baggage",
      fareAmount,
      specialInstructions,
      paymentStatus: "pending",
      bookingStatus: "confirmed"
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

export const getShuttleBookingByRef = async (req, res, next) => {
  try {
    const booking = await ShuttleBooking.findOne({ reference: req.params.reference });
    if (!booking) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Booking reference not found." } });
    }
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};