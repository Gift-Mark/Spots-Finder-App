import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./PlaceDetail.module.css";

// Sample mock database - replace this with your API call or data store
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
    tags: [
      "Family Friendly",
      "Boating & Water Sports",
      "Beach Front Vibe",
      "Outdoor Dining",
      "Waterfront Restaurant",
    ],
    status: "Open Now",
    openingHours: "8:00 AM - 6:30 PM",
    entryPrice: "N1,500 Adults / N500 Kids",
    recommendedVisit: "4:00 PM - 6:30 PM (Golden Hour Sunset)",
    phone: "+234 703 123 4567",
    heroImage: "/images/rayfield-hero.jpg",
    overviewHeading: "An Oasis of Waters & Granite Hills",
    description: [
      "Tucked away inside the historic and affluent suburb of Rayfield, Jos, the Rayfield Holiday Resort & Water Park stands as one of Plateau State's most cherished recreation treasures. Nestled beneath dramatic, precariously perched granite boulders and kissed by fresh highland winds, this aquatic haven offers tourists and locals a peaceful sanctuary away from the bustling city center.",
      "The centerpiece of the resort is an expansive calm water lake originally sculpted during the Plateau tin-mining era and subsequently transformed into an ecological retreat. Here, families gather for gentle canoe rides, speedboats, and pedal-powered watercraft while enjoying the serene backdrop of indigenous acacia trees, lush shoreline foliage, and sunbathing native kingfishers.",
      "Along the stone-paved promenade, guests are treated to Plateau's acclaimed fresh culinary offerings. Savor freshly caught grilled fish spiced with local suya herbs, alongside wood-fired suya skewers, refreshing chapman mocktails, and cold beverages at the lakeside open-air pavilion.",
    ],
    quote: {
      text: "There is no sunset in Jos quite like watching the gold rays bounce off the granite hills and reflect across the Rayfield Lake while fishermen row their traditional canoes.",
      author: "JOS PULSE PLATEAU HERITAGE GUIDE",
    },
    gallery: [
      "/images/gallery1.jpg",
      "/images/gallery2.jpg",
      "/images/gallery3.jpg",
    ],
    visitorTips: [
      "Bring a Light Cardigan: Jos evenings at 1,280 m elevation chill down briskly as soon as the sun dips below the granite ridges around 6:15 PM.",
      "Safety Lifejackets: The resort provides mandatory standard life vests for all canoe and speedboat rides at no additional surcharge.",
      "Peak Days: Sundays can experience heavy family picnic turnouts. For a meditative and tranquil experience, visit weekday mornings or Saturdays before 2:00 PM.",
    ],
    pricing: {
      adultRate: 1500,
      kidRate: 500,
      addons: [
        { id: "cruise", name: "30-Min Lake Cruise", price: 2000 },
        { id: "combo", name: "Speedboat with Grill Combo", price: 4500 },
      ],
    },
  },
};

export function PlaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Look up data directly during render (No useEffect or setState needed)
  const place = mockPlaces[id] || mockPlaces["rayfield-resort"];

  // 2. Tab & Booking states
  const [activeTab, setActiveTab] = useState("about");
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState([]);

  if (!place) {
    return <div className={styles.loader}>Place not found.</div>;
  }

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

  return (
    <div className={styles.container}>
      {/* 1. HERO HEADER BANNER */}
      <div
        className={styles.heroBanner}
        style={{ backgroundImage: `url(${place.heroImage})` }}
      >
        <div className={styles.heroOverlay}>
          <div className={styles.heroTopRow}>
            <button onClick={() => navigate(-1)} className={styles.backButton}>
              ← Back to Discovery
            </button>
            <div className={styles.heroActions}>
              <button className={styles.circleBtn} title="Bookmark">🔖</button>
              <button className={styles.circleBtn} title="Share">🔗</button>
            </div>
          </div>

          <div className={styles.heroBottomRow}>
            <div className={styles.leftInfo}>
              <div className={styles.badgeGroup}>
                <span className={styles.categoryBadge}>{place.category}</span>
                {place.verified && (
                  <span className={styles.verifiedBadge}>
                    ✓ Verified Venue
                  </span>
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

            {place.weather && (
              <div className={styles.weatherCard}>
                <small>Average Daily Temp</small>
                <div className={styles.tempVal}>
                  ⛅ {place.weather.temp}°C <span>{place.weather.condition}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. TAGS BAR */}
      {place.tags && (
        <div className={styles.tagsContainer}>
          {place.tags.map((tag, i) => (
            <span key={i} className={styles.tagPill}>{tag}</span>
          ))}
        </div>
      )}

      {/* 3. METRICS GRID */}
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

      {/* 4. MAIN TWO-COLUMN SECTION */}
      <div className={styles.mainGrid}>
        {/* Left Content */}
        <div className={styles.leftContent}>
          {/* Navigation Tabs */}
          <div className={styles.tabNav}>
            <button
              className={activeTab === "about" ? styles.activeTab : ""}
              onClick={() => setActiveTab("about")}
            >
              About the Spot
            </button>
            <button
              className={activeTab === "highlights" ? styles.activeTab : ""}
              onClick={() => setActiveTab("highlights")}
            >
              Highlights & Amenities
            </button>
            <button
              className={activeTab === "reviews" ? styles.activeTab : ""}
              onClick={() => setActiveTab("reviews")}
            >
              Visitor Reviews & Vibe
            </button>
          </div>

          {/* About Tab Content */}
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
                    <img key={idx} src={img} alt="Spot view" />
                  ))}
                </div>
              )}

              {place.visitorTips && (
                <div className={styles.tipsBox}>
                  <h3>💡 Local Visitor Tips for {place.title.split(" ")[0]}</h3>
                  <ul>
                    {place.visitorTips.map((tip, idx) => (
                      <li key={idx}>✓ {tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={styles.mapSection}>
                <h3>Location & Access</h3>
                <p>{place.address}</p>
                <div className={styles.mapPlaceholder}>
                  🗺️ Map view widget location
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar Widget */}
        <div className={styles.rightSidebar}>
          <div className={styles.bookingCard}>
            <small>STANDARD ENTRY</small>
            <div className={styles.priceHeading}>
              <h2>N1,500</h2>
              <span className={styles.instantBadge}>Instant Ticket</span>
            </div>

            <div className={styles.fieldGroup}>
              <label>Date</label>
              <input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
            </div>

            <div className={styles.counterRow}>
              <div>
                <strong>Adults</strong>
                <small>N{place.pricing?.adultRate}</small>
              </div>
              <div className={styles.counterBtns}>
                <button onClick={() => setAdults(Math.max(1, adults - 1))}>-</button>
                <span>{adults}</span>
                <button onClick={() => setAdults(adults + 1)}>+</button>
              </div>
            </div>

            <div className={styles.counterRow}>
              <div>
                <strong>Kids</strong>
                <small>N{place.pricing?.kidRate}</small>
              </div>
              <div className={styles.counterBtns}>
                <button onClick={() => setKids(Math.max(0, kids - 1))}>-</button>
                <span>{kids}</span>
                <button onClick={() => setKids(kids + 1)}>+</button>
              </div>
            </div>

            {place.pricing?.addons && (
              <div className={styles.addonsSection}>
                <label>Optional Experiences</label>
                {place.pricing.addons.map((addon) => (
                  <div key={addon.id} className={styles.addonRow}>
                    <input
                      type="checkbox"
                      id={addon.id}
                      onChange={() => handleAddonToggle(addon)}
                    />
                    <label htmlFor={addon.id}>{addon.name}</label>
                    <span>+N{addon.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.totalRow}>
              <span>Estimated Total</span>
              <strong>N{totalEstimate.toLocaleString()}</strong>
            </div>

            <button className={styles.reserveBtn}>
              Reserve Pass & Get Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceDetail;