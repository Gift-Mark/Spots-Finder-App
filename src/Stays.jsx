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

export default function StaysPage() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("Jos, Plateau State");
  const [checkIn, setCheckIn] = useState("2026-11-18");
  const [checkOut, setCheckOut] = useState("2026-11-20");
  const [guests, setGuests] = useState("2 Adults • 1 Room");
  const [propertyType, setPropertyType] = useState("All accommodation");
  
  const [activeCategory, setActiveCategory] = useState("all");
  
  // All state variables actively read and rendered
  const [accommodations, setAccommodations] = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [zones, setZones] = useState([]); // Now mapped dynamically in Section 5
  const [faqs, setFaqs] = useState([]);
  const [travelContent, setTravelContent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    async function loadStaysData() {
      try {
        setLoading(true);
        const [accRes, featRes, zoneRes, faqRes, travelRes] = await Promise.all([
          fetchAccommodations({ category: activeCategory }),
          fetchFeaturedAccommodations(),
          fetchAccommodationZones(),
          fetchFAQs(),
          fetchTravelContent("highland-climate-guide")
        ]);

        if (accRes?.success) setAccommodations(accRes.data);
        if (featRes?.success) setFeaturedListings(featRes.data);
        if (zoneRes?.success) setZones(zoneRes.data);
        if (faqRes?.success) setFaqs(faqRes.data);
        if (travelRes?.success) setTravelContent(travelRes.data);
      } catch (err) {
        console.error("Failed to load stays portal data:", err);
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

  return (
    <div className={styles.staysPageContainer}>
      <Header />

      {/* EXISTING HERO REUSED */}
      <HeroSection 
        title="Boutique Lodges, Mountain Chalets & Highland Stays in Jos"
        subtitle="Experience mediterranean-weather, panoramic giant-monoliths, exquisite villas, and world-class Plateau hospitality."
        placeholder="Search neighborhood, landmark, or hotel name..."
        heroImage="/images/stays-hero.jpg"
        filterPills={[
          { id: "stays", label: "Stays" },
          { id: "golf", label: "Golf" },
          { id: "festivals", label: "Festivals" },
          { id: "dining", label: "Dining" },
          { id: "nightlife", label: "Nightlife" },
          { id: "explore", label: "Explore" },
        ]}
      />

      {/* LOADING STATE */}
      {loading && (
        <div style={{ textAlign: "center", padding: "1rem", color: "#f97316", fontWeight: "bold" }}>
          Loading live Plateau inventory...
        </div>
      )}

      {/* SECTION 1: ACCOMMODATION SEARCH PANEL */}
      <section className={styles.searchPanelSection}>
        <div className={styles.searchPanelCard}>
          <form onSubmit={handleSearchSubmit} className={styles.searchPanelGrid}>
            <div className={styles.searchField}>
              <label>LOCATION & NEIGHBOURHOOD</label>
              <input 
                type="text" 
                value={destination} 
                onChange={(e) => setDestination(e.target.value)} 
                placeholder="Rayfield, Lamingo, Jos City Centre..."
                required
              />
            </div>

            <div className={styles.searchField}>
              <label>CHECK-IN</label>
              <input 
                type="date" 
                value={checkIn} 
                onChange={(e) => setCheckIn(e.target.value)} 
                required
              />
            </div>

            <div className={styles.searchField}>
              <label>CHECK-OUT</label>
              <input 
                type="date" 
                value={checkOut} 
                onChange={(e) => setCheckOut(e.target.value)} 
                required
              />
            </div>

            <div className={styles.searchField}>
              <label>GUESTS & ROOMS</label>
              <input 
                type="text" 
                value={guests} 
                onChange={(e) => setGuests(e.target.value)} 
                placeholder="2 Adults, 1 Room"
                required
              />
            </div>

            <div className={styles.searchField}>
              <label>PROPERTY TYPE</label>
              <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                <option value="All accommodation">All accommodation</option>
                <option value="Hotels">Hotels</option>
                <option value="Resorts">Resorts</option>
                <option value="Chalets">Chalets</option>
                <option value="Lodges">Lodges</option>
                <option value="Serviced Apartments">Serviced Apartments</option>
              </select>
            </div>

            <button type="submit" className={styles.searchSubmitBtn}>
              Search Stays →
            </button>
          </form>

          <div className={styles.searchPerksRow}>
            <span>📍 Rayfield, Lamingo, & GRA Access</span>
            <span>🛡️ Verified Booking Guarantee</span>
            <span>💵 Direct Rates With No Hidden Fees</span>
            <span>🌄 Plateau Highland Views and Pure Air</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: CATEGORY & QUICK FILTER NAVIGATION */}
      <section className={styles.categoryFilterSection}>
        <div className={styles.categoryPillsScroll}>
          {[
            { id: "all", label: "All accommodation" },
            { id: "highland-lodges", label: "Highland lodges" },
            { id: "lakeside-stays", label: "Lakeside stays" },
            { id: "mountain-chalets", label: "Mountain chalets" },
            { id: "luxury-retreats", label: "Luxury retreats" },
            { id: "city-centre-hotels", label: "City-centre hotels" },
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
          <span>Showing: <strong>{activeCategory.replace("-", " ").toUpperCase()}</strong></span>
        </div>
      </section>

      {/* SECTION 3: CURATED HIGHLAND SANCTUARIES */}
      <section className={styles.curatedSanctuariesSection}>
        <div className={styles.sectionHeaderRow}>
          <div>
            <span className={styles.sectionEyebrow}>CURATED HIGHLAND SANCTUARIES</span>
            <h2>Curated Highland Sanctuaries</h2>
            <p>Handpicked escapes featuring mountain views, private fireplaces, and serene Plateau retreats.</p>
          </div>
          <Link to="/stays/all" className={styles.seeAllLink}>View all verified properties →</Link>
        </div>

        <div className={styles.sanctuariesGrid}>
          {featuredListings.length > 0 ? (
            featuredListings.slice(0, 1).map((feat) => (
              <div key={feat._id} className={styles.largeSanctuaryCard}>
                <div className={styles.cardImgWrapper}>
                  <span className={styles.badgeFeatured}>FEATURED RESORT</span>
                  <img src={feat.images?.[0]?.url || "/images/rayfield-grand.jpg"} alt={feat.name} loading="lazy" />
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.ratingRow}>
                    <span>⭐ {feat.rating} ({feat.reviewCount} reviews)</span>
                    <span className={styles.priceTag}>From ₦{feat.startingFare?.toLocaleString()} / night</span>
                  </div>
                  <h3>{feat.name}</h3>
                  <p>{feat.description}</p>
                  <div className={styles.amenitiesIconsRow}>
                    {feat.amenities?.slice(0, 4).map((am, idx) => (
                      <span key={idx}>✨ {am}</span>
                    ))}
                  </div>
                  <div className={styles.cardActionRow}>
                    <span className={styles.verifiedNotice}>✔ Verified luxury property with personal butler.</span>
                    <Link to={`/stays/${feat.slug}`} className={styles.detailsBtn}>View Lodge</Link>
                    <Link to={`/stays/${feat.slug}/book`} className={styles.bookActionBtn}>Check availability</Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.largeSanctuaryCard}>
              <div className={styles.cardImgWrapper}>
                <span className={styles.badgeFeatured}>FEATURED RESORT</span>
                <img src="/images/rayfield-grand.jpg" alt="Rayfield Grand Waterside Resort & Chalets" loading="lazy" />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.ratingRow}>
                  <span>⭐ 4.9 (112 reviews)</span>
                  <span className={styles.priceTag}>From ₦145,000 / night</span>
                </div>
                <h3>Rayfield Grand Waterside Resort & Chalets</h3>
                <p>Perched at 1,280m above sea level with private stone fireplaces, panoramic lake views, and world-class Plateau hospitality.</p>
                <div className={styles.amenitiesIconsRow}>
                  <span>🧳 Market Pantry & Spa</span>
                  <span>📶 Starlink WiFi</span>
                  <span>🔥 Stone Fireplace</span>
                  <span>🏊 Heated Pool</span>
                </div>
                <div className={styles.cardActionRow}>
                  <span className={styles.verifiedNotice}>✔ Verified luxury property with personal butler.</span>
                  <Link to="/stays/rayfield-grand-waterside" className={styles.detailsBtn}>View Lodge</Link>
                  <Link to="/stays/rayfield-grand-waterside/book" className={styles.bookActionBtn}>Check availability</Link>
                </div>
              </div>
            </div>
          )}

          {/* Right Two Stacked Cards */}
          <div className={styles.stackedSanctuariesCol}>
            <div className={styles.smallSanctuaryCard}>
              <img src="/images/hill-station.jpg" alt="Hill Station Heritage Hotel" />
              <div className={styles.smallCardBody}>
                <div className={styles.ratingRow}>
                  <span>⭐ 4.7 (89)</span>
                  <span className={styles.priceTagSmall}>₦65,000 / night</span>
                </div>
                <h4>Hill Station Heritage Hotel & Colonial Suites</h4>
                <p>The grand dame of Jos tourism. 1930s stone architecture, pristine gardens, cozy rooms, and historic charm.</p>
                <Link to="/stays/hill-station-heritage" className={styles.smallDetailsBtn}>View Suites</Link>
              </div>
            </div>

            <div className={styles.smallSanctuaryCard}>
              <img src="/images/lamingo-lodge.jpg" alt="Lamingo Highland Lodge" />
              <div className={styles.smallCardBody}>
                <div className={styles.ratingRow}>
                  <span>⭐ 4.8 (64)</span>
                  <span className={styles.priceTagSmall}>₦85,000 / night</span>
                </div>
                <h4>Lamingo Highland Lodge & Spa</h4>
                <p>Overlooking the sparkling Lamingo Lake dam with private boat access and cool evening mountain breezes.</p>
                <Link to="/stays/lamingo-highland-lodge" className={styles.smallDetailsBtn}>View Lodge</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: MORE VERIFIED PLATEAU ACCOMMODATIONS */}
      <section className={styles.verifiedAccommodationsSection}>
        <div className={styles.sectionHeaderRow}>
          <div>
            <span className={styles.sectionEyebrow}>VERIFIED INVENTORY</span>
            <h2>More Verified Plateau Accommodations</h2>
            <p>Discover handpicked options across Lamingo, Rayfield, GRA, and the Plateau corridor.</p>
          </div>
          <div className={styles.carouselControls}>
            <button type="button" aria-label="Previous properties">‹</button>
            <button type="button" aria-label="Next properties">›</button>
          </div>
        </div>

        <div className={styles.fourCardGrid}>
          {accommodations.length > 0 ? (
            accommodations.map((stay) => (
              <div key={stay._id} className={styles.standardStayCard}>
                <div className={styles.stdImgBox}>
                  <span className={styles.stdBadge}>⭐ {stay.rating || 4.7}</span>
                  <img src={stay.images?.[0]?.url || "/images/tin-city.jpg"} alt={stay.name} loading="lazy" />
                </div>
                <div className={styles.stdBody}>
                  <h4>{stay.name}</h4>
                  <p>📍 {stay.neighborhood || "Jos Central"}</p>
                  <div className={styles.stdPriceRow}>
                    <div>
                      <small>Starting from</small>
                      <strong>₦{stay.startingFare?.toLocaleString()} <small>/ night</small></strong>
                    </div>
                    <Link to={`/stays/${stay.slug}`} className={styles.stdReserveBtn}>Reserve</Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            [
              { name: "The Tin City Boutique Hotel", area: "Jos City Centre", price: "₦55,000", rating: "4.6", img: "/images/tin-city.jpg" },
              { name: "Plateau Pine Valley Chalets", area: "Lamingo Golf Course", price: "₦72,000", rating: "4.9", img: "/images/pine-valley.jpg" },
              { name: "Rayfield Garden Villas", area: "Rayfield Resort", price: "₦95,000", rating: "4.8", img: "/images/rayfield-villas.jpg" },
              { name: "Vanguard Pine Highland", area: "GRA Jos", price: "₦48,000", rating: "4.5", img: "/images/vanguard-pine.jpg" },
            ].map((item, idx) => (
              <div key={idx} className={styles.standardStayCard}>
                <div className={styles.stdImgBox}>
                  <span className={styles.stdBadge}>⭐ {item.rating}</span>
                  <img src={item.img} alt={item.name} loading="lazy" />
                </div>
                <div className={styles.stdBody}>
                  <h4>{item.name}</h4>
                  <p>📍 {item.area}</p>
                  <div className={styles.stdPriceRow}>
                    <div>
                      <small>Starting from</small>
                      <strong>{item.price} <small>/ night</small></strong>
                    </div>
                    <Link to="/stays/details" className={styles.stdReserveBtn}>Reserve</Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* SECTION 5: PLATEAU ACCOMMODATION ZONES AND MAP (Now actively mapping `zones`) */}
      <section className={styles.zonesAndMapSection}>
        <div className={styles.sectionHeaderRow}>
          <div>
            <span className={styles.sectionEyebrow}>GEOGRAPHIC DIRECTORY</span>
            <h2>Choose Where to Stay in Jos</h2>
            <p>From peaceful Lakeside enclaves to high-altitude ridge escapes, each district offers distinct weather and atmosphere.</p>
          </div>
        </div>

        <div className={styles.zonesMapGrid}>
          {/* Left Column: Dynamic Zone List Mapping `zones` state */}
          <div className={styles.zonesListCol}>
            {zones.length > 0 ? (
              zones.map((zone, i) => (
                <div key={zone._id || i} className={styles.zoneListItem}>
                  <span className={styles.zoneRank}>{`0${i + 1}`}</span>
                  <div>
                    <h4>{zone.name}</h4>
                    <p>{zone.description}</p>
                    <small className={styles.zoneCount}>Verified District</small>
                  </div>
                </div>
              ))
            ) : (
              [
                { rank: "01", name: "Rayfield & GRA", desc: "Historic resort villas, golf courses, serene lake nightlife.", count: "Crispan Suites & Rayfield Holiday Resort" },
                { rank: "02", name: "Tudun Wada & City Centre", desc: "Central commercial district close to historic landmarks.", count: "Hill Station Hotel" },
                { rank: "03", name: "Lamingo Dam Corridor", desc: "Highland lakeside views and cool evening mountain breezes.", count: "Lamingo Lodges" },
              ].map((zone, i) => (
                <div key={i} className={styles.zoneListItem}>
                  <span className={styles.zoneRank}>{zone.rank}</span>
                  <div>
                    <h4>{zone.name}</h4>
                    <p>{zone.desc}</p>
                    <small className={styles.zoneCount}>{zone.count}</small>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Column: Live OpenStreetMap */}
          <div className={styles.mapContainerCol}>
            <AccommodationMap properties={accommodations} height="100%" />
          </div>
        </div>
      </section>

      {/* SECTION 6: HIGHLAND CLIMATE & TRAVEL INFORMATION BANNER */}
      <section className={styles.climatePromoBanner}>
        <div className={styles.promoContentLeft}>
          <span className={styles.promoBadge}>❄️ HIGHLAND ELEVATION 1,280 METERS</span>
          <h2>{travelContent?.title || "The Highland Difference: Why Jos Nights Feel Like Spring in Europe"}</h2>
          <p>
            {travelContent?.description || "Pillowed under clear blue skies, familiar to comfortable average temperatures of 18°C–24°C, and pure mountain air, Jos is unmatched for refreshing getaways."}
          </p>
          <div className={styles.climateMetricsGrid}>
            <div className={styles.metricCard}>
              <strong>18°C – 24°C</strong>
              <span>Semi-temperate, daytime average</span>
            </div>
            <div className={styles.metricCard}>
              <strong>1,280m</strong>
              <span>High-altitude sub-equatorial elevation</span>
            </div>
            <div className={styles.metricCard}>
              <strong>100% Fresh</strong>
              <span>Aerosol-free unpolluted sanctuary breeze</span>
            </div>
          </div>
          <div className={styles.promoActionsRow}>
            <Link to="/culture" className={styles.primaryPromoBtn}>Explore Jos Travel Guide</Link>
            <Link to="/guides/accommodation.pdf" className={styles.secondaryPromoBtn}>Download Accommodation Guide (PDF)</Link>
          </div>
        </div>

        <div className={styles.promoCardRight}>
          <div className={styles.cardHeaderFlex}>
            <span>🌤️ Visitor Air & Clothing Advisory</span>
          </div>
          <ul className={styles.adviceList}>
            <li>✔️ Pack a warm jacket or sweater for cool evening mountain drops.</li>
            <li>✔️ Dry season (Oct - March) offers crystal clear vistas of rock formations.</li>
            <li>✔️ All verified properties equipped with cozy fireplaces or heaters.</li>
          </ul>
        </div>
      </section>

      {/* SECTION 7: FREQUENTLY ASKED STAYS QUESTIONS */}
      <section className={styles.faqSection}>
        <div className={styles.faqHeader}>
          <span className={styles.sectionEyebrow}>KNOWLEDGE BASE</span>
          <h2>Frequently Asked Stays Questions</h2>
          <p>Everything you need to know about booking and staying in the Plateau State.</p>
        </div>

        <div className={styles.faqAccordionList}>
          {faqs.length > 0 ? (
            faqs.map((item, index) => (
              <div key={item._id || index} className={styles.faqAccordionItem}>
                <button 
                  type="button" 
                  className={styles.faqQuestionBtn}
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                >
                  <span>{item.question}</span>
                  <span>{openFaqIndex === index ? '−' : '+'}</span>
                </button>
                {openFaqIndex === index && (
                  <div className={styles.faqAnswerBox}>
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            [
              { q: "Do I need to book in advance?", a: "Yes! Due to high demand during weekend retreats and holiday seasons, advance booking ensures your preferred chalet or lakeside suite is secured." },
              { q: "Are airport-pickup services available?", a: "Yes. The majority of our boutique lodges and luxury resorts offer direct chauffeur transfers from Yakubu Gowon Airport in Heipang (JOS) straight to Rayfield or Jos City Centre." },
              { q: "What is the temperature and climate like at night in Jos?", a: "Every property partnered with the 'Jos Pulse Verified' badge maintains individual room heating or stone fireplaces to combat crisp evening drops down to 14°C." },
              { q: "What payment methods are supported?", a: "We support secure card payments, bank transfers, and direct Paystack/Flutterwave escrow processing to guarantee safe booking confirmations." },
              { q: "How do I know a property has been verified?", a: "Verified properties undergo physical inspection by Jos Pulse operations staff for safety, amenities, clean water supply, and verified power backup." }
            ].map((item, index) => (
              <div key={index} className={styles.faqAccordionItem}>
                <button 
                  type="button" 
                  className={styles.faqQuestionBtn}
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                >
                  <span>{item.q}</span>
                  <span>{openFaqIndex === index ? '−' : '+'}</span>
                </button>
                {openFaqIndex === index && (
                  <div className={styles.faqAnswerBox}>
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}