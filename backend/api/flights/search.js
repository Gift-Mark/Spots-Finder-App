// Express.js Backend Endpoint
app.get('/api/flights/search', async (req, res) => {
  const { origin, destination, departureDate, cabinClass } = req.query;

  try {
    // Query Live Aggregator API (e.g., Duffel / Travelport / Amadeus)
    const response = await flightApiClient.offerRequests.create({
      slices: [
        {
          origin: origin, // e.g. "LOS"
          destination: destination, // e.g. "JOS"
          departure_date: departureDate, // e.g. "2026-10-15"
        },
      ],
      passengers: [{ type: 'adult' }],
      cabin_class: cabinClass.toLowerCase(),
    });

    res.json({ success: true, flights: response.data.offers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch live flights' });
  }
});