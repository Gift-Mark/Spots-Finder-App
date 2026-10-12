import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  faGolfBallTee,
  faMasksTheater,
  faUtensils,
  faGlassMartiniAlt,
  faLandmark,
} from "@fortawesome/free-solid-svg-icons";

import Header from "./Components/headerNav.jsx";
import HeroSection from "./Components/HeroSection.jsx";
import TopTouristSpots from "./Components/TopTouristSpots.jsx";
import PromotedEventsSection from "./Components/PromotedEventsSection.jsx";
import HeritageSpotlight from "./Components/HeritageSpotlight.jsx";
import TeeTimeBookingModal from "./Components/TeeTime.jsx";
import Footer from "./Components/Footer.jsx";
import styles from "./discover.module.css";
import heroVideo from "./assets/videos/jos_pulse_hero_loop_draft.mp4";

// API Services
import { fetchPlaces, logUserBehavior } from "../src/api/client.js";

export const Discover = () => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTeeTimeOpen, setIsTeeTimeOpen] = useState(false);

  // Maintain persistent user session for behavioral logs
  const [sessionId] = useState(() => {
    let id = localStorage.getItem("jos_session_id");
    if (!id) {
      id = `sess_${Math.random().toString(36).substring(2, 11)}`;
      localStorage.setItem("jos_session_id", id);
    }
    return id;
  });

  // Reusable Hero Pills Configuration
  // The `id` values must match the `category` enum in the Place model
  const discoverPills = [
    { id: "golf", label: "Golf", icon: faGolfBallTee },
    { id: "festival", label: "Festivals", icon: faMasksTheater },
    { id: "restaurant", label: "Restaurants", icon: faUtensils },
    { id: "nightlife", label: "Nightlife", icon: faGlassMartiniAlt },
    { id: "culture", label: "Cultural Landmarks", icon: faLandmark },
  ];

  // ─── Fetch places from MongoDB via Express API ──────────────────────────────
  useEffect(() => {
    const controller = new AbortController();

    const loadPlaces = async () => {
      setLoading(true);
      setError(null);
      try {
        // Build query params — search and category are passed to the backend
        const queryParams = {};
        if (searchQuery.trim()) queryParams.search = searchQuery.trim();
        if (activeCategory !== "all") queryParams.category = activeCategory;

        const response = await fetchPlaces(queryParams);

        // Backend returns { success, count, total, data: [...] }
        const fetched = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
          ? response.data
          : [];

        setPlaces(fetched);

        if (searchQuery.trim()) {
          logUserBehavior(sessionId, "SEARCH", { query: searchQuery });
        }
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          console.error("Failed to load places from API:", err);
          setError("Could not load spots. Please check your connection.");
        }
      } finally {
        setLoading(false);
      }
    };

    // Debounce so we don't hammer the API on every keystroke
    const timer = setTimeout(loadPlaces, 400);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery, activeCategory, sessionId]);

  // ─── Hero Search and Pill Event Handlers ────────────────────────────────────
  const handleSearch = (query, category) => {
    setSearchQuery(query);
    if (category) setActiveCategory(category);
  };

  const handleCategorySelect = (category) => {
    logUserBehavior(sessionId, "CATEGORY_CLICK", { category });

    // Scroll anchors for specific sections
    const categoryTargets = {
      golf: "golf-spotlight",
      festival: "festival-events",
      restaurant: "tasty-fingers-promo",
      culture: "cultural-landmark",
    };
    const targetId = categoryTargets[category];

    if (targetId) {
      document.getElementById(targetId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    if (category === "nightlife") {
      navigate("/nightlife");
      return;
    }

    setActiveCategory(category);
  };

  // ─── Derived data ────────────────────────────────────────────────────────────
  const featuredEvents = places.filter(
    (place) => place.section === "events" || place.section === "recommended"
  );

  // Client-side filter mirrors the API filter for instant UX while results load
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query && (activeCategory === "all")) return places;

    return places.filter((place) => {
      const title = (place.title || place.name || "").toLowerCase();
      const loc = (place.location || place.address || "").toLowerCase();
      const desc = Array.isArray(place.description)
        ? place.description.join(" ").toLowerCase()
        : (place.description || "").toLowerCase();
      const cat = (place.category || "").toLowerCase();
      const tags = (place.tags || []).join(" ").toLowerCase();

      const matchesQuery =
        !query ||
        title.includes(query) ||
        loc.includes(query) ||
        desc.includes(query) ||
        cat.includes(query) ||
        tags.includes(query);

      const matchesCategory =
        activeCategory === "all" ||
        cat === activeCategory.toLowerCase();

      return matchesQuery && matchesCategory;
    });
  }, [places, searchQuery, activeCategory]);

  const handleBookTable = () => {
    logUserBehavior(sessionId, "BOOKING_ATTEMPT", { target: "Tasty Fingers Restaurant" });
    navigate("/place/tasty-fingers");
  };

  return (
    <div className={styles.discoverContainer}>
      {/* 1. Header Navigation */}
      <Header />

      {/* 2. Reusable Hero Section configured for Discover */}
      <HeroSection
        title="Discover the Vibe, Culture, and Beauty of Jos."
        subtitle="Your premier guide to the Plateau's vibrant nightlife, lounges, historic landmarks, and breathtaking landscapes."
        placeholder="What are you looking for? (e.g., Rayfield, Lounges, Hiking)"
        videoSrc={heroVideo}
        filterPills={discoverPills}
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
      />

      {/* 3. Main Page Content */}
      <main className={styles.mainContent}>

        {/* ── Search / Filter Results Panel ─────────────────────────────── */}
        {(searchQuery.trim() || activeCategory !== "all") && (
          <section className={styles.searchResultsSection}>
            <div className={styles.searchResultsHeader}>
              <h2>
                {searchQuery.trim()
                  ? `Results for "${searchQuery.trim()}"`
                  : `Showing: ${discoverPills.find(p => p.id === activeCategory)?.label || activeCategory}`}
              </h2>
              {/* Clear filter button */}
              <button
                type="button"
                className={styles.clearBtn}
                onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
              >
                ✕ Clear
              </button>
            </div>

            {loading ? (
              <div className={styles.skeletonGrid}>
                {[1, 2, 3].map((n) => (
                  <div key={n} className={styles.skeletonCard} />
                ))}
              </div>
            ) : error ? (
              <div className={styles.noResultsBox}>
                <h3>😕 {error}</h3>
                <button
                  type="button"
                  onClick={() => setActiveCategory(activeCategory)} // re-trigger effect
                  className={styles.retryBtn}
                >
                  Retry
                </button>
              </div>
            ) : searchResults.length > 0 ? (
              <div className={styles.resultsGrid}>
                {searchResults.map((place) => {
                  const itemSlug = place.slug || place._id;
                  const itemTitle = place.title || place.name;
                  const itemImage =
                    place.heroImage ||
                    place.coverImage ||
                    (place.images && place.images[0]) ||
                    "/images/Rayfield Resort.jpg";
                  const itemLocation =
                    place.location || place.address || "Jos, Plateau State";
                  const itemPrice =
                    place.entryPrice ||
                    (place.entryFee ? `₦${place.entryFee.toLocaleString()}` : "Free Admission");

                  return (
                    <Link
                      key={place._id || itemSlug}
                      to={`/place/${itemSlug}`}
                      className={styles.resultCard}
                    >
                      <img
                        src={itemImage}
                        alt={itemTitle}
                        className={styles.resultImage}
                        onError={(e) => {
                          e.target.src = "/images/Rayfield Resort.jpg";
                        }}
                      />
                      <div className={styles.resultContent}>
                        <span className={styles.resultBadge}>
                          {place.badge || place.category || "Spot"}
                        </span>
                        <h3>{itemTitle}</h3>
                        <p>{itemLocation}</p>
                        <div className={styles.resultMeta}>
                          <span>⭐ {place.rating || 4.5}</span>
                          <span>{itemPrice}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className={styles.noResultsBox}>
                <h3>No spots match your search</h3>
                <p>Try another keyword, category, or location in Jos.</p>
              </div>
            )}
          </section>
        )}

        {/* ── TOP TOURIST SPOTS (always visible) ─────────────────────────── */}
        <TopTouristSpots onSeeAll={() => navigate("/attractions")} />

        {/* ── PROMOTED & FEATURED EVENTS ─────────────────────────────────── */}
        <PromotedEventsSection
          events={featuredEvents.length > 0 ? featuredEvents : undefined}
          onBookTable={handleBookTable}
          loading={loading}
        />

        {/* ── HERITAGE SPOTLIGHT ──────────────────────────────────────────── */}
        <HeritageSpotlight
          onBookTeeTime={() => {
            logUserBehavior(sessionId, "BOOKING_ATTEMPT", { target: "Rayfield Golf Club" });
            setIsTeeTimeOpen(true);
          }}
          onLearnMore={() => navigate("/golf")}
        />

        {isTeeTimeOpen && (
          <TeeTimeBookingModal isOpen onClose={() => setIsTeeTimeOpen(false)} />
        )}
      </main>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
};

export default Discover;