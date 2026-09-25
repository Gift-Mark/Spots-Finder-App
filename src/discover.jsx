import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { places } from "../server/data/places.js";
import { filterPlaces } from "./utils/filterPlaces";
import styles from "./discover.module.css";
import heroVideo from "./assets/videos/jos_pulse_hero_loop_draft.mp4";
import JosPulseAI from "./Components/JosPulseAI.jsx"

export const Discover = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Reusable Hero Pills Configuration
  const discoverPills = [
    { id: "Golf", label: "Golf", icon: faGolfBallTee },
    { id: "Festivals", label: "Festivals", icon: faMasksTheater },
    { id: "Restaurants", label: "Restaurants", icon: faUtensils },
    { id: "Nightlife", label: "Nightlife", icon: faGlassMartiniAlt },
    { id: "Cultural Landmarks", label: "Cultural Landmarks", icon: faLandmark },
  ];

  // Hero Search and Pill Event Handlers
  const handleSearch = (query, category) => {
    setSearchQuery(query);
    if (category) setActiveCategory(category);
  };

  const handleCategorySelect = (category) => {
    if (category === "Nightlife") {
      navigate("/nightlife");
      return;
    }

    setActiveCategory(category);
  };

  // Filter Data Logic
  const searchedPlaces = filterPlaces(places, searchQuery);

  const categoryFilteredPlaces =
    activeCategory === "all" || activeCategory === "All"
      ? searchedPlaces
      : searchedPlaces.filter((place) =>
          place.category?.includes(activeCategory),
        );

  const featuredEvents = categoryFilteredPlaces.filter(
    (place) => place.section === "events" || place.section === "recommended",
  );

  const handleBookTable = () => {
    alert("Opening booking modal for The Crest Restaurant...");
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
        {/* TOP TOURIST SPOTS COMPONENT */}
        <TopTouristSpots onSeeAll={() => navigate("/spots")} />

        {/* PROMOTED & FEATURED EVENTS */}
        <PromotedEventsSection
          events={featuredEvents.length > 0 ? featuredEvents : undefined}
          onBookTable={handleBookTable}
        />

        {/* HERITAGE SPOTLIGHT */}
        <HeritageSpotlight
          onBookTeeTime={() => alert("Opening Tee Time Booking...")}
          onLearnMore={() =>
            alert("Navigating to Rayfield Golf Club details...")
          }
        />

        {/* AI */}
        <JosPulseAI />
      </main>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
};

export default Discover;
