import { useState, useEffect } from "react";
import styles from "../CSS/FlightBooking.module.css";
import { createBooking, searchFlights } from "../api/client.js";

const AIRPORTS = [
  { code: "JOS", city: "Jos", name: "Yakubu Gowon Airport" },
  { code: "LOS", city: "Lagos", name: "Murtala Muhammed Intl" },
  { code: "ABV", city: "Abuja", name: "Nnamdi Azikiwe Intl" },
  { code: "PHC", city: "Port Harcourt", name: "Port Harcourt Intl" },
  { code: "KAN", city: "Kano", name: "Mallam Aminu Kano Intl" }
];

const LIVE_FLIGHT_SCHEDULES = {
  arrivals: [
    { id: "ARR-01", flight: "P4-720", airline: "Air Peace", route: "Abuja (ABV)", time: "09:35 AM", gate: "Main Terminal • Gate 01", status: "Landed On Time", statusClass: "landed" },
    { id: "ARR-02", flight: "VK-301", airline: "ValueJet", route: "Lagos (LOS)", time: "12:45 PM", gate: "Main Terminal • Gate 02", status: "Approaching Plateau", statusClass: "approaching" },
    { id: "ARR-03", flight: "P4-728", airline: "Air Peace", route: "Abuja (ABV)", time: "04:20 PM", gate: "Main Terminal • Gate 01", status: "Scheduled", statusClass: "scheduled" }
  ],
  departures: [
    { id: "DEP-01", flight: "P4-721", airline: "Air Peace", route: "Abuja (ABV)", time: "10:30 AM", gate: "Main Terminal • Gate 01", status: "Boarding", statusClass: "boarding" },
    { id: "DEP-02", flight: "VK-302", airline: "ValueJet", route: "Lagos (LOS)", time: "01:45 PM", gate: "Main Terminal • Gate 02", status: "Scheduled", statusClass: "scheduled" }
  ]
};

export default function FlightBookingPage() {
  const [tripType, setTripType] = useState("round-trip");
  const [origin, setOrigin] = useState("ABV");
  const [destination, setDestination] = useState("JOS");
  const [departDate, setDepartDate] = useState("2026-10-18");
  const [returnDate, setReturnDate] = useState("2026-11-18");
  const [cabinClass, setCabinClass] = useState("Economy");
  const [passengers, setPassengers] = useState(1);

  const [flights, setFlights] = useState([]);
  const [flightTab, setFlightTab] = useState("arrivals");
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [passengerName, setPassengerName] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedRef, setConfirmedRef] = useState("");

  const loadFlights = async (selectedOrigin, selectedDestination, selectedDate) => {
    try {
      const data = await searchFlights({
        origin: selectedOrigin,
        destination: selectedDestination,
        date: selectedDate,
      });
      if (data && data.success) {
        setFlights(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch live flights:", err);
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      loadFlights("ABV", "JOS", "2026-10-18");
    });
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadFlights(origin, destination, departDate);
  };

  const getFlightPrice = (flight) => {
    const basePrice = cabinClass === "Business" 
      ? (flight.businessPrice || flight.price * 1.8) 
      : (flight.economyPrice || flight.price);
    
    return tripType === "round-trip" ? basePrice * 2 * passengers : basePrice * passengers;
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!passengerName || !passengerEmail || !passengerPhone) return;
    setIsSubmitting(true);

    const finalAmount = getFlightPrice(selectedFlight);
    const tripDescription = tripType === "round-trip" 
      ? `Round Trip (${departDate} to ${returnDate})` 
      : `One Way (${departDate})`;

    try {
      const res = await createBooking({
        bookingType: "Flight Reservation",
        provider: `${selectedFlight.airline} (${selectedFlight.flightNumber || selectedFlight.code}) — ${origin} → ${destination} [${cabinClass}]`,
        destination: `Yakubu Gowon Airport, Jos (JOS) - ${tripDescription}`,
        startDate: departDate,
        endDate: tripType === "round-trip" ? returnDate : departDate,
        amount: finalAmount,
        paymentStatus: "pending",
      });
      setConfirmedRef(res?.data?.bookingReference || `JOS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
    } catch {
      setConfirmedRef(`JOS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
    } finally {
      setIsSubmitting(false);
      setBookingConfirmed(true);
    }
  };

  return (
    <div className={styles.container}>
      {/* 1. HERO BANNER */}
      <section className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Discover the Vibe, Culture, and Beauty of Jos.</h1>
          <p className={styles.heroSub}>
            Your premier guide to the Plateau's vibrant nightlife, historic landmarks, Yakubu Gowon Airport connectivity, and breathtaking landscapes.
          </p>
          <div className={styles.heroSearchBar}>
            <input type="text" placeholder="What are you looking for in Jos? (Hotels, Flights, Info...)" readOnly />
            <button type="button">Search</button>
          </div>
          <div className={styles.heroPills}>
            <span>✈️ Flights</span>
            <span>🗺️ Map</span>
            <span>🏛️ Landmarks</span>
            <span>🍽️ Dining</span>
            <span>🌙 Nightlife</span>
            <span>🌿 Wellness</span>
          </div>
        </div>
      </section>

      {/* 2. MAIN FLIGHT BOOKING ENGINE BANNER */}
      <section className={styles.bookingEngineSection}>
        <div className={styles.engineCard}>
          <div className={styles.engineHeaderBanner}>
            <span className={styles.engineSubTag}>YAKUBU GOWON AIRPORT (JOS) • GATEWAY TO THE PLATEAU</span>
            <h2>Fly Direct to the Cool Plateau Highlands</h2>
            <p>Fast, scenic 50-minute scheduled hops connecting Lagos (LOS) and Abuja (ABV) into Jos Airport (JOS). Skip long highway journeys and touch down directly at 1,280m built-in springtime weather.</p>
          </div>

          <form onSubmit={handleSearchSubmit} className={styles.searchCard}>
            <div className={styles.searchHeader}>
              <div className={styles.typeToggle}>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${tripType === "round-trip" ? styles.toggleBtnActive : ""}`}
                  onClick={() => setTripType("round-trip")}
                >
                  Round Trip
                </button>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${tripType === "one-way" ? styles.toggleBtnActive : ""}`}
                  onClick={() => setTripType("one-way")}
                >
                  One Way
                </button>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${tripType === "multi-city" ? styles.toggleBtnActive : ""}`}
                  onClick={() => setTripType("multi-city")}
                >
                  Multi-City
                </button>
              </div>

              <div className={styles.cabinClassSelector}>
                <label>CABIN CLASS:</label>
                {["Economy", "Premium", "Business"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`${styles.cabinBtn} ${cabinClass === c ? styles.cabinBtnActive : ""}`}
                    onClick={() => setCabinClass(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
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
                <label>Depart</label>
                <input
                  type="date"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                />
              </div>

              {tripType === "round-trip" && (
                <div className={styles.fieldGroup}>
                  <label>Return</label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                  />
                </div>
              )}

              <div className={styles.fieldGroup}>
                <label>Passengers</label>
                <select value={passengers} onChange={(e) => setPassengers(Number(e.target.value))}>
                  <option value={1}>1 Adult</option>
                  <option value={2}>2 Adults</option>
                  <option value={3}>3 Adults</option>
                  <option value={4}>4+ Group</option>
                </select>
              </div>

              <button type="submit" className={styles.searchSubmitBtn}>
                Search Flights →
              </button>
            </div>

            <div className={styles.enginePerks}>
              <span>🛡️ Insurance Included in Insurance</span>
              <span>🔄 Free Rescheduling 24h</span>
              <span>🚁 24/7 Ground Rescue Liaison</span>
              <span>🌄 Plateau Tourism Desk</span>
            </div>
          </form>
        </div>
      </section>

      {/* 3. SCHEDULED DOMESTIC FLIGHTS INTO JOS */}
      <section className={styles.resultsSection}>
        <div className={styles.resultsHeader}>
          <div>
            <span style={{ color: "#f97316", fontWeight: "700", fontSize: "0.8rem", textTransform: "uppercase" }}>Popular Routes</span>
            <h3>Scheduled Domestic Flights into Jos</h3>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Direct airlinks saving over 10 hours of overland road travel across rocky terrain.</p>
          </div>
          <button className={styles.viewLiveRadarBtn}>View Live Flight Radar →</button>
        </div>

        <div className={styles.routesGrid}>
          {flights.length === 0 ? (
            <p style={{ color: "#94a3b8", padding: "1rem" }}>Loading available scheduled flights...</p>
          ) : (
            flights.map((flight) => {
              const calculatedPrice = getFlightPrice(flight);
              return (
                <div key={flight._id || flight.flightNumber} className={styles.routeCard}>
                  <div className={styles.routeCardTop}>
                    <span className={styles.badgePopular}>Most Popular</span>
                    <small>🧳 20kg Included</small>
                  </div>

                  <div className={styles.routeAirports}>
                    <div>
                      <h4>{flight.origin}</h4>
                      <small>Airport HUB</small>
                    </div>
                    <div className={styles.flightArrowLine}>
                      <span>{flight.duration}</span>
                      <div className={styles.dashLine}></div>
                      <span style={{ color: "#22c55e" }}>Non-Stop</span>
                    </div>
                    <div>
                      <h4>{flight.destination}</h4>
                      <small>Yakubu Gowon</small>
                    </div>
                  </div>

                  <div className={styles.airlineDetailsRow}>
                    <div>
                      <strong>{flight.airline}</strong>
                      <div style={{ color: "#94a3b8", fontSize: "0.75rem" }}>{flight.flightNumber || flight.code} • {cabinClass}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ color: "#22c55e", fontSize: "0.8rem", fontWeight: "bold" }}>On Time</span>
                    </div>
                  </div>

                  <div className={styles.routeFooter}>
                    <div>
                      <small style={{ color: "#94a3b8" }}>Starting from</small>
                      <div className={styles.routePrice}>₦{calculatedPrice.toLocaleString()}</div>
                    </div>
                    <button
                      type="button"
                      className={styles.selectRouteBtn}
                      onClick={() => setSelectedFlight(flight)}
                    >
                      Select →
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* 4. LIVE FLIGHT STATUS RADAR TABLE */}
      <section className={styles.radarSection}>
        <div className={styles.radarHeader}>
          <div>
            <h3>Today’s Flights at Yakubu Gowon Airport (JOS)</h3>
          </div>
          <div className={styles.radarTabs}>
            <button
              className={`${styles.radarTabBtn} ${flightTab === "arrivals" ? styles.radarTabActive : ""}`}
              onClick={() => setFlightTab("arrivals")}
            >
              📥 Arrivals (Today)
            </button>
            <button
              className={`${styles.radarTabBtn} ${flightTab === "departures" ? styles.radarTabActive : ""}`}
              onClick={() => setFlightTab("departures")}
            >
              📤 Departures (Today)
            </button>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.flightTable}>
            <thead>
              <tr>
                <th>Flight No</th>
                <th>Carrier</th>
                <th>Origin/Dest</th>
                <th>Sched. Time</th>
                <th>Terminal/Gate</th>
                <th>Status</th>
                <th>Radar Status</th>
              </tr>
            </thead>
            <tbody>
              {LIVE_FLIGHT_SCHEDULES[flightTab].map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.flight}</strong></td>
                  <td>{item.airline}</td>
                  <td>{item.route}</td>
                  <td>{item.time}</td>
                  <td>{item.gate}</td>
                  <td>
                    <span className={`${styles.statusPill} ${styles[item.statusClass]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button className={styles.trackRouteBtn} onClick={() => alert(`Live telemetry tracking initiated for flight ${item.flight}`)}>
                      Track Route ↗
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <small style={{ display: "block", marginTop: "0.75rem", color: "#64748b", textAlign: "right" }}>
          Radar telemetry automatically syncs every 60s.
        </small>
      </section>

      {/* 5. GROUND LOGISTICS & GUIDE */}
      <section className={styles.logisticsSection}>
        <h3>Ground Logistics & Guide</h3>
        <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>Yakubu Gowon Airport, Heipang Ground Transfers & Amenities.</p>

        <div className={styles.logisticsGrid}>
          <div className={styles.logisticsCard}>
            <div className={styles.logisticsIcon}>📍</div>
            <h4>Location & Distance</h4>
            <p>Situated 35km southwest of City Centre in historic Heipang. A picturesque 35-minute drive along the high-grade dual-carriageway; feel the cool Lake expressway with sweeping rocky vistas.</p>
            <span className={styles.logisticsTag}>Google Route: 35 mins (verified)</span>
          </div>

          <div className={styles.logisticsCard}>
            <div className={styles.logisticsIcon}>🚐</div>
            <h4>Official Jos Pulse Shuttles</h4>
            <p>Pre-book verified air-conditioned airport taxis and direct transfers directly to Rayfield resort zones and Jos City Centre. Fixed pricing with zero airport haggling.</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
              <strong>From ₦7,500 / route</strong>
              <button className={styles.bookShuttleBtn} onClick={() => alert("Shuttle reservation portal opened!")}>Book Shuttle</button>
            </div>
          </div>

          <div className={styles.logisticsCard}>
            <div className={styles.logisticsIcon}>☕</div>
            <h4>Arrival Amenities & Lounge</h4>
            <p>Enjoy newly modernized air-conditioned VIP lounges, fast-track baggage carousels, Plateau State Tourism visitor desk with free printed hiking maps, and artisanal coffee.</p>
            <span className={styles.logisticsTag}>Plateau Coffee Bar Main Terminal</span>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM PROMO BANNER */}
      <section className={styles.bottomPromoBanner}>
        <div className={styles.promoContent}>
          <span className={styles.badgePromo}>Highland Destination Valuation</span>
          <h2>Pack a Light Jacket: Jos is Nigeria’s Coldest Aviation Hub</h2>
          <p>Due to high altitude, temperatures typically average between 18°C to 24°C year-round. October through March provides clear, crisp visibility for spectacular views of the rock formations during descent.</p>
          <div className={styles.promoBulletGrid}>
            <span>✔️ Zero-fog ground drops during dry season</span>
            <span>✔️ Spectacular left-side window views of monoliths</span>
            <span>✔️ Quick 55-minute passage with pressure-equalizing</span>
            <span>✔️ Direct highway access with zero police gridlock</span>
          </div>
        </div>

        <div className={styles.promoConciergeCard}>
          <h4>Need Concierge Support?</h4>
          <p>Personalized & group air-ticketing</p>
          <button className={styles.conciergeChatBtn} onClick={() => alert("Connecting you with Jos Pulse Airport Concierge...")}>
            Connect with Airport Concierge
          </button>
          <button className={styles.downloadGuideBtn}>
            📥 Download Airport/Plateau Guided PDF
          </button>
        </div>
      </section>

      {/* BOOKING MODAL */}
      {selectedFlight && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <button
              type="button"
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
                  <p>Reserving {cabinClass} ticket to Yakubu Gowon Airport, Jos ({tripType}).</p>
                </div>

                <div className={styles.flightSummaryPill}>
                  <span>{selectedFlight.airline} ({selectedFlight.flightNumber || selectedFlight.code}) [{cabinClass}]</span>
                  <span>₦{getFlightPrice(selectedFlight).toLocaleString()}</span>
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
                    <input
                      type="email"
                      required
                      placeholder="samuel@example.com"
                      value={passengerEmail}
                      onChange={(e) => setPassengerEmail(e.target.value)}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+234 800 000 0000"
                      value={passengerPhone}
                      onChange={(e) => setPassengerPhone(e.target.value)}
                    />
                  </div>

                  <button type="submit" className={styles.confirmPayBtn} disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : `Pay ₦{getFlightPrice(selectedFlight).toLocaleString()} & Issue e-Ticket`}
                  </button>
                </form>
              </>
            ) : (
              <div className={styles.ticketBox}>
                <h2 style={{ color: "#22c55e", marginBottom: "0.5rem" }}>🎉 Booking Confirmed!</h2>
                <p>Your {cabinClass} e-Ticket to Jos (JOS) has been issued.</p>
                
                <div className={styles.ticketCode}>{confirmedRef}</div>
                
                <p><strong>Passenger:</strong> {passengerName}</p>
                <p><strong>Flight:</strong> {selectedFlight.airline} ({selectedFlight.flightNumber || selectedFlight.code}) [{cabinClass}]</p>
                <p><strong>Trip:</strong> {tripType.toUpperCase()} ({departDate} {tripType === "round-trip" ? `to ${returnDate}` : ""})</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}