import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../src/Components/headerNav.jsx";
import HeroSection from "../src/Components/HeroSection.jsx";
import Footer from "../src/Components/Footer.jsx";
import AccommodationMap from "../src/Components/AccomodationMap.jsx";
import styles from "../src/CSS/StaysPage.module.css";
import { 
  fetchAccommodations, 
  fetchFeaturedAccommodations, 
  fetchAccommodationZones, 
  fetchFAQs, 
  fetchTravelContent 
} from "../src/services/api.js";

// Local dataset imports for robust fallbacks
import { JOS_STAYS_DIRECTORY } from "../src/data/accomodationData.js";
import { JOS_LOUNGES } from "../src/data/loungesData.js";

export default function StaysPage() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("Jos, Plateau State");
  const [checkIn, setCheckIn] = useState("2026-11-18");
  const [checkOut, setCheckOut] = useState("2026-11-20");
  const [guests, setGuests] = useState("2 Adults • 1 Room");
  const [propertyType, setPropertyType] = useState("All accommodation");
  const [showAllSanctuaries, setShowAllSanctuaries] = useState(false);
  
  const [activeCategory, setActiveCategory] = useState("all");
  
  const [accommodations, setAccommodations] = useState([]);
  const [zones, setZones] = useState([]); 
  const [faqs, setFaqs] = useState([]); 
  const [travelContent, setTravelContent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const [selectedZoneKey, setSelectedZoneKey] = useState("rayfield-gra");

  // Comprehensive list of FAQs
  const DEFAULT_JOS_FAQS = [
    {
      question: "Do I need to book my stay in advance?",
      answer: "Yes! Due to high demand during weekend retreats, tourism festivals, and holiday seasons in Plateau State, booking in advance ensures your preferred room category or mountain chalet is secured."
    },
    {
      question: "Are airport pickup and local transport services available?",
      answer: "Yes. The majority of our partner hotels, boutique lodges, and luxury resorts offer direct chauffeur transfers from Yakubu Gowon Airport in Heipang (JOS) straight to Rayfield, GRA, or Jos City Centre."
    },
    {
      question: "What is the climate like at night in Jos, and do rooms have heating?",
      answer: "Jos enjoys a high-altitude highland climate with crisp, refreshing evening temperatures dropping to 14°C–18°C. Properties listed on Jos Pulse are equipped with warm duvets, water heaters, and select resort chalets feature stone fireplaces."
    },
    {
      question: "What are the standard check-in and check-out times?",
      answer: "Standard check-in across most Jos properties is 2:00 PM onward, and check-out is by 11:00 AM or 12:00 PM. Early check-in or late check-out can usually be arranged directly with the front desk."
    },
    {
      question: "How do I modify or cancel my reservation?",
      answer: "You can view and manage your reservations directly from your User Dashboard under the 'Bookings' tab. Free cancellation policies depend on the individual venue's notice window."
    },
    {
      question: "Is electricity and security guaranteed at the listed properties?",
      answer: "All verified venues listed on Jos Pulse feature 24/7 power backup systems (solar or generator) as well as round-the-clock perimeter security and guest support."
    }
  ];

  useEffect(() => {
    async function loadStaysData() {
      try {
        setLoading(true);
        const [accRes, zoneRes, faqRes, travelRes] = await Promise.all([
          fetchAccommodations({ category: activeCategory }),
          fetchFeaturedAccommodations(),
          fetchAccommodationZones(),
          fetchFAQs(),
          fetchTravelContent("highland-climate-guide")
        ]);

        if (accRes?.success && accRes.data.length > 0) {
          setAccommodations(accRes.data);
        } else {
          setAccommodations([
            ...JOS_STAYS_DIRECTORY.traditionalHotels,
            ...JOS_STAYS_DIRECTORY.boutiqueResorts,
            ...JOS_STAYS_DIRECTORY.servicedApartments
          ]);
        }

        if (zoneRes?.success && zoneRes.data.length > 0) {
          setZones(zoneRes.data);
        } else {
          setZones([
            { name: "Rayfield & GRA", description: "Historic resort villas, golf courses, and serene lake environments." },
            { name: "Tudun Wada & City Centre", description: "Central commercial district close to historic landmarks." },
            { name: "Lamingo & Lamingo Dam Corridor", description: "Scenic high-altitude lakeside views established around the 1973 reservoir." }
          ]);
        }

        // Use backend FAQs if there are at least 3 items, otherwise use the full 6-item default list
        if (faqRes?.success && Array.isArray(faqRes.data) && faqRes.data.length >= 3) {
          setFaqs(faqRes.data);
        } else {
          setFaqs(DEFAULT_JOS_FAQS);
        }

        if (travelRes?.success) setTravelContent(travelRes.data);
      } catch (err) {
        console.warn("API offline, utilizing local Jos fallback data:", err);
        setAccommodations([
          ...JOS_STAYS_DIRECTORY.traditionalHotels,
          ...JOS_STAYS_DIRECTORY.boutiqueResorts,
          ...JOS_STAYS_DIRECTORY.servicedApartments
        ]);
        setZones([
          { name: "Rayfield & GRA", description: "Historic resort villas, golf courses, and serene lake environments." },
          { name: "Tudun Wada & City Centre", description: "Central commercial district close to historic landmarks." }
        ]);
        setFaqs(DEFAULT_JOS_FAQS);
      } finally {
        setLoading(false);
      }
    }
    loadStaysData();
  }, [activeCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/stays/search?destination=${encodeURIComponent(destination)}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${encodeURIComponent(guests)}&type=${encodeURIComponent(propertyType)}`);
  };

  const handleToggleSanctuaries = (e) => {
    e.preventDefault();
    setShowAllSanctuaries(prev => !prev);
    
    if (showAllSanctuaries) {
      const sectionHeader = document.getElementById("sanctuaries-section");
      if (sectionHeader) {
        sectionHeader.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const filteredAccommodations = accommodations.filter(stay => {
    if (activeCategory === "all") return true;
    const stayCat = (stay.category || stay.propertyType || "").toLowerCase();
    const targetCat = activeCategory.toLowerCase();
    return stayCat.includes(targetCat) || targetCat.includes(stayCat);
  });

  return (
    <div className={styles.staysPageContainer}>
      <Header />

      <HeroSection 
        title="Boutique Lodges, Mountain Chalets & Highland Stays in Jos"
        subtitle="Experience mediterranean-weather, panoramic giant-monoliths, exquisite villas, and world-class Plateau hospitality."
        placeholder="Search neighborhood, landmark, or hotel name..."
        heroImage="/images/Arcadia.jpg"
        filterPills={[
          { id: "stays", label: "Stays" },
          { id: "golf", label: "Golf" },
          { id: "festivals", label: "Festivals" },
          { id: "dining", label: "Dining" },
          { id: "nightlife", label: "Nightlife" },
          { id: "explore", label: "Explore" },
        ]}
      />

      {loading && (
        <div style={{ textAlign: "center", padding: "1rem", color: "#f97316", fontWeight: "bold" }}>
          Loading verified Jos inventory...
        </div>
      )}

      {/* SECTION 1: SEARCH PANEL */}
      <section className={styles.searchPanelSection}>
        <div className={styles.searchPanelCard}>
          <form onSubmit={handleSearchSubmit} className={styles.searchPanelGrid}>
            <div className={styles.searchField}>
              <label>LOCATION & NEIGHBOURHOOD</label>
              <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} required />
            </div>
            <div className={styles.searchField}>
              <label>CHECK-IN</label>
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
            </div>
            <div className={styles.searchField}>
              <label>CHECK-OUT</label>
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
            </div>
            <div className={styles.searchField}>
              <label>GUESTS & ROOMS</label>
              <input type="text" value={guests} onChange={(e) => setGuests(e.target.value)} required />
            </div>
            <div className={styles.searchField}>
              <label>PROPERTY TYPE</label>
              <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                <option value="All accommodation">All accommodation</option>
                <option value="Hotels">Hotels</option>
                <option value="Resorts">Resorts</option>
              </select>
            </div>
            <button type="submit" className={styles.searchSubmitBtn}>Search Stays →</button>
          </form>
        </div>
      </section>

      {/* SECTION 2: CATEGORY & QUICK FILTER NAVIGATION */}
      <section className={styles.categoryFilterSection}>
        <div className={styles.categoryPillsScroll}>
          {[
            { id: "all", label: "All accommodation" },
            { id: "Traditional Hotels", label: "Traditional Hotels" },
            { id: "Boutique Resorts", label: "Boutique Resorts" },
            { id: "Serviced Apartments", label: "Serviced Apartments" },
            { id: "Guest Houses", label: "Guest Houses" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`${styles.categoryPill} ${activeCategory === cat.id ? styles.pillActive : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className={styles.activeFilterNotice}>
          <span>Showing: <strong>{activeCategory.toUpperCase()}</strong></span>
        </div>
      </section>

      {/* SECTION 3: CURATED HIGHLAND SANCTUARIES */}
      <section id="sanctuaries-section" className={styles.curatedSanctuariesSection}>
        <div className={styles.sectionHeaderRow}>
          <div>
            <h2>Curated Lounges</h2>
            <p>Handpicked escapes featuring mountain views, private fireplaces, and serene Plateau retreats.</p>
          </div>
          <a href="#sanctuaries-section" onClick={handleToggleSanctuaries} className={styles.seeAllLink}>
            {showAllSanctuaries ? "Show Less ↑" : "View all verified properties →"}
          </a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", width: "100%" }}>
          {(showAllSanctuaries ? JOS_LOUNGES : JOS_LOUNGES.slice(0, 4)).map((lounge, idx) => (
            <div 
              key={lounge.id || lounge._id || idx} 
              className={styles.smallSanctuaryCard} 
              style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}
            >
              <div style={{ width: "100%", height: "200px", overflow: "hidden", borderRadius: "0.5rem 0.5rem 0 0" }}>
                <img 
                  src={lounge.image} 
                  alt={lounge.name} 
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
                />
              </div>
              <div className={styles.smallCardBody} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "1.25rem" }}>
                <div>
                  <div className={styles.ratingRow} style={{ marginBottom: "0.5rem" }}>
                    <span>⭐ {lounge.starRating || 4.7}</span>
                    <span className={styles.priceTagSmall}>₦{lounge.pricePerNight?.toLocaleString() || "45,000"} / night</span>
                  </div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: "700", margin: "0.25rem 0" }}>{lounge.name}</h4>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0.25rem 0 0.75rem 0" }}>📍 {lounge.neighborhood}</p>
                </div>
                <Link to={`/stays/${lounge.id || lounge.slug}`} className={styles.smallDetailsBtn} style={{ marginTop: "1rem", textAlign: "center" }}>
                  View lounge
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: VERIFIED INVENTORY */}
      <section id="verified-inventory" className={styles.verifiedAccommodationsSection}>
        <div className={styles.sectionHeaderRow}>
          <div>
            <span className={styles.sectionEyebrow}>VERIFIED INVENTORY</span>
            <h2>More Verified Plateau Accommodations</h2>
          </div>
        </div>

        <div className={styles.fourCardGrid}>
          {filteredAccommodations.length > 0 ? (
            filteredAccommodations.map((stay, idx) => (
              <div key={stay.id || stay._id || idx} className={styles.standardStayCard}>
                <div className={styles.stdImgBox}>
                  <span className={styles.stdBadge}>⭐ {stay.starRating || stay.rating || 4.5}</span>
                  <img src={stay.image || stay.images?.[0]?.url || "/images/Trips.jpg"} alt={stay.name} />
                </div>
                <div className={styles.stdBody}>
                  <h4>{stay.name}</h4>
                  <p>📍 {stay.neighborhood || "Jos Central"}</p>
                  <div className={styles.stdPriceRow}>
                    <strong>₦{(stay.pricePerNight || stay.startingFare || 35000)?.toLocaleString()}</strong>
                    <Link to={`/stays/${stay.slug || stay.id}`} className={styles.stdReserveBtn}>Reserve</Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem", color: "#64748b" }}>
              <p>No verified properties found under this category in Jos at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 5: GEOGRAPHIC DIRECTORY & MAP */}
      <section className={styles.zonesAndMapSection}>
        <div className={styles.sectionHeaderRow}>
          <div>
            <span className={styles.sectionEyebrow}>GEOGRAPHIC DIRECTORY</span>
            <h2>Choose Where to Stay in Jos</h2>
          </div>
        </div>

        <div className={styles.zonesMapGrid}>
          <div className={styles.zonesListCol}>
            {zones.map((zone, i) => {
              const zoneKey = zone.name.toLowerCase().includes("rayfield") 
                ? "rayfield-gra" 
                : zone.name.toLowerCase().includes("lamingo") 
                ? "lamingo-dam" 
                : "tudun-wada-central";

              return (
                <div 
                  key={i} 
                  className={styles.zoneListItem}
                  onClick={() => setSelectedZoneKey(zoneKey)}
                  style={{ 
                    cursor: "pointer", 
                    borderColor: selectedZoneKey === zoneKey ? "#f97316" : "#e2e8f0",
                    backgroundColor: selectedZoneKey === zoneKey ? "#fff7ed" : "#fff"
                  }}
                >
                  <span className={styles.zoneRank}>{`0${i + 1}`}</span>
                  <div>
                    <h4>{zone.name}</h4>
                    <p>{zone.description}</p>
                    <small className={styles.zoneCount}>Verified Jos District</small>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.mapContainerCol}>
            <AccommodationMap properties={filteredAccommodations} height="100%" selectedZone={selectedZoneKey} />
          </div>
        </div>
      </section>

      {/* SECTION 6: CLIMATE BANNER */}
      <section className={styles.climatePromoBanner}>
        <div className={styles.promoContentLeft}>
          <span className={styles.promoBadge}>❄️ HIGHLAND ELEVATION 1,280 METERS</span>
          <h2>{travelContent?.title || "The Highland Difference: Why Jos Nights Feel Like Spring in Europe"}</h2>
          <p>{travelContent?.description || "Pillowed under clear blue skies with comfortable average temperatures of 18°C–24°C."}</p>
        </div>
      </section>

      {/* SECTION 7: FAQ ACCORDION */}
      <section className={styles.faqSection} style={{ maxWidth: "900px", margin: "4rem auto", padding: "0 1.5rem" }}>
        <div className={styles.faqHeader} style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span className={styles.sectionEyebrow} style={{ color: "#f97316", fontWeight: "700", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>
            KNOWLEDGE BASE
          </span>
          <h2 style={{ fontSize: "2rem", fontWeight: "800", color: "#0b132b", marginTop: "0.5rem" }}>
            Frequently Asked Stays Questions
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.95rem", marginTop: "0.5rem" }}>
            Everything you need to know about booking, climate, and staying in Jos.
          </p>
        </div>

        <div className={styles.faqAccordionList} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {faqs.map((item, index) => (
            <div 
              key={index} 
              className={styles.faqAccordionItem}
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "0.75rem",
                overflow: "hidden",
                boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                transition: "all 0.2s ease"
              }}
            >
              <button 
                type="button" 
                className={styles.faqQuestionBtn}
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                style={{
                  width: "100%",
                  padding: "1.25rem 1.5rem",
                  background: openFaqIndex === index ? "#fff7ed" : "#ffffff",
                  border: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  textAlign: "left",
                  fontWeight: "700",
                  fontSize: "1rem",
                  color: openFaqIndex === index ? "#c2410c" : "#0b132b"
                }}
              >
                <span>{item.question}</span>
                <span style={{ 
                  fontSize: "1.25rem", 
                  fontWeight: "400", 
                  color: openFaqIndex === index ? "#f97316" : "#64748b",
                  transition: "transform 0.2s ease" 
                }}>
                  {openFaqIndex === index ? '−' : '+'}
                </span>
              </button>

              {openFaqIndex === index && (
                <div 
                  className={styles.faqAnswerBox}
                  style={{
                    padding: "0 1.5rem 1.25rem 1.5rem",
                    background: "#fff7ed",
                    borderTop: "1px solid #ffedd5"
                  }}
                >
                  <p style={{ color: "#475569", fontSize: "0.95rem", lineHeight: "1.6", margin: 0 }}>
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}