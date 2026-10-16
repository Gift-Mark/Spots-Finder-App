import Flight from "../models/Flight.js";

export const searchFlights = async (req, res) => {
  try {
    const { origin, destination } = req.query;

    let query = {};
    if (origin) query.origin = origin.toUpperCase();
    if (destination) query.destination = destination.toUpperCase();

    let flights = await Flight.find(query);

    if (!flights || flights.length === 0) {
      const seedFlights = [
        {
          flightNumber: "VK-301",
          airline: "ValueJet",
          airlineCode: "VK",
          origin: "LOS",
          destination: "JOS",
          departureTime: "07:30 AM",
          arrivalTime: "09:00 AM",
          duration: "1h 30m",
          economyPrice: 78500,
          businessPrice: 145000,
          availableSeats: 4,
          status: "On Time"
        },
        {
          flightNumber: "P4-720",
          airline: "Air Peace",
          airlineCode: "P4",
          origin: "ABV",
          destination: "JOS",
          departureTime: "11:15 AM",
          arrivalTime: "12:05 PM",
          duration: "50m",
          economyPrice: 54000,
          businessPrice: 98000,
          availableSeats: 7,
          status: "On Time"
        },
        {
          flightNumber: "VM-109",
          airline: "Max Air",
          airlineCode: "VM",
          origin: "LOS",
          destination: "JOS",
          departureTime: "02:00 PM",
          arrivalTime: "03:30 PM",
          duration: "1h 30m",
          economyPrice: 82000,
          businessPrice: 155000,
          availableSeats: 2,
          status: "On Time"
        }
      ];

      await Flight.insertMany(seedFlights);
      flights = await Flight.find(query);
    }

    res.status(200).json({ success: true, data: flights });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};