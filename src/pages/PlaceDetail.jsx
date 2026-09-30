import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./PlaceDetail.module.css";

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
    entryPrice: "₦1,500 Adults / ₦500 Kids",
    recommendedVisit: "4:00 PM - 6:30 PM (Golden Hour Sunset)",
    phone: "+234 703 123 4567",
    heroImage: "/images/Rayfield Resort.jpg",
    overviewHeading: "An Oasis of Waters & Granite Hills",
    description: [
      "Tucked away inside the historic suburb of Rayfield, Jos, the Rayfield Holiday Resort stands as one of Plateau State's most cherished recreation treasures.",
    ],
    quote: {
      text: "There is no sunset in Jos quite like watching the gold rays bounce off the granite hills and reflect across Rayfield Lake.",
      author: "JOS PULSE GUIDE",
    },
    gallery: ["/images/Rayfield Resort.jpg", "/images/Kurra-Falls.jpg"],
    visitorTips: [
      "Bring a Light Cardigan for cool evening winds.",
      "Lifejackets are mandatory for all boat rides."
    ],
    pricing: {
      adultRate: 1500,
      kidRate: 500,
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
    heroImage: "/images/tasty-fingers.jpg",
    overviewHeading: "Fine Dining with Panoramic Views of Jos",
    description: [
      "Tasty Fingers Restaurant offers a modern culinary experience blending African flavors with international continental dishes. Situated at an elevated vantage point, guests enjoy sweeping panoramic night views of Jos while dining in a relaxed atmosphere."
    ],
    pricing: {
      adultRate: 0,
      kidRate: 0,
      addons: [
        { id: "vip-table", name: "VIP Window Table Reservation", price: 5000 },
        { id: "chapman", name: "Welcome Drink (Special Chapman)", price: 1500 }
      ]
    }
  },

  "nzem-berom": {
    id: "nzem-berom",
    slug: "nzem-berom",
    title: "Nzem Berom Cultural Festival",
    category: "Cultural Festival",
    verified: true,
    rating: 4.9,
    reviewsCount: 112,
    managedBy: "Berom Educational and Cultural Organisation (BECO)",
    address: "Rwang Pam Stadium, Jos City Centre, Plateau State",
    weather: { temp: 20, condition: "Highland Festival Breeze" },
    tags: ["Cultural Heritage", "Royal Procession", "Music & Dance", "Local Cuisine"],
    status: "Annual Event",
    openingHours: "9:00 AM - 6:00 PM",
    entryPrice: "Free Entry",
    recommendedVisit: "10:00 AM - 3:00 PM",
    phone: "+234 800 111 2222",
    heroImage: "/images/nzem-berom.jpg",
    overviewHeading: "The Grand Celebration of Berom Cultural Heritage",
    description: [
      "The Nzem Berom is the premier annual cultural carnival of the Berom people of Plateau State. Celebrating the rich music, royal processions, traditional dances, and agricultural harvests of the highlanders.",
      "Expect vibrant displays of traditional costumes, royal horse processions, musical performances, and exhibitions of native Berom cuisine and crafts."
    ],
    quote: {
      text: "Experience the pulse of Plateau tradition through royal horse troops, rhythmic drumming, and authentic highland culture.",
      author: "PLATEAU HERITAGE GUILD"
    },
    gallery: ["/images/nzem-berom.jpg"],
    visitorTips: [
      "Arrive before 9:30 AM to secure a clear view of the opening royal procession.",
      "Photography is welcomed, but respect designated traditional performance areas."
    ],
    pricing: {
      adultRate: 0,
      kidRate: 0,
      addons: [
        { id: "vip-pavilion", name: "VIP Grandstand Pavilion Seat", price: 3000 }
      ]
    },
    date: "October 14, 2026",
    month: "OCT",
    day: "14",
    venue: "Rwang Pam Stadium",
    isFree: true
  },

  "plateau-live-music": {
    id: "plateau-live-music",
    slug: "plateau-live-music",
    title: "Plateau Live Music Night",
    category: "Concert & Nightlife",
    verified: true,
    rating: 4.8,
    reviewsCount: 64,
    managedBy: "Plateau Entertainment Forum & Rayfield Waterway",
    address: "Rayfield Waterway Resort, Jos South, Plateau State",
    weather: { temp: 18, condition: "Cool Highland Evening" },
    tags: ["Live Band", "Highlife & Afro-Fusion", "Lakeside View", "Nightlife"],
    status: "Upcoming Event",
    openingHours: "7:00 PM - 11:30 PM",
    entryPrice: "₦5,000 Regular / ₦15,000 VIP",
    recommendedVisit: "7:00 PM - 11:00 PM (Full Night Session)",
    phone: "+234 803 000 1234",
    heroImage: "/images/live-music.jpg",
    overviewHeading: "Highland Rhythms & Acoustic Sunset Sessions",
    description: [
      "An intimate evening of live acoustic performances, Afro-fusion jazz, and contemporary Jos music talent set against the beautiful lakeside view of Waterway Resort.",
      "Featuring top local guest artists, craft cocktails, outdoor lounge seating, and an electric atmosphere under the stars."
    ],
    quote: {
      text: "The cool highland breeze mixed with soulful live acoustic highlife at the lakeside is Jos nightlife at its finest.",
      author: "JOS PULSE NIGHTLIFE GUIDE"
    },
    gallery: [
      "/images/live-music.jpg",
      "/images/Rayfield Resort.jpg"
    ],
    visitorTips: [
      "Open Mic Segment: Arrive by 6:30 PM to register for early acoustic slots.",
      "Evening Chills: Bring a jacket as temperatures cool down significantly by the lake at night.",
      "VIP Seating: Book early for front-row tables with direct stage views."
    ],
    pricing: {
      adultRate: 5000,
      kidRate: 2500,
      addons: [
        { id: "vip-upgrade", name: "VIP Table & Welcome Drink Upgrade", price: 10000 },
        { id: "reserved-parking", name: "Reserved Premium Parking Pass", price: 2000 }
      ]
    },
    date: "October 16, 2026",
    month: "OCT",
    day: "16",
    venue: "Waterway Resort",
    isFree: false,
    organizer: "Plateau Entertainment Forum"
  }
};

export function PlaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Match URL parameter ID to place in database, fallback to kurra-falls if missing
  const place = mockPlaces[id] || mockPlaces["kurra-falls"];

  const [activeTab, setActiveTab] = useState("about");
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState([]);

  if (!place) {
    return <div className={styles.loader}>Place not found</div>;
  }

  // Calculate pricing
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
      {/* Hero Header */}
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
              <button className={styles.circleBtn}>🔖</button>
              <button className={styles.circleBtn}>🔗</button>
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

      {/* Main Grid Content */}
      <div className={styles.mainGrid}>
        <div className={styles.leftContent}>
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
                    <img key={idx} src={img} alt="Spot view" />
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
        </div>

        {/* Dynamic Booking Card */}
        <div className={styles.rightSidebar}>
          <div className={styles.bookingCard}>
            <small>STANDARD ENTRY</small>
            <div className={styles.priceHeading}>
              <h2>₦{place.pricing?.adultRate.toLocaleString()}</h2>
              <span className={styles.instantBadge}>Instant Ticket</span>
            </div>

            <div className={styles.fieldGroup}>
              <label>Date</label>
              <input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
            </div>

            <div className={styles.counterRow}>
              <div>
                <strong>Adults</strong>
                <small>₦{place.pricing?.adultRate}</small>
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
                <small>₦{place.pricing?.kidRate}</small>
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
                    <span>+₦{addon.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.totalRow}>
              <span>Estimated Total</span>
              <strong>₦{totalEstimate.toLocaleString()}</strong>
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