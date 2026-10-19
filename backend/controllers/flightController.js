import Airport from "../models/Airport.js";
import Route from "../models/Route.js";
import { getAirportFlights } from "../services/aviationService.js";

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