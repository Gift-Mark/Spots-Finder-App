import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../CSS/DiningListing.module.css";

// Real-world restaurants & dining venues in Jos, Plateau State
const REAL_JOS_DINING = [
  {
    id: "sweet-november-bistro",
    name: "Sweet November Bistro",
    category: "Highland Fine Dining",
    styleTag: "fine-dining",
    rating: 4.6,
    reviewsCount: 454,
    address: "No 1B Totus Tuus Close, beside Eliel Center, Gold & Base, Jos",
    area: "Gold & Base / GRA",
    priceRange: "₦₦₦ (₦7,000 - ₦20,000)",
    status: "Open Now",
    hours: "10:00 AM - 10:00 PM",
    image: "/images/tasty-fingers.jpg", // Replace with exact bistro image path
    cuisine: ["Continental", "Gourmet Steaks", "Pastas", "Cocktails"],
    features: ["Outdoor Terrace", "VIP Booths", "Candlelight Setup"],
    featured: true
  },
  {
    id: "barcardi-restaurant-cafe",
    name: "Barcardi Restaurant & Café",
    category: "Lounge & Upscale Dining",
    styleTag: "fine-dining",
    rating: 4.5,
    reviewsCount: 201,
    address: "11 Dandaura Road, Off Wase Road, GRA, Jos",
    area: "GRA Jos",
    priceRange: "₦₦₦ (₦6,000 - ₦18,000)",
    status: "Open Now",
    hours: "9:00 AM - 10:30 PM",
    image: "/images/tasty-fingers.jpg",
    cuisine: ["Afro-Fusion", "Grills", "Mocktails", "Seafood"],
    features: ["Private Dining Room", "Serene Atmosphere", "Wi-Fi"],
    featured: true
  },
  {
    id: "crest-view-restaurant",
    name: "The Crest View Restaurant & Lounge",
    category: "Panoramic Fine Dining",
    styleTag: "fine-dining",
    rating: 4.8,
    reviewsCount: 310,
    address: "Crest Hotel Axis, Old Airport Road, Jos South",
    area: "Old Airport Road",
    priceRange: "₦₦₦₦ (₦10,000 - ₦25,000)",
    status: "Open Now",
    hours: "11:00 AM - 11:00 PM",
    image: "/images/tasty-fingers.jpg",
    cuisine: ["Chef's Tasting Menu", "Wine Pairing", "International Fusion"],
    features: ["Skyline Views", "Executive Reservations", "Live Saxophone"],
    featured: true
  },
  {
    id: "swiss-executive-restaurant",
    name: "Swiss Luxury Hotel Fine Dining",
    category: "Hotel & Fine Cuisine",
    styleTag: "fine-dining",
    rating: 4.7,
    reviewsCount: 180,
    address: "Swiss Hotel Grounds, Rayfield Road, Jos",
    area: "Rayfield",
    priceRange: "₦₦₦₦ (₦12,000 - ₦30,000)",
    status: "Open Daily",
    hours: "7:00 AM - 11:00 PM",
    image: "/images/tasty-fingers.jpg",
    cuisine: ["Swiss & European", "Jambalaya Rice", "Peppered Steak"],
    features: ["Valet Parking", "Sommelier Selection", "Buffet Options"],
    featured: false
  },
  {
    id: "tin-city-cafe",
    name: "Tin City Café",
    category: "Cozy Café & Bistro",
    styleTag: "cafes",
    rating: 4.5,
    reviewsCount: 344,
    address: "37A Apollo Crescent, GRA, Jos",
    area: "GRA Jos",
    priceRange: "₦₦ (₦3,000 - ₦8,000)",
    status: "Open Now",
    hours: "8:00 AM - 8:00 PM",
    image: "/images/tasty-fingers.jpg",
    cuisine: ["Specialty Coffee", "Artisan Bakery", "All-Day Breakfast"],
    features: ["Cozy Seating", "Work Friendly", "Fresh Pastries"],
    featured: false
  },
  {
    id: "fidian-chops-grill",
    name: "Fidian Chops & Outdoor Grill",
    category: "Suya & Outdoor Garden",
    styleTag: "suya-outdoor",
    rating: 4.4,
    reviewsCount: 512,
    address: "Old Airport Road Axis, Jos South",
    area: "Old Airport Road",
    priceRange: "₦₦ (₦2,500 - ₦7,500)",
    status: "Open Now",
    hours: "12:00 PM - 11:00 PM",
    image: "/images/tasty-fingers.jpg",
    cuisine: ["Plateau Suya", "Grilled Chicken", "Local Delicacies"],
    features: ["Open-Air Seating", "Live Grill Station", "Group Tables"],
    featured: false
  }
];

export function DiningListing() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("fine-dining"); // Default active tag
  const [selectedArea, setSelectedArea] = useState("all");

  // Filter listings based on user search, category tag, and area
  const filteredRestaurants = useMemo(() => {
    return REAL_JOS_DINING.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.cuisine.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStyle =
        selectedStyle === "all" || item.styleTag === selectedStyle;

      const matchesArea =
        selectedArea === "all" || item.area === selectedArea;

      return matchesSearch && matchesStyle && matchesArea;
    });
  }, [searchTerm, selectedStyle, selectedArea]);

  return (
    <div className={styles.container}>
      {/* Listing Page Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={() => navigate(-1)} className={styles.backBtn}>
            ← Back to Overview
          </button>
          <span className={styles.kicker}>Highland Culinary Guide</span>
          <h1>Fine Dining & Restaurants in Jos</h1>
          <p>
            Explore top-tier culinary experiences, gourmet bistro spots, and fine dining establishments across Plateau State.
          </p>
        </div>
      </header>

      {/* Control & Filter Section */}
      <section className={styles.filterSection}>
        <div className={styles.searchBarWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by restaurant name, cuisine (e.g. Steak, Pasta), or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          {searchTerm && (
            <button className={styles.clearSearch} onClick={() => setSearchTerm("")}>
              ✕
            </button>
          )}
        </div>

        {/* Style Filters */}
        <div className={styles.filterBar}>
          <div className={styles.stylePills}>
            <button
              className={selectedStyle === "all" ? styles.activePill : styles.pill}
              onClick={() => setSelectedStyle("all")}
            >
              All Dining
            </button>
            <button
              className={selectedStyle === "fine-dining" ? styles.activePill : styles.pill}
              onClick={() => setSelectedStyle("fine-dining")}
            >
              ✨ Fine Dining
            </button>
            <button
              className={selectedStyle === "cafes" ? styles.activePill : styles.pill}
              onClick={() => setSelectedStyle("cafes")}
            >
              ☕ Cafes & Breakfast
            </button>
            <button
              className={selectedStyle === "suya-outdoor" ? styles.activePill : styles.pill}
              onClick={() => setSelectedStyle("suya-outdoor")}
            >
              🔥 Suya & Outdoor
            </button>
          </div>

          {/* District Selector */}
          <div className={styles.areaSelectWrapper}>
            <label htmlFor="area-filter">District:</label>
            <select
              id="area-filter"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className={styles.areaSelect}
            >
              <option value="all">All Areas in Jos</option>
              <option value="GRA Jos">GRA Jos</option>
              <option value="Gold & Base / GRA">Gold & Base</option>
              <option value="Old Airport Road">Old Airport Road</option>
              <option value="Rayfield">Rayfield Axis</option>
            </select>
          </div>
        </div>
      </section>

      {/* Results Header */}
      <div className={styles.resultsMeta}>
        <p>
          Showing <strong>{filteredRestaurants.length}</strong> establishment{filteredRestaurants.length !== 1 ? "s" : ""}
          {selectedStyle !== "all" && <span> in <em>{selectedStyle.replace("-", " ")}</em></span>}
        </p>
      </div>

      {/* Restaurants Grid */}
      <main className={styles.gridContainer}>
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((venue) => (
            <article key={venue.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img src={venue.image} alt={venue.name} className={styles.cardImg} />
                {venue.featured && <span className={styles.featuredBadge}>Top Choice</span>}
                <span className={styles.statusBadge}>{venue.status}</span>
              </div>

              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <span className={styles.categoryTag}>{venue.category}</span>
                  <div className={styles.rating}>
                    ⭐ {venue.rating} <small>({venue.reviewsCount})</small>
                  </div>
                </div>

                <h2 className={styles.venueTitle}>{venue.name}</h2>
                <p className={styles.address}>📍 {venue.address}</p>

                <div className={styles.cuisineTags}>
                  {venue.cuisine.map((item, idx) => (
                    <span key={idx} className={styles.cuisinePill}>
                      {item}
                    </span>
                  ))}
                </div>

                <div className={styles.featureList}>
                  {venue.features.map((feat, idx) => (
                    <span key={idx} className={styles.featureItem}>
                      ✓ {feat}
                    </span>
                  ))}
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.priceInfo}>
                    <small>Average Meal</small>
                    <strong>{venue.priceRange}</strong>
                  </div>

                  <button
                    onClick={() => navigate(`/places/${venue.id}`)}
                    className={styles.reserveBtn}
                  >
                    View & Reserve
                  </button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className={styles.emptyState}>
            <h3>No restaurants found</h3>
            <p>Try resetting your search filters or choosing a different area in Jos.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedStyle("all");
                setSelectedArea("all");
              }}
              className={styles.resetBtn}
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default DiningListing;