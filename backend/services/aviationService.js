import Flight from "../models/Flight.js";

export const getAirportFlights = async (airportCode, direction, date) => {
  const query = direction === "arrivals" ? { destinationAirport: airportCode.toUpperCase() } : { originAirport: airportCode.toUpperCase() };
  
  let flights = await Flight.find(query).sort({ scheduledDeparture: 1 });
  
  // Fallback demo dataset if none exist in DB
  if (!flights || flights.length === 0) {
    flights = [
      {
        flightNumber: "P4-720",
        airline: "Air Peace",
        originAirport: "ABV",
        destinationAirport: "JOS",
        scheduledDeparture: new Date(),
        scheduledArrival: new Date(Date.now() + 50 * 60000),
        terminal: "Main Terminal",
        gate: "Gate 01",
        status: "Landed On Time",
        isDemo: true
      },
      {
        flightNumber: "VK-301",
        airline: "ValueJet",
        originAirport: "LOS",
        destinationAirport: "JOS",
        scheduledDeparture: new Date(Date.now() + 3600000),
        scheduledArrival: new Date(Date.now() + 5400000),
        terminal: "Main Terminal",
        gate: "Gate 02",
        status: "Approaching Plateau",
        isDemo: true
      }
    ];
  }
  
  return {
    source: process.env.AVIATION_API_KEY ? "live-provider" : "demo-operational-feed",
    lastSyncedAt: new Date(),
    data: flights
  };
};