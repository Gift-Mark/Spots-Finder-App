import Airport from "../models/Airport.js";
import Route from "../models/Route.js";
import { getAirportFlights } from "../services/aviationService.js";
import FlightBooking from "../models/FlightBooking.js";

export const listAirports = async (req, res, next) => {
  try {
    const airports = await Airport.find({ isActive: true });
    res.status(200).json({ success: true, data: airports });
  } catch (error) {
    next(error);
  }
};

export const listPublishedRoutes = async (req, res, next) => {
  try {
    const routes = await Route.find({ isPublished: true })
      .populate("originAirport")
      .populate("destinationAirport");
    res.status(200).json({ success: true, data: routes });
  } catch (error) {
    next(error);
  }
};

export const getAirportFlightStatus = async (req, res, next) => {
  try {
    const { airportCode } = req.params;
    const { direction = "arrivals", date } = req.query;
    const result = await getAirportFlights(airportCode, direction, date);
    res.status(200).json({ success: true, meta: { source: result.source, lastSyncedAt: result.lastSyncedAt }, data: result.data });
  } catch (error) {
    next(error);
  }
};

// Express controller handling flight creation
export const bookFlight = async (req, res) => {
  try {
    const { 
      passengerName, 
      email, 
      phone, 
      airline, 
      origin, 
      destination, 
      departDate, 
      cabinClass, 
      passengerCount, 
      totalFare 
    } = req.body;

    // Generate unique reference code
    const reference = `JOS-FLT-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBooking = await FlightBooking.create({
      reference,
      passengerName,
      email,
      phone,
      airline,
      origin,
      destination,
      departDate,
      cabinClass,
      passengerCount,
      totalFare
    });

    return res.status(201).json({
      success: true,
      message: "Flight booked and saved to MongoDB successfully!",
      data: newBooking
    });
  } catch (error) {
    console.error("Booking database error:", error.message);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to save booking to database", 
      error: error.message 
    });
  }
};