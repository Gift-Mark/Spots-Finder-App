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
import Footer from "./Components/Footer.jsx";
import styles from "./discover.module.css";
import heroVideo from "./assets/videos/jos_pulse_hero_loop_draft.mp4";
import JosPulseAI from "./Components/JosPulseAI.jsx";

// API Services
import { fetchPlaces, logUserBehavior } from "../src/api/client.js";

export const Discover = () => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(false);

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
  const discoverPills = [
    { id: "Golf", label: "Golf", icon: faGolfBallTee },
    { id: "Festivals", label: "Festivals", icon: faMasksTheater },
    { id: "Restaurants", label: "Restaurants", icon: faUtensils },
    { id: "Nightlife", label: "Nightlife", icon: faGlassMartiniAlt },
    { id: "Cultural Landmarks", label: "Cultural Landmarks", icon: faLandmark },
  ];

  // Fetch Places from Express API with Debounce
  useEffect(() => {
    const loadPlacesData = async () => {
      setLoading(true);
      try {
        const queryParams = {};
        if (searchQuery.trim()) queryParams.search = searchQuery;
        if (activeCategory !== "all" && activeCategory !== "All") {
          queryParams.category = activeCategory;
        }

        const response = await fetchPlaces(queryParams);
        setPlaces(response.data || []);

        // Log search event if user typed a query
        if (searchQuery.trim()) {
          logUserBehavior(sessionId, "SEARCH", { query: searchQuery });
        }
      } catch (err) {
        console.error("Failed to load discover places:", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      loadPlacesData();
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, activeCategory, sessionId]);

  // Hero Search and Pill Event Handlers
  const handleSearch = (query, category) => {
    setSearchQuery(query);
    if (category) setActiveCategory(category);
  };

  const handleCategorySelect = (category) => {
    logUserBehavior(sessionId, "CATEGORY_CLICK", { category });

    const categoryTargets = {
      Golf: "golf-spotlight",
      Festivals: "festival-events",
      Restaurants: "tasty-fingers-promo",
      "Cultural Landmarks": "cultural-landmark",
    };
    const targetId = categoryTargets[category];

    if (targetId) {
      document.getElementById(targetId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    if (category === "Nightlife") {
      navigate("/nightlife");
      return;
    }

    setActiveCategory(category);
  };

  // Derive featured events from API data
  const featuredEvents = places.filter(
    (place) => place.section === "events" || place.section === "recommended"
  );

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query && activeCategory === "all") {
      return places;
    }

    return places.filter((place) => {
      const matchesQuery =
        !query ||
        place.title?.toLowerCase().includes(query) ||
        place.location?.toLowerCase().includes(query) ||
        place.description?.toLowerCase().includes(query) ||
        place.category?.some((item) => item.toLowerCase().includes(query));

      const matchesCategory =
        activeCategory === "all" ||
        activeCategory === "All" ||
        !place.category ||
        place.category.some((item) => item.toLowerCase() === activeCategory.toLowerCase());

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
        {(searchQuery.trim() || activeCategory !== "all") && (
          <section className={styles.searchResultsSection}>
            <div className={styles.searchResultsHeader}>
              <h2>
                {searchQuery.trim()
                  ? `Results for “${searchQuery.trim()}”`
                  : `Showing ${activeCategory}`}
              </h2>
            </div>

            {loading ? (
              <p className={styles.loadingText}>Loading results...</p>
            ) : searchResults.length > 0 ? (
              <div className={styles.resultsGrid}>
                {searchResults.slice(0, 6).map((place) => (
                  <Link
                    key={place._id || place.id || place.slug}
                    to={`/place/${place.slug || place._id || place.id}`}
                    className={styles.resultCard}
                  >
                    <img src={place.image} alt={place.title} className={styles.resultImage} />
                    <div className={styles.resultContent}>
                      <span className={styles.resultBadge}>{place.badge || place.section}</span>
                      <h3>{place.title}</h3>
                      <p>{place.location}</p>
                      <div className={styles.resultMeta}>
                        <span>⭐ {place.rating || 4.5}</span>
                        <span>{place.price || "Free"}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={styles.noResultsBox}>
                <h3>No spots match your search</h3>
                <p>Try another keyword, category, or location in Jos.</p>
              </div>
            )}
          </section>
        )}

        {/* TOP TOURIST SPOTS COMPONENT */}
        <TopTouristSpots onSeeAll={() => navigate("/spots")} />

        {/* PROMOTED & FEATURED EVENTS */}
        <PromotedEventsSection
          events={featuredEvents.length > 0 ? featuredEvents : undefined}
          onBookTable={handleBookTable}
          loading={loading}
        />

        {/* HERITAGE SPOTLIGHT */}
        <HeritageSpotlight
          onBookTeeTime={() => {
            logUserBehavior(sessionId, "BOOKING_ATTEMPT", { target: "Rayfield Golf Club" });
            alert("Opening Tee Time Booking...");
          }}
          onLearnMore={() => navigate("/golf")}
        />

        {/* AI CONCIERGE */}
        <JosPulseAI sessionId={sessionId} />
      </main>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
};

export default Discover;