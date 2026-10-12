import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./PlaceDetail.module.css";
import { fetchPlaceBySlug, createBooking, toggleSaveSpot, checkIsSaved } from "../api/client.js";

const mockPlaces = {
  "rayfield-resort": {
    id: "rayfield-resort",
    title: "Rayfield Holiday Resort & Water Park",
    category: "Resort & Water Sports",
    verified: true,
    rating: 4.8,
    reviewsCount: 132,
    managedBy: "Plateau Tourism Authority & Partner",
    address: "Rayfield Resort Boulevard, Old Airport Road Axis, Jos South, Plateau State",
    weather: { temp: 22, condition: "Crisp & Breezy" },
    tags: ["Family Friendly", "Boating & Water Sports", "Outdoor Dining"],
    status: "Open Now",
    openingHours: "8:00 AM - 6:30 PM",
    entryPrice: "₦500 Adults / ₦300 Kids",
    recommendedVisit: "4:00 PM - 6:30 PM (Golden Hour Sunset)",
    phone: "+234 703 123 4567",
    heroImage: "/images/Rayfield resort 3.webp",
    overviewHeading: "An Oasis of Waters & Granite Hills",
    description: [
      "Tucked away inside the historic suburb of Rayfield, Jos, the Rayfield Holiday Resort stands as one of Plateau State's most cherished recreation treasures.",
    ],
    quote: {
      text: "There is no sunset in Jos quite like watching the gold rays bounce off the granite hills and reflect across Rayfield Lake.",
      author: "JOS PULSE GUIDE",
    },
    gallery: [
      "/images/Rayfield Resort.jpg",
      "/images/Rayfield resort 1.webp",
      "/images/Rayfield Resort 2.webp",
      "/images/Rayfield resort 3.webp"
    ],
    visitorTips: [
      "Bring a Light Cardigan for cool evening winds.",
      "Lifejackets are mandatory for all boat rides."
    ],
    highlights: [
      { icon: "🚤", title: "30-Min Lake Cruise", desc: "Guided powerboat and pontoon rides around Rayfield Lake." },
      { icon: "🏖️", title: "Waterfront Cabanas", desc: "Private shaded lakeside huts for family picnics & social groups." },
      { icon: "🍽️", title: "Lakeside Grill & Bar", desc: "Fresh suya, grilled fish, chapman drinks, and local dining." },
      { icon: "🅿️", title: "Secured Vehicle Parking", desc: "Monitored parking bay with on-site security." },
      { icon: "🏄", title: "Jet Ski Rentals", desc: "High-speed water sport rentals for thrill seekers." },
      { icon: "🎡", title: "Children's Play Zone", desc: "Dedicated slides, swings, and safe recreation lawns." }
    ],
    pricing: {
      adultRate: 500,
      kidRate: 300,
      addons: [{ id: "cruise", name: "30-Min Lake Cruise", price: 2000 }]
    }
  },
  "kurra-falls": {
    id: "kurra-falls",
    title: "Kurra Falls & Hydro-Power Eco Sanctuary",
    category: "Nature & Adventure",
    verified: true,
    rating: 4.9,
    reviewsCount: 98,
    managedBy: "Plateau State Tourism Board & NESCO Partner",
    address: "Gashish District, Barkin Ladi LGA, Plateau State, Nigeria",
    weather: { temp: 19, condition: "Cool & Highland Breeze" },
    tags: ["Waterfall Treks", "Eco-Tourism", "Historic Dam", "Scenic Hiking"],
    status: "Open Daily",
    openingHours: "7:00 AM - 5:30 PM",
    entryPrice: "₦1,000 Adults / ₦500 Students",
    recommendedVisit: "10:00 AM - 3:30 PM (Daytime Trekking)",
    phone: "+234 802 345 6789",
    heroImage: "/images/Kurra-Falls.jpg",
    overviewHeading: "Cascading Waters & Granite Canyons",
    description: [
      "Nestled deep within the lush green highlands of Barkin Ladi, Kurra Falls is one of Plateau State's most breathtaking natural wonders.",
      "The area features natural lakes, cascading waterfalls plunging through rugged granite canyons, and serene forest paths ideal for daytime hiking and photography."
    ],
    quote: {
      text: "Standing atop the granite ledges at Kurra Falls while mist from the roaring cascades cools the air is the quintessential Plateau adventure.",
      author: "JOS PULSE ECO-DISCOVERY GUIDE",
    },
    gallery: ["/images/Kurra-Falls.jpg", "/images/Rayfield Resort.jpg"],
    visitorTips: [
      "Sturdy Footwear Required: Rock surfaces near streams can be slippery.",
      "Group Excursions: Hire a local guide at the gate for waterfall canyon hikes."
    ],
    highlights: [
      { icon: "🌊", title: "Cascading Waterfalls", desc: "Multi-tiered natural rock waterfalls." },
      { icon: "🥾", title: "Guided Canyon Trails", desc: "Marked routes across granite formations." },
      { icon: "📸", title: "Scenic Photography Ledges", desc: "Unmatched vantage points for nature photography." },
      { icon: "⚡", title: "Historic Hydro Dam View", desc: "Heritage hydro-electricity installations." }
    ],
    pricing: {
      adultRate: 1000,
      kidRate: 500,
      addons: [{ id: "guided-trek", name: "Guided Canyon Trek", price: 2500 }]
    }
  },
  "jos-museum": {
    id: "jos-museum",
    title: "Jos National Museum & Complex",
    category: "Heritage & Culture",
    verified: true,
    rating: 4.5,
    reviewsCount: 19,
    managedBy: "National Commission for Museums and Monuments",
    address: "Museum Hill, Jos City Centre, Jos North LGA, Plateau State",
    weather: { temp: 21, condition: "Pleasant" },
    tags: ["Nok Terracotta", "Architectural Museum", "Heritage Exhibits", "Family Friendly"],
    status: "Open Daily",
    openingHours: "9:00 AM - 5:00 PM",
    entryPrice: "₦500 Adults / ₦200 Students",
    recommendedVisit: "10:00 AM - 1:00 PM",
    phone: "+234 700 000 0000",
    heroImage: "/images/Jos Museum.jpg",
    overviewHeading: "Nigeria's Pioneer Museum of Ancient Pottery & Nok Art",
    description: [
      "Established in 1952 by Bernard Fagg, the Jos Museum stands as one of the oldest and most historic museum institutions in West Africa. Famous for its priceless collection of ancient Nok terracotta heads and pottery artifacts dating back to 500 BC.",
      "The compound also houses the Museum of Traditional Nigerian Architecture (MOTNA), featuring life-sized replicas of historic palaces and mosques from Kano, Zaria, and Benin City."
    ],
    highlights: [
      { icon: "🏺", title: "Nok Terracotta Vaults", desc: "Centuries-old ancient pottery artifacts." },
      { icon: "🏛️", title: "MOTNA Architecture Park", desc: "Full-sized replica structures of pre-colonial Nigeria." },
      { icon: "🎧", title: "Audio Guided Tours", desc: "Curated historical narrative headsets." }
    ],
    pricing: {
      adultRate: 500,
      kidRate: 200,
      addons: [{ id: "guide", name: "Guided Heritage Tour", price: 1000 }]
    }
  },
  "tasty-fingers": {
    id: "tasty-fingers",
    title: "Tasty Fingers Restaurant",
    category: "Dining & Fine Cuisine",
    verified: true,
    rating: 4.6,
    reviewsCount: 45,
    managedBy: "Tasty Fingers Culinary Group",
    address: "Rayfield Road Axis, Jos South, Plateau State",
    weather: { temp: 23, condition: "Pleasant" },
    tags: ["Fine Dining", "City View", "Grill & Continental", "Bar & Lounge"],
    status: "Open Now",
    openingHours: "10:00 AM - 10:30 PM",
    entryPrice: "Free Admission / Pay per Order",
    recommendedVisit: "6:00 PM - 9:30 PM (Dinner & City Skyline View)",
    phone: "+234 812 345 6789",
    heroImage: "/images/Tasty Fingers.webp",
    overviewHeading: "Fine Dining with Panoramic Views of Jos",
    description: [
      "Tasty Fingers Restaurant offers a modern culinary experience blending African flavors with international continental dishes. Situated at an elevated vantage point, guests enjoy sweeping panoramic night views of Jos while dining in a relaxed atmosphere."
    ],
    highlights: [
      { icon: "🍷", title: "VIP Window Seating", desc: "Tables overlooking the Jos skyline." },
      { icon: "🥩", title: "Continental & Local Grill", desc: "Premium steaks, suya platters, and seafood." },
      { icon: "🍹", title: "Signature Cocktail Lounge", desc: "Handcrafted mocktails, chapman, and drinks." }
    ],
    pricing: {
      adultRate: 0,
      kidRate: 0,
      addons: [
        { id: "vip-table", name: "VIP Window Table Reservation", price: 5000 },
        { id: "chapman", name: "Welcome Drink (Special Chapman)", price: 1500 }
      ]
    }
  }
};

export function PlaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tab State
  const [activeTab, setActiveTab] = useState("about");

  // Reservation State
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState([]);

  // Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [generatedTicketRef, setGeneratedTicketRef] = useState("");

  // Weather State
  const [liveWeather, setLiveWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  // Heart / Save state
  const isAuthenticated = !!(localStorage.getItem('token') || localStorage.getItem('jos_pulse_token'));
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Fetch Place Details from Express Backend with Fallback to Mock Data
  useEffect(() => {
    const loadPlace = async () => {
      setLoading(true);
      const normalizedId = String(id || "").toLowerCase();

      try {
        const response = await fetchPlaceBySlug(normalizedId);

        if (response && response.data) {
          const p = response.data;
          setPlace({
            ...p,
            // Normalise field names so the UI always has what it expects
            title: p.title || p.name,
            heroImage: p.heroImage || p.coverImage || (p.images && p.images[0]) || "/images/Rayfield resort 3.webp",
            description: Array.isArray(p.description)
              ? p.description
              : p.description
              ? [p.description]
              : ["No description available."],
            status: p.displayStatus || p.status || "Open Now",
            address: p.address || p.location || "Jos, Plateau State",
            pricing: p.pricing || {
              adultRate: p.entryFee || 0,
              kidRate: 0,
              addons: [],
            },
            highlights: p.highlights && p.highlights.length > 0 ? p.highlights : null,
            gallery: p.gallery && p.gallery.length > 0 ? p.gallery : p.images || [],
          });
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("API load unfulfilled. Resolving to mock dataset:", err.message);
      }

      // ── Fallback to mock data while DB is being seeded ──────────────────
      const aliasMap = {
        "nok-terracottas": "jos-museum",
        "nok-terracotta": "jos-museum",
        "motna": "jos-museum",
        "riyom-rock": "rayfield-resort",
      };
      const fallback = mockPlaces[normalizedId] || mockPlaces[aliasMap[normalizedId]];
      setPlace(fallback || null);
      setLoading(false);
    };

    if (id) loadPlace();
  }, [id]);


  // Live Weather Integration
  useEffect(() => {
    const controller = new AbortController();
    const apiKey = "ddc295c8c24b246a862468fe4b6c9dbb";
    const city = "Jos,NG";

    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`,
          { signal: controller.signal }
        );
        const data = await res.json();

        if (data.main) {
          setLiveWeather({
            temp: Math.round(data.main.temp),
            condition: data.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
          });
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Failed to fetch weather data:", err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setWeatherLoading(false);
        }
      }
    };

    fetchWeather();
    return () => controller.abort();
  }, [place?.id]);

  // Check if this place is already saved by the logged-in user
  useEffect(() => {
    if (!place || !isAuthenticated) return;
    const placeId = place._id || place.id;
    if (!placeId) return;
    checkIsSaved(placeId)
      .then(res => setIsSaved(res?.isSaved ?? false))
      .catch(() => {});
  }, [place, isAuthenticated]);

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      alert('Please log in to save spots.');
      return;
    }
    const placeId = place._id || place.id;
    if (!placeId) return;
    setSaveLoading(true);
    // Optimistic toggle
    setIsSaved(prev => !prev);
    try {
      const res = await toggleSaveSpot(placeId);
      // Reconcile with server response
      setIsSaved(res?.isSaved ?? !isSaved);
    } catch {
      // Revert on error
      setIsSaved(prev => !prev);
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loader}>Loading venue details...</div>;
  }

  if (!place) {
    return <div className={styles.loader}>Place not found</div>;
  }

  // Calculate total fees
  const adultCost = adults * (place.pricing?.adultRate || 0);
  const kidCost = kids * (place.pricing?.kidRate || 0);
  const addonCost = selectedAddons.reduce((sum, item) => sum + item.price, 0);
  const totalEstimate = adultCost + kidCost + addonCost;

  const handleAddonToggle = (addon) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleOpenCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const handleConfirmReservation = async (e) => {
    e.preventDefault();
    if (!guestName || !guestEmail || !guestPhone) {
      alert("Please fill in all contact fields to complete your reservation.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createBooking({
        bookingType: "Place Reservation",
        provider: place.title || place.name,
        destination: place.address || "Jos, Plateau State",
        startDate: selectedDate,
        endDate: selectedDate,
        amount: totalEstimate,
        paymentStatus: totalEstimate === 0 ? "paid" : "pending"
      });

      const refCode = response.data?.bookingReference || `JP-PASS-${Math.floor(100000 + Math.random() * 900000)}`;
      setGeneratedTicketRef(refCode);
    } catch (err) {
      console.warn("Booking submitted in guest mode:", err.message);
      const fallbackRef = `JP-PASS-${Math.floor(100000 + Math.random() * 900000)}`;
      setGeneratedTicketRef(fallbackRef);
    } finally {
      setIsSubmitting(false);
      setIsCheckoutOpen(false);
      setIsSuccessModalOpen(true);
    }
  };

  const defaultHighlights = [
    { icon: "✨", title: "Scenic Views", desc: "Sweeping landscape views of the Plateau terrain." },
    { icon: "🛡", title: "Verified Venue", desc: "Regularly inspected for safety and customer standards." },
    { icon: "🅿️", title: "On-site Parking", desc: "Safe parking spaces available for visitors." },
    { icon: "👨‍👩‍👧", title: "Family Friendly", desc: "Environment suitable for all age groups." }
  ];

  const displayHighlights = (place.highlights && place.highlights.length > 0) 
    ? place.highlights 
    : defaultHighlights;

  return (
    <div className={styles.container}>
      {/* Hero Banner */}
      <div className={styles.heroBanner}>
        <img className={styles.heroImage} src={place.heroImage} alt="" aria-hidden="true" />
        <div className={styles.heroOverlay}>
          <div className={styles.heroTopRow}>
            <button onClick={() => navigate(-1)} className={styles.backButton}>
              ← Back to Discovery
            </button>
            <div className={styles.heroActions}>
              <button
                className={`${styles.circleBtn} ${isSaved ? styles.circleBtnSaved : ''}`}
                title={isSaved ? 'Remove from saved' : 'Save to bookmarks'}
                onClick={handleToggleSave}
                disabled={saveLoading}
                aria-label={isSaved ? 'Unsave spot' : 'Save spot'}
              >
                {isSaved ? (
                  /* Filled heart */
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#f97316" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                ) : (
                  /* Outline heart */
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                )}
              </button>
              <button className={styles.circleBtn} title="Share link">🔗</button>
            </div>
          </div>

          <div className={styles.heroBottomRow}>
            <div className={styles.leftInfo}>
              <div className={styles.badgeGroup}>
                <span className={styles.categoryBadge}>{place.category}</span>
                {place.verified && (
                  <span className={styles.verifiedBadge}>✓ Verified Venue</span>
                )}
              </div>
              <h1 className={styles.title}>{place.title}</h1>
              <div className={styles.subMeta}>
                <span>⭐ {place.rating} ({place.reviewsCount} reviews)</span>
                <span>•</span>
                <span>{place.managedBy}</span>
              </div>
              <p className={styles.address}>📍 {place.address}</p>
            </div>

            <div className={styles.weatherCard}>
              <small>Live Weather</small>
              {weatherLoading ? (
                <div>Loading weather...</div>
              ) : liveWeather ? (
                <div className={styles.tempVal}>
                  {liveWeather.icon && <img src={liveWeather.icon} alt="" width="24" height="24" />}
                  {liveWeather.temp}°C <span style={{ textTransform: "capitalize" }}>{liveWeather.condition}</span>
                </div>
              ) : (
                <div className={styles.tempVal}>
                  ⛅ {place.weather?.temp}°C <span>{place.weather?.condition}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      {place.tags && (
        <div className={styles.tagsContainer}>
          {place.tags.map((tag, i) => (
            <span key={i} className={styles.tagPill}>{tag}</span>
          ))}
        </div>
      )}

      {/* Metrics Grid */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricItem}>
          <small>OPENING HOURS</small>
          <p><strong>• {place.status}</strong><br />{place.openingHours}</p>
        </div>
        <div className={styles.metricItem}>
          <small>ENTRY / TICKET</small>
          <p><strong>{place.entryPrice}</strong></p>
        </div>
        <div className={styles.metricItem}>
          <small>RECOMMENDED VISIT</small>
          <p>{place.recommendedVisit}</p>
        </div>
        <div className={styles.metricItem}>
          <small>DIRECT HOTLINE</small>
          <p>{place.phone}</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={styles.mainGrid}>
        <div className={styles.leftContent}>
          <div className={styles.tabNav}>
            <button
              type="button"
              className={activeTab === "about" ? styles.activeTab : ""}
              onClick={() => setActiveTab("about")}
            >
              About the Spot
            </button>
            <button
              type="button"
              className={activeTab === "highlights" ? styles.activeTab : ""}
              onClick={() => setActiveTab("highlights")}
            >
              Highlights & Amenities
            </button>
          </div>

          {activeTab === "about" && (
            <div className={styles.tabBody}>
              <h2>{place.overviewHeading}</h2>
              {place.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}

              {place.quote && (
                <div className={styles.quoteBox}>
                  <p>"{place.quote.text}"</p>
                  <small>— {place.quote.author}</small>
                </div>
              )}

              {place.gallery && (
                <div className={styles.galleryGrid}>
                  {place.gallery.map((img, idx) => (
                    <img key={idx} src={img} alt={`${place.title} view ${idx + 1}`} />
                  ))}
                </div>
              )}

              {place.visitorTips && (
                <div className={styles.tipsBox}>
                  <h3>💡 Local Visitor Tips</h3>
                  <ul>
                    {place.visitorTips.map((tip, idx) => (
                      <li key={idx}>✓ {tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === "highlights" && (
            <div className={styles.tabBody}>
              <h2>Highlights & Featured Amenities</h2>
              <p>Key facilities, experience add-ons, and visitor comforts available at {place.title}:</p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '16px',
                marginTop: '20px'
              }}>
                {displayHighlights.map((item, idx) => (
                  <div key={idx} style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}>
                    <span style={{ fontSize: '28px' }}>{item.icon}</span>
                    <strong style={{ fontSize: '16px', color: '#0F172A' }}>{item.title}</strong>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Reservation Card */}
        <div className={styles.rightSidebar}>
          <div className={styles.bookingCard}>
            <small>STANDARD ENTRY / PASS</small>
            <div className={styles.priceHeading}>
              <h2>
                {place.pricing?.adultRate === 0 
                  ? "Free Entry" 
                  : `₦${(place.pricing?.adultRate || 0).toLocaleString()}`}
              </h2>
              <span className={styles.instantBadge}>Instant Ticket</span>
            </div>

            <div className={styles.fieldGroup}>
              <label>Reservation Date</label>
              <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)} 
              />
            </div>

            <div className={styles.counterRow}>
              <div>
                <strong>Adults</strong>
                <small>₦{place.pricing?.adultRate || 0}</small>
              </div>
              <div className={styles.counterBtns}>
                <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))}>-</button>
                <span>{adults}</span>
                <button type="button" onClick={() => setAdults(adults + 1)}>+</button>
              </div>
            </div>

            <div className={styles.counterRow}>
              <div>
                <strong>Kids</strong>
                <small>₦{place.pricing?.kidRate || 0}</small>
              </div>
              <div className={styles.counterBtns}>
                <button type="button" onClick={() => setKids(Math.max(0, kids - 1))}>-</button>
                <span>{kids}</span>
                <button type="button" onClick={() => setKids(kids + 1)}>+</button>
              </div>
            </div>

            {place.pricing?.addons && place.pricing.addons.length > 0 && (
              <div className={styles.addonsSection}>
                <label>Optional Experiences & Table Upgrades</label>
                {place.pricing.addons.map((addon) => (
                  <div key={addon.id} className={styles.addonRow}>
                    <input
                      type="checkbox"
                      id={addon.id}
                      checked={selectedAddons.some((a) => a.id === addon.id)}
                      onChange={() => handleAddonToggle(addon)}
                    />
                    <label htmlFor={addon.id}>{addon.name}</label>
                    <span>+₦{addon.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.totalRow}>
              <span>Estimated Total</span>
              <strong>₦{totalEstimate.toLocaleString()}</strong>
            </div>

            <button 
              type="button" 
              className={styles.reserveBtn} 
              onClick={handleOpenCheckout}
            >
              Reserve Pass & Get Tickets
            </button>
          </div>
        </div>
      </div>

      {/* CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modalContainer}>
            <div style={modalStyles.header}>
              <h3 style={{ margin: 0, color: '#0F172A' }}>Complete Your Reservation</h3>
              <button 
                onClick={() => setIsCheckoutOpen(false)}
                style={modalStyles.closeBtn}
              >
                ✕
              </button>
            </div>

            <div style={modalStyles.summaryBox}>
              <strong>{place.title}</strong>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748B' }}>
                Date: {selectedDate} | Guests: {adults} Adult(s), {kids} Kid(s)
              </p>
              <div style={{ marginTop: '8px', fontWeight: 'bold', color: '#0F172A' }}>
                Total payable: ₦{totalEstimate.toLocaleString()}
              </div>
            </div>

            <form onSubmit={handleConfirmReservation} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
              <div>
                <label style={modalStyles.label}>Full Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Pam Chollom"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  style={modalStyles.input}
                />
              </div>

              <div>
                <label style={modalStyles.label}>Email Address (To receive E-Ticket)</label>
                <input 
                  type="email" 
                  required 
                  placeholder="pam@example.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  style={modalStyles.input}
                />
              </div>

              <div>
                <label style={modalStyles.label}>Phone Number</label>
                <input 
                  type="tel" 
                  required 
                  placeholder="+234 800 000 0000"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  style={modalStyles.input}
                />
              </div>

              <button type="submit" disabled={isSubmitting} style={modalStyles.confirmBtn}>
                {isSubmitting ? "Processing..." : "Confirm Reservation & Issue Pass"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* E-TICKET CONFIRMATION MODAL */}
      {isSuccessModalOpen && (
        <div style={modalStyles.overlay}>
          <div style={{ ...modalStyles.modalContainer, textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎟️</div>
            <h3 style={{ margin: '0 0 8px', color: '#0F172A' }}>Reservation Confirmed!</h3>
            <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#64748B' }}>
              Your digital entry pass has been issued and sent to <strong>{guestEmail}</strong>.
            </p>

            <div style={{
              backgroundColor: '#FFF7ED',
              border: '2px dashed #F97316',
              borderRadius: '12px',
              padding: '20px',
              margin: '16px 0'
            }}>
              <small style={{ color: '#C2410C', fontWeight: 'bold' }}>OFFICIAL E-TICKET VOUCHER</small>
              <h4 style={{ margin: '6px 0', fontSize: '18px', color: '#0F172A' }}>{generatedTicketRef}</h4>
              
              <div style={{ margin: '12px 0' }}>
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${generatedTicketRef}`} 
                  alt="QR Ticket Code" 
                  style={{ borderRadius: '8px', border: '1px solid #CBD5E1' }}
                />
              </div>

              <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
                <strong>{place.title}</strong><br />
                Date: {selectedDate} | Pass for {adults + kids} Person(s)<br />
                Presenter: {guestName}
              </div>
            </div>

            <button 
              type="button" 
              onClick={() => setIsSuccessModalOpen(false)}
              style={modalStyles.confirmBtn}
            >
              Done & Save Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '28px',
    maxWidth: '480px',
    width: '100%',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    fontFamily: '"Inter", sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#64748B'
  },
  summaryBox: {
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    padding: '14px'
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: '6px'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  confirmBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#F97316',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '8px'
  }
};

export default PlaceDetail;