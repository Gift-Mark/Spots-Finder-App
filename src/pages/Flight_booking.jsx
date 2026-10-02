import { useState } from "react";
import styles from "../CSS/FlightBooking.module.css";

const AIRPORTS = [
  { code: "JOS", city: "Jos", name: "Yakubu Gowon Airport" },
  { code: "LOS", city: "Lagos", name: "Murtala Muhammed Intl" },
  { code: "ABV", city: "Abuja", name: "Nnamdi Azikiwe Intl" },
  { code: "PHC", city: "Port Harcourt", name: "Port Harcourt Intl" },
  { code: "KAN", city: "Kano", name: "Mallam Aminu Kano Intl" }
];

const MOCK_FLIGHTS = [
  {
    id: "VJ-301",
    airline: "ValueJet",
    code: "VK-301",
    logo: "🛩️",
    from: "LOS",
    to: "JOS",
    depTime: "07:30 AM",
    arrTime: "09:00 AM",
    duration: "1h 30m",
    price: 78500,
    seatsLeft: 4
  },
  {
    id: "AP-204",
    airline: "Air Peace",
    code: "P4-720",
    logo: "🕊️",
    from: "ABV",
    to: "JOS",
    depTime: "11:15 AM",
    arrTime: "12:05 PM",
    duration: "50m",
    price: 54000,
    seatsLeft: 7
  },
  {
    id: "MAX-109",
    airline: "Max Air",
    code: "VM-109",
    logo: "✈️",
    from: "LOS",
    to: "JOS",
    depTime: "02:00 PM",
    arrTime: "03:30 PM",
    duration: "1h 30m",
    price: 82000,
    seatsLeft: 2
  }
];

export default function FlightBookingPage() {
  const [tripType, setTripType] = useState("one-way");
  const [origin, setOrigin] = useState("LOS");
  const [destination, setDestination] = useState("JOS");
  const [departDate, setDepartDate] = useState("2026-10-15");
  const [cabinClass, setCabinClass] = useState("Economy");
  
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [passengerName, setPassengerName] = useState("");

  const handleBook = (e) => {
    e.preventDefault();
    if (!passengerName) return;
    setBookingConfirmed(true);
  };

  return (
    <div className={styles.container}>
      {/* Brand Hero */}
      <section className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <span className={styles.brandBadge}>Plateau Travel Portal</span>
          <h1 className={styles.heroTitle}>Book Flights to Jos (JOS)</h1>
          <p className={styles.heroSub}>
            Direct commercial flight connections to Yakubu Gowon Airport from Lagos and Abuja.
          </p>
        </div>
      </section>

      {/* Flight Search Panel */}
      <div className={styles.searchWrapper}>
        <div className={styles.searchCard}>
          <div className={styles.searchHeader}>
            <div className={styles.typeToggle}>
              <button
                className={`${styles.toggleBtn} ${tripType === "one-way" ? styles.toggleBtnActive : ""}`}
                onClick={() => setTripType("one-way")}
              >
                One Way
              </button>
              <button
                className={`${styles.toggleBtn} ${tripType === "round-trip" ? styles.toggleBtnActive : ""}`}
                onClick={() => setTripType("round-trip")}
              >
                Round Trip
              </button>
            </div>

            <select
              value={cabinClass}
              onChange={(e) => setCabinClass(e.target.value)}
              className={styles.classSelect}
            >
              <option value="Economy">Economy Class</option>
              <option value="Business">Business Class</option>
            </select>
          </div>

          <div className={styles.inputGrid}>
            <div className={styles.fieldGroup}>
              <label>From (Origin)</label>
              <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
                {AIRPORTS.map((a) => (
                  <option key={a.code} value={a.code}>
                    {a.city} ({a.code})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label>To (Destination)</label>
              <select value={destination} onChange={(e) => setDestination(e.target.value)}>
                {AIRPORTS.map((a) => (
                  <option key={a.code} value={a.code}>
                    {a.city} ({a.code})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label>Departure Date</label>
              <input
                type="date"
                value={departDate}
                onChange={(e) => setDepartDate(e.target.value)}
              />
            </div>

            <button className={styles.searchSubmitBtn}>
              Search Flights →
            </button>
          </div>
        </div>
      </div>

      {/* Results List */}
      <section className={styles.resultsSection}>
        <div className={styles.resultsHeader}>
          <h3>Available Flights ({origin} → {destination})</h3>
          <small>Prices include airport taxes & fees</small>
        </div>

        {MOCK_FLIGHTS.map((flight) => (
          <div key={flight.id} className={styles.flightCard}>
            <div className={styles.airlineInfo}>
              <div className={styles.airlineLogo}>{flight.logo}</div>
              <div>
                <div className={styles.airlineName}>{flight.airline}</div>
                <div className={styles.flightCode}>{flight.code} • {cabinClass}</div>
              </div>
            </div>

            <div className={styles.timeTimeline}>
              <div className={styles.timeNode}>
                <h4>{flight.depTime}</h4>
                <small>{flight.from}</small>
              </div>

              <div className={styles.timelineLine}>
                <small>{flight.duration}</small>
                <div className={styles.lineGraphic}></div>
                <small style={{ color: "#22c55e" }}>Direct</small>
              </div>

              <div className={styles.timeNode}>
                <h4>{flight.arrTime}</h4>
                <small>{flight.to}</small>
              </div>
            </div>

            <div className={styles.priceCol}>
              <div className={styles.priceAmount}>₦{flight.price.toLocaleString()}</div>
              <span className={styles.seatLeftBadge}>Only {flight.seatsLeft} seats left</span>
              <button
                className={styles.selectFlightBtn}
                onClick={() => setSelectedFlight(flight)}
              >
                Select Flight
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Booking Modal */}
      {selectedFlight && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <button
              className={styles.closeModalBtn}
              onClick={() => {
                setSelectedFlight(null);
                setBookingConfirmed(false);
              }}
            >
              ✕
            </button>

            {!bookingConfirmed ? (
              <>
                <div className={styles.modalHeader}>
                  <h2>Passenger Booking Details</h2>
                  <p>Complete details to reserve ticket to Yakubu Gowon Airport, Jos.</p>
                </div>

                <div className={styles.flightSummaryPill}>
                  <span>{selectedFlight.airline} ({selectedFlight.code})</span>
                  <span>₦{selectedFlight.price.toLocaleString()}</span>
                </div>

                <form onSubmit={handleBook} className={styles.passengerForm}>
                  <div className={styles.fieldGroup}>
                    <label>Full Passenger Name (As on ID)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Samuel Pam"
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label>Email Address</label>
                    <input type="email" required placeholder="samuel@example.com" />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label>Phone Number</label>
                    <input type="tel" required placeholder="+234 800 000 0000" />
                  </div>

                  <button type="submit" className={styles.confirmPayBtn}>
                    Pay ₦{selectedFlight.price.toLocaleString()} & Issue e-Ticket
                  </button>
                </form>
              </>
            ) : (
              <div className={styles.ticketBox}>
                <h2 style={{ color: "#0d1b2a", marginBottom: "0.5rem" }}>🎉 Booking Confirmed!</h2>
                <p>Your e-Ticket to Jos (JOS) has been issued.</p>
                
                <div className={styles.ticketCode}>JOS-89240-PX</div>
                
                <p><strong>Passenger:</strong> {passengerName}</p>
                <p><strong>Flight:</strong> {selectedFlight.airline} ({selectedFlight.code})</p>
                <p><strong>Date:</strong> {departDate} at {selectedFlight.depTime}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}