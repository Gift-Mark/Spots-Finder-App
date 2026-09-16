import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  faGolfBallTee, 
  faMasksTheater, 
  faUtensils, 
  faGlassMartiniAlt, 
  faLandmark 
} from "@fortawesome/free-solid-svg-icons";

import Header from "./Components/headerNav.jsx";
import HeroSection from "./Components/HeroSection.jsx";
import places from "../server/data/places.js";
import { filterPlaces } from "./utils/filterPlaces";
import styles from "./discover.module.css";
import heroVideo from "./assets/videos/jos_pulse_hero_loop_draft.mp4";

export const Discover = () => {
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
    setActiveCategory(category);
  };

  // Filter Data Logic
  const searchedPlaces = filterPlaces(places, searchQuery);

  const categoryFilteredPlaces =
    activeCategory === "all" || activeCategory === "All"
      ? searchedPlaces
      : searchedPlaces.filter((place) =>
          place.category?.includes(activeCategory)
        );

  const touristSpots = categoryFilteredPlaces.filter(
    (place) => place.section === "tourist_spots" || place.section === "trending"
  );

  const featuredEvents = categoryFilteredPlaces.filter(
    (place) => place.section === "events" || place.section === "recommended"
  );

  const mainSpot = touristSpots[0];
  const sideSpots = touristSpots.slice(1, 3);

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
        {/* TOP TOURIST SPOTS */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Top Tourist Spots</h2>
            <Link to="/spots" className={styles.seeAll}>
              See all &gt;
            </Link>
          </div>

          <div className={styles.spotsGrid}>
            {mainSpot && (
              <div className={styles.mainSpotCard}>
                <img src={mainSpot.image} alt={mainSpot.title} />
                <span className={styles.badge}>{mainSpot.badge || "Resort"}</span>
                <div className={styles.cardInfo}>
                  <h3>{mainSpot.title}</h3>
                  <div className={styles.rating}>
                    <span>★ {mainSpot.rating || "4.5"}</span>{" "}
                    <span>({mainSpot.reviewsCount || 32})</span>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.sideSpotsGroup}>
              {sideSpots.map((spot) => (
                <div key={spot.id} className={styles.sideSpotCard}>
                  <img src={spot.image} alt={spot.title} />
                  <span className={styles.badge}>{spot.badge || "Spot"}</span>
                  <div className={styles.cardInfo}>
                    <h3>{spot.title}</h3>
                    <div className={styles.rating}>
                      <span>★ {spot.rating || "4.5"}</span>{" "}
                      <span>({spot.reviewsCount || 18})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROMOTED & FEATURED EVENTS */}
        <section className={styles.eventsPromotedSection}>
          <div className={styles.promotedColumn}>
            <div className={styles.sectionHeader}>
              <h2>Promoted</h2>
            </div>
            <div className={styles.promotedCard}>
              <span className={styles.adBadge}>Ad</span>
              <img
                src="/images/crest-restaurant.jpg"
                alt="The Crest Restaurant"
              />
              <div className={styles.promotedContent}>
                <h3>The Crest Restaurant</h3>
                <p>
                  Experience fine dining with a panoramic view of the city.
                  Exclusive...
                </p>
                <button className={styles.outlineBtn}>Book a Table</button>
              </div>
            </div>
          </div>

          <div className={styles.eventsColumn}>
            <div className={styles.sectionHeader}>
              <h2>Featured Weekend Events</h2>
              <Link to="/events" className={styles.seeAll}>
                See all &gt;
              </Link>
            </div>

            <div className={styles.eventsGrid}>
              {featuredEvents.map((event) => (
                <div key={event.id} className={styles.eventCard}>
                  <div className={styles.eventImageWrapper}>
                    <img src={event.image} alt={event.title} />
                    <div className={styles.dateBadge}>
                      <span className={styles.month}>{event.month || "OCT"}</span>
                      <span className={styles.day}>{event.day || "14"}</span>
                    </div>
                  </div>
                  <h3>{event.title}</h3>
                  <p className={styles.location}>📍 {event.location}</p>
                  <div className={styles.eventFooter}>
                    <span className={styles.price}>{event.price || "Free"}</span>
                    <a href="#action" className={styles.actionLink}>
                      {event.price ? "BUY TICKETS" : "VIEW DETAILS"}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HERITAGE SPOTLIGHT */}
        <section className={styles.spotlightBanner}>
          <span className={styles.spotlightBadge}>Heritage Spotlight</span>
          <h2>Rayfield Golf Club</h2>
          <p>
            Tee off at Africa's oldest golf course, established in 1913.
            Experience the perfect blend of rich history and premium sporting
            facilities set against stunning landscapes.
          </p>
          <div className={styles.bannerActions}>
            <button className={styles.btnPrimary}>Book a Tee Time</button>
            <button className={styles.bannerOutlineBtn}>Learn More</button>
          </div>
          <div className={styles.statsCard}>
            <div className={styles.statItem}>
              <strong>18</strong>
              <span>HOLE COURSE</span>
            </div>
            <hr />
            <div className={styles.statItem}>
              <strong>1913</strong>
              <span>ESTABLISHED</span>
            </div>
          </div>
        </section>
      </main>

      {/* 4. Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <h3>Jos Pulse</h3>
            <p>© 2026 Jos Pulse. Celebrating the spirit of the Plateau.</p>
          </div>
          <div className={styles.footerCol}>
            <h4>Explore</h4>
            <ul>
              <li>Local Guides</li>
              <li>Event Ticketing</li>
              <li>Claim Your Venue</li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>Legal</h4>
            <ul>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>Support</h4>
            <ul>
              <li>Contact Support</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Discover;