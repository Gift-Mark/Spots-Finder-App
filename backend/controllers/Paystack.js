app.post('/api/paystack-webhook', async (req, res) => {
  const event = req.body;

  if (event.event === 'charge.success') {
    const { flightOfferId, passengerDetails } = event.data.metadata;

    // 1. Issue live ticket with flight API
    const bookingResult = await flightApiClient.orders.create({
      selected_offers: [flightOfferId],
      passengers: passengerDetails,
      type: 'instant',
    });

    // 2. Save ticket PNR to database & send SMS/Email to user
    await saveBookingToDB({
      pnr: bookingResult.data.booking_reference,
      userEmail: passengerDetails[0].email,
      status: 'CONFIRMED'
    });
  }

  res.sendStatus(200);
});