import { useState, useEffect } from "react";
import styles from "../CSS/FlightBooking.module.css";
import { 
  fetchAirports, 
  fetchPublishedRoutes, 
  fetchAirportFlights, 
  createShuttleBooking, 
  fetchAmenities, 
  submitConciergeEnquiry 
} from "../services/api.js";
import Header from "../Components/headerNav.jsx";
import HeroSection from "../Components/HeroSection.jsx";
import Footer from "../Components/Footer.jsx";

export default function FlightBookingPage() {
  const [tripType, setTripType] = useState("round-trip");
  const [cabinClass, setCabinClass] = useState("Economy");
  const [origin, setOrigin] = useState("ABV");
  const [destination, setDestination] = useState("JOS");
  const [departDate, setDepartDate] = useState("2026-11-18");
  const [returnDate, setReturnDate] = useState("2026-11-18");
  const [passengers, setPassengers] = useState(1);

  const [airports, setAirports] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [flightTab, setFlightTab] = useState("arrivals");
  const [flightsStatus, setFlightsStatus] = useState([]);
  const [amenities, setAmenities] = useState([]); // Kept and rendered in section 4

  // Shuttle state (Fully bound to shuttle form inputs)
  const [shuttleName, setShuttleName] = useState("");
  const [shuttleEmail, setShuttleEmail] = useState("");
  const [shuttleRef, setShuttleRef] = useState("");

  // Concierge state (Fully bound to concierge form inputs)
  const [conciergeName, setConciergeName] = useState("");
  const [conciergeEmail, setConciergeEmail] = useState("");
  const [conciergeMsg, setConciergeMsg] = useState("");
  const [conciergeSuccess, setConciergeSuccess] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const airportRes = await fetchAirports();
        if (airportRes?.success) setAirports(airportRes.data);

        const routeRes = await fetchPublishedRoutes();
        if (routeRes?.success) setRoutes(routeRes.data);

        const flightRes = await fetchAirportFlights("JOS", "arrivals");
        if (flightRes?.success) setFlightsStatus(flightRes.data);

        const amenityRes = await fetchAmenities();
        if (amenityRes?.success) setAmenities(amenityRes.data);
      } catch (err) {
        console.error("Initialization error:", err);
      }
    }
    loadInitialData();
  }, []);

  const handleFlightTabChange = async (tab) => {
    setFlightTab(tab);
    try {
      const res = await fetchAirportFlights("JOS", tab);
      if (res?.success) setFlightsStatus(res.data);
    } catch (err) {
      console.error("Failed to fetch flight telemetry:", err);
    }
  };

  const handleShuttleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createShuttleBooking({
        customerName: shuttleName || "Plateau Traveller",
        email: shuttleEmail || "traveller@jospulse.ng",
        pickupLocation: "Yakubu Gowon Airport (JOS)",
        destination: "Jos City Centre / Rayfield",
        pickupDateTime: `${departDate}T10:00:00Z`,
        passengerCount: passengers,
        luggageDetails: "Standard 20kg bags"
      });
      if (res?.success) {
        setShuttleRef(res.data.reference);
        alert(`Shuttle booked successfully! Ref: ${res.data.reference}`);
      }
    } catch {
      alert("Shuttle booking failed. Please verify inputs.");
    }
  };

  const handleConciergeSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await submitConciergeEnquiry({
        name: conciergeName,
        email: conciergeEmail,
        message: conciergeMsg,
        category: "Airport Concierge Support"
      });
      if (res?.success) {
        setConciergeSuccess(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      
      {/* HERO SECTION */}
      <HeroSection 
        title="Discover the Vibe, Culture, and Beauty of Jos."
        subtitle="Your premier guide to the Plateau's vibrant nightlife, lounges, Yakubu Gowon Airport connectivity, and breathtaking landscapes."
        placeholder="What are you looking for? (e.g. Flights, Hotels, Shuttles)"
        heroImage="/images/airport.jpg"
        filterPills={[
          { id: "flights", label: "Flights" },
          { id: "golf", label: "Golf" },
          { id: "festivals", label: "Festivals" },
          { id: "dining", label: "Dining" },
          { id: "nightlife", label: "Nightlife" },
          { id: "where-to-stay", label: "Where to Stay" },
        ]}
      />

      {/* SECTION 1: FLIGHT BOOKING PANEL */}
      <section className={styles.bookingEngineSection}>
        <div className={styles.engineCard}>
          <div className={styles.engineHeaderBanner}>
            <span className={styles.engineSubTag}>
              📍 YAKUBU GOWON AIRPORT (JOS) • GATEWAY TO THE PLATEAU
            </span>
            <h2>Fly Direct to the Cool Plateau Highlands</h2>
            <p>
              Fast, scenic 50-minute scheduled hops connecting Lagos (LOS) and Abuja (ABV) into Jos Airport (JOS). Skip long highway journeys and touch down directly at 1,280m built-in springtime weather.
            </p>
          </div>

          <div className={styles.searchCard}>
            <div className={styles.searchHeader}>
              <div className={styles.typeToggle}>
                {["round-trip", "one-way", "multi-city"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`${styles.toggleBtn} ${tripType === t ? styles.toggleBtnActive : ""}`}
                    onClick={() => setTripType(t)}
                  >
                    {t.replace("-", " ").toUpperCase()}
                  </button>
                ))}
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
                <label>From</label>
                <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
                  {airports.length > 0 ? (
                    airports.map((a) => (
                      <option key={a._id} value={a.iataCode}>{a.city} ({a.iataCode})</option>
                    ))
                  ) : (
                    <>
                      <option value="ABV">Abuja (ABV)</option>
                      <option value="LOS">Lagos (LOS)</option>
                    </>
                  )}
                </select>
              </div>

              <div className={styles.swapBadge}>⇄</div>

              <div className={styles.fieldGroup}>
                <label>To</label>
                <select value={destination} onChange={(e) => setDestination(e.target.value)}>
                  {airports.length > 0 ? (
                    airports.map((a) => (
                      <option key={a._id} value={a.iataCode}>{a.city} ({a.iataCode})</option>
                    ))
                  ) : (
                    <>
                      <option value="JOS">Jos (JOS)</option>
                      <option value="KAN">Kano (KAN)</option>
                    </>
                  )}
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label>Depart</label>
                <input type="date" value={departDate} onChange={(e) => setDepartDate(e.target.value)} />
              </div>

              {tripType === "round-trip" && (
                <div className={styles.fieldGroup}>
                  <label>Return</label>
                  <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
                </div>
              )}

              <div className={styles.fieldGroup}>
                <label>Passengers</label>
                <select value={passengers} onChange={(e) => setPassengers(Number(e.target.value))}>
                  <option value={1}>1 Adult</option>
                  <option value={2}>2 Adults</option>
                  <option value={4}>4+ Group</option>
                </select>
              </div>

              <button type="button" className={styles.searchSubmitBtn} onClick={() => alert("Searching aviation inventory...")}>
                Search Flights →
              </button>
            </div>

            <div className={styles.enginePerks}>
              <span>🛡️ Insurance Included in Fare</span>
              <span>🔄 Free Rescheduling 24h</span>
              <span>🚁 24/7 Ground Rescue Liaison</span>
              <span>🌄 Plateau Tourism Desk</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: POPULAR ROUTES */}
      <section className={styles.resultsSection}>
        <div className={styles.resultsHeader}>
          <div>
            <span className={styles.sectionSubtitle}>POPULAR ROUTES</span>
            <h3>Scheduled Domestic Flights into Jos</h3>
            <p className={styles.sectionDesc}>
              Direct airlinks saving over 10 hours of overland road travel across rocky terrain.
            </p>
          </div>
          <button type="button" className={styles.viewLiveRadarBtn}>
            View Live Radar Tracker ↗
          </button>
        </div>

        <div className={styles.routesGrid}>
          {routes.length > 0 ? (
            routes.map((route) => (
              <div key={route._id} className={styles.routeCard}>
                <div className={styles.routeCardTop}>
                  <span className={styles.badgePopular}>
                    {route.isFeatured ? "Most Popular" : "Verified Route"}
                  </span>
                  <small>🧳 20kg Included</small>
                </div>
                <div className={styles.routeAirports}>
                  <div>
                    <h4>{route.originAirport?.iataCode || "LOS"}</h4>
                    <small>{route.originAirport?.city || "Lagos"}</small>
                  </div>
                  <div className={styles.flightArrowLine}>
                    <span>{route.durationMinutes || 55} mins</span>
                    <div className={styles.dashLine}></div>
                    <span className={styles.nonstopText}>Non-Stop</span>
                  </div>
                  <div>
                    <h4>{route.destinationAirport?.iataCode || "JOS"}</h4>
                    <small>Yakubu Gowon</small>
                  </div>
                </div>
                <div className={styles.airlineDetailsRow}>
                  <div>
                    <strong>{route.airline}</strong>
                    <div className={styles.flightTimes}>Daily Flight • 11:30 AM → 12:25 PM</div>
                  </div>
                </div>
                <div className={styles.routeFooter}>
                  <div>
                    <small className={styles.startingFrom}>Starting from</small>
                    <div className={styles.routePrice}>₦{(route.startingFare || 85000).toLocaleString()}</div>
                  </div>
                  <button type="button" className={styles.selectRouteBtn} onClick={() => {
                    setOrigin(route.originAirport?.iataCode || "LOS");
                    setDestination(route.destinationAirport?.iataCode || "JOS");
                  }}>
                    Select →
                  </button>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className={styles.routeCard}>
                <div className={styles.routeCardTop}>
                  <span className={styles.badgePopular}>Most Popular</span>
                  <small>🧳 20kg Included</small>
                </div>
                <div className={styles.routeAirports}>
                  <div>
                    <h4>LOS</h4>
                    <small>Lagos (LOS)</small>
                  </div>
                  <div className={styles.flightArrowLine}>
                    <span>55 mins</span>
                    <div className={styles.dashLine}></div>
                    <span className={styles.nonstopText}>Direct Scheduled</span>
                  </div>
                  <div>
                    <h4>JOS</h4>
                    <small>Yakubu Gowon</small>
                  </div>
                </div>
                <div className={styles.airlineDetailsRow}>
                  <strong>Air Peace</strong>
                  <span className={styles.flightTimes}>11:30 AM Depart</span>
                </div>
                <div className={styles.routeFooter}>
                  <div>
                    <small className={styles.startingFrom}>Starting from</small>
                    <div className={styles.routePrice}>₦85,000</div>
                  </div>
                  <button type="button" className={styles.selectRouteBtn}>Select →</button>
                </div>
              </div>

              <div className={styles.routeCard}>
                <div className={styles.routeCardTop}>
                  <span className={styles.badgeLight}>Premium Flight</span>
                  <small>🧳 Express Boarding</small>
                </div>
                <div className={styles.routeAirports}>
                  <div>
                    <h4>ABV</h4>
                    <small>Abuja (ABV)</small>
                  </div>
                  <div className={styles.flightArrowLine}>
                    <span>35 mins</span>
                    <div className={styles.dashLine}></div>
                    <span className={styles.nonstopText}>Direct Scheduled</span>
                  </div>
                  <div>
                    <h4>JOS</h4>
                    <small>Yakubu Gowon</small>
                  </div>
                </div>
                <div className={styles.airlineDetailsRow}>
                  <strong>ValueJet / MaxAir</strong>
                  <span className={styles.flightTimes}>09:15 AM Depart</span>
                </div>
                <div className={styles.routeFooter}>
                  <div>
                    <small className={styles.startingFrom}>Starting from</small>
                    <div className={styles.routePrice}>₦48,500</div>
                  </div>
                  <button type="button" className={styles.selectRouteBtnOrange}>Select →</button>
                </div>
              </div>

              <div className={styles.routeCard}>
                <div className={styles.routeCardTop}>
                  <span className={styles.badgeDark}>Overland Connect</span>
                  <small>🧳 Custom Direct</small>
                </div>
                <div className={styles.routeAirports}>
                  <div>
                    <h4>KAN</h4>
                    <small>Kano (KAN)</small>
                  </div>
                  <div className={styles.flightArrowLine}>
                    <span>45 mins</span>
                    <div className={styles.dashLine}></div>
                    <span className={styles.nonstopText}>Eastern Route</span>
                  </div>
                  <div>
                    <h4>JOS</h4>
                    <small>Yakubu Gowon</small>
                  </div>
                </div>
                <div className={styles.airlineDetailsRow}>
                  <strong>Overland / Charter</strong>
                  <span className={styles.flightTimes}>02:10 PM Depart</span>
                </div>
                <div className={styles.routeFooter}>
                  <div>
                    <small className={styles.startingFrom}>Starting from</small>
                    <div className={styles.routePrice}>₦62,000</div>
                  </div>
                  <button type="button" className={styles.selectRouteBtn}>Select →</button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* SECTION 3: LIVE FLIGHT INFORMATION */}
      <section className={styles.radarSection}>
        <div className={styles.radarHeader}>
          <div>
            <span className={styles.sectionSubtitle}>LIVE FLIGHT STATUS • YAKUBU GOWON AIRPORT</span>
            <h3>Today’s Flights at Yakubu Gowon Airport (JOS)</h3>
          </div>
          <div className={styles.radarTabs}>
            <button
              type="button"
              className={`${styles.radarTabBtn} ${flightTab === "arrivals" ? styles.radarTabActive : ""}`}
              onClick={() => handleFlightTabChange("arrivals")}
            >
              📥 Arrivals (Today)
            </button>
            <button
              type="button"
              className={`${styles.radarTabBtn} ${flightTab === "departures" ? styles.radarTabActive : ""}`}
              onClick={() => handleFlightTabChange("departures")}
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
                <th>Origin / Dest</th>
                <th>Sched. Time</th>
                <th>Terminal / Gate</th>
                <th>Status</th>
                <th>Radar Status</th>
              </tr>
            </thead>
            <tbody>
              {flightsStatus.length > 0 ? (
                flightsStatus.map((flight, idx) => (
                  <tr key={idx}>
                    <td><strong>{flight.flightNumber}</strong></td>
                    <td>{flight.airline}</td>
                    <td>{flight.originAirport} → {flight.destinationAirport}</td>
                    <td>{new Date(flight.scheduledDeparture).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>{flight.terminal || "Main"} • {flight.gate || "Gate 01"}</td>
                    <td>
                      <span className={`${styles.statusPill} ${styles.landed}`}>{flight.status}</span>
                    </td>
                    <td>
                      <button type="button" className={styles.trackRouteBtn} onClick={() => alert(`Live tracking active for ${flight.flightNumber}`)}>
                        Track Route ↗
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  <tr>
                    <td><strong>P4 7128</strong></td>
                    <td>Air Peace</td>
                    <td>Abuja (ABV)</td>
                    <td>09:15 AM <br/><small className={styles.estTime}>Est. 09:20 AM</small></td>
                    <td>Main Terminal • Gate 01</td>
                    <td><span className={`${styles.statusPill} ${styles.landed}`}>Landed / On Time</span></td>
                    <td><button type="button" className={styles.trackRouteBtn}>Track Route ↗</button></td>
                  </tr>
                  <tr>
                    <td><strong>VK 204</strong></td>
                    <td>ValueJet</td>
                    <td>Lagos (LOS)</td>
                    <td>12:15 PM <br/><small className={styles.estTime}>Est. 12:40 PM</small></td>
                    <td>Main Terminal • Gate 02</td>
                    <td><span className={`${styles.statusPill} ${styles.approaching}`}>Approaching / Final</span></td>
                    <td><button type="button" className={styles.trackRouteBtn}>Track Route ↗</button></td>
                  </tr>
                  <tr>
                    <td><strong>P4 7129</strong></td>
                    <td>Air Peace</td>
                    <td>Abuja (ABV)</td>
                    <td>04:20 PM <br/><small className={styles.estTime}>Scheduled Departure</small></td>
                    <td>Main Terminal • Gate 02</td>
                    <td><span className={`${styles.statusPill} ${styles.scheduled}`}>Scheduled</span></td>
                    <td><button type="button" className={styles.trackRouteBtn}>Track Route ↗</button></td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
        <div className={styles.radarFooterNote}>
          <span>* CLEAR VISIBILITY: 10km • SURFACE WIND 08 KTS • TEMPERATURE 19°C (FAVORABLE FLIGHT CONDITIONS)</span>
          <span>Radar telemetry updates automatically every 60s</span>
        </div>
      </section>

      {/* SECTION 4: GROUND LOGISTICS & AIRPORT TRANSFERS */}
      <section className={styles.logisticsSection}>
        <span className={styles.sectionSubtitle}>GROUND LOGISTICS & GUIDE</span>
        <h3>Yakubu Gowon Airport, Heipang Ground Transfers</h3>
        <p className={styles.sectionDesc}>
          Seamless arrival experience from landing at Heipang (JOS) to Rayfield, Jos City, and Plateau Resort centres.
        </p>

        <div className={styles.logisticsGrid}>
          <div className={styles.logisticsCard}>
            <div className={styles.logisticsHeaderRow}>
              <div className={styles.logisticsIcon}>📍</div>
              <div>
                <h4>Location & Distance</h4>
              </div>
            </div>
            <p>
              Situated 35km southwest of City Centre in historic Heipang. A picturesque 35-minute drive along high-grade dual-carriageway with zero gridlock and scenic rocky vistas.
            </p>
            <span className={styles.logisticsTag}>📍 Google Route: 35 mins (verified)</span>
          </div>

          <div className={styles.logisticsCard}>
            <div className={styles.logisticsHeaderRow}>
              <div className={styles.logisticsIcon}>🚐</div>
              <div>
                <h4>Official Jos Pulse Shuttles</h4>
              </div>
              <span className={styles.prebookBadge}>PRE-BOOK DISCOUNT</span>
            </div>
            <p>
              Pre-book verified air-conditioned airport taxis and direct transfers directly to Rayfield resort zones, hotel hubs, and central Jos City.
            </p>

            {/* Shuttle Form using setShuttleName and setShuttleEmail */}
            <form onSubmit={handleShuttleSubmit} className={styles.shuttleForm}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "0.5rem" }}>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  value={shuttleName} 
                  onChange={(e) => setShuttleName(e.target.value)} 
                  required 
                  style={{ padding: "0.4rem", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "0.8rem", color: "#0f172a" }} 
                />
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  value={shuttleEmail} 
                  onChange={(e) => setShuttleEmail(e.target.value)} 
                  required 
                  style={{ padding: "0.4rem", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "0.8rem", color: "#0f172a" }} 
                />
              </div>
              <div className={styles.shuttlePriceRow}>
                <div>
                  <small>Flat Rate</small>
                  <div className={styles.shuttlePrice}>₦7,500 <small>/ pax</small></div>
                </div>
                <button type="submit" className={styles.bookShuttleBtn}>Book Shuttle</button>
              </div>
              {shuttleRef && <small className={styles.successMsg}>Ref: {shuttleRef}</small>}
            </form>
          </div>

          <div className={styles.logisticsCard}>
            <div className={styles.logisticsHeaderRow}>
              <div className={styles.logisticsIcon}>☕</div>
              <div>
                <h4>Arrival Amenities & Lounge</h4>
              </div>
            </div>
            <p>
              Enjoy newly modernized air-conditioned VIP lounges, fast-track baggage carousels, Plateau State Tourism visitor desk, craft shops, and complimentary coffee.
            </p>
            {/* amenities state mapped safely here */}
            {amenities.length > 0 ? (
              amenities.slice(0, 1).map(amenity => (
                <span key={amenity._id} className={styles.logisticsTag}>
                  ☕ {amenity.name} - {amenity.location}
                </span>
              ))
            ) : (
              <span className={styles.logisticsTag}>☕ Plateau Coffee Bar: Stall 04 in Terminal</span>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 5: COLD-WEATHER & CONCIERGE BANNER */}
      <section className={styles.bottomPromoBanner}>
        <div className={styles.promoContent}>
          <span className={styles.badgePromo}> Highland Elevation Notice: 1,280 Meters</span>
          <h2>Pack a Light Jacket: Jos is Nigeria’s Coldest Aviation Hub</h2>
          <p>
            Due to high altitude, temperatures typically average between 18°C to 24°C year-round. October through March provides clear, crisp visibility for spectacular scenic views of the monoliths during descent.
          </p>
          <div className={styles.promoBulletGrid}>
            <span>✔️ Zero-fog ground drops during dry season</span>
            <span>✔️ Spectacular left-side window views of monoliths</span>
            <span>✔️ Quick 55-minute passage from Lagos</span>
            <span>✔️ Direct highway access with zero police gridlock</span>
          </div>
        </div>

        <div className={styles.promoConciergeCard}>
          <div className={styles.conciergeIconHeader}>
            <span className={styles.headsetIcon}>🎧</span>
            <div>
              <h4>Need Concierge Support?</h4>
              <p>Personalized & group air-ticketing</p>
            </div>
          </div>
          
          {/* Concierge Form using setConciergeName, setConciergeEmail, and setConciergeMsg */}
          <form onSubmit={handleConciergeSubmit} className={styles.conciergeForm}>
            <input 
              type="text" 
              placeholder="Name" 
              value={conciergeName} 
              onChange={(e) => setConciergeName(e.target.value)} 
              required 
              style={{ padding: "0.4rem", background: "#1c2541", border: "1px solid #334155", color: "#fff", borderRadius: "4px", fontSize: "0.8rem" }} 
            />
            <input 
              type="email" 
              placeholder="Email" 
              value={conciergeEmail} 
              onChange={(e) => setConciergeEmail(e.target.value)} 
              required 
              style={{ padding: "0.4rem", background: "#1c2541", border: "1px solid #334155", color: "#fff", borderRadius: "4px", fontSize: "0.8rem" }} 
            />
            <textarea 
              placeholder="How can we assist?" 
              value={conciergeMsg} 
              onChange={(e) => setConciergeMsg(e.target.value)} 
              required 
              style={{ padding: "0.4rem", background: "#1c2541", border: "1px solid #334155", color: "#fff", borderRadius: "4px", height: "45px", fontSize: "0.8rem" }} 
            />
            <button type="submit" className={styles.conciergeChatBtn}>
              Connect with Airport Concierge
            </button>
            {conciergeSuccess && <small className={styles.successMsg}>Enquiry submitted successfully!</small>}
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}