# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.






import { useState } from "react";
import Navbar from "./Components/NavBar";
import { Greeting } from "./Components/Greeting";
import { SearchBar } from "./Components/SearchBar";
import { Categories } from "./Components/categories";
import { SectionHeader } from "./Components/SectionHeader";
import { VibeWeekCard } from "./Components/Vibe";
import PlaceCard from "./Components/PlaceCard";
import places from "./data/places.js";

import styles from "./discover.module.css";

export const Discover = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { title: "All Hot" },
    { title: "Lounges" },
    { title: "Diner" },
    { title: "Roof Tops" },
    { title: "Parties" },
  ];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPlaces = places.filter((place) => {
    const q = searchQuery.trim().toLowerCase();

    if (!q) return true;

    return (
      place.title.toLowerCase().includes(q) ||
      place.location.toLowerCase().includes(q) ||
      place.category.some((category) =>
        category.toLowerCase().includes(q)
      ) ||
      (place.subtitle &&
        place.subtitle.toLowerCase().includes(q))
    );
  });

  const vibeResults = filteredPlaces.filter(
    (place) => place.section === "vibe"
  );

  const trendingResults = filteredPlaces.filter(
    (place) => place.section === "trending"
  );

  const recommendedResults = filteredPlaces.filter(
    (place) => place.section === "recommended"
  );

  return (
    <div className={styles["discover-container"]}>
      <Navbar title="JOS PULSE" showGear={false} />

      <Greeting
        name="Alex"
        subtitle="J-Town is alive."
      />

      <div className={styles["homepage"]}>
        <SearchBar
          placeholder="Find your vibe in Jos..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* SEARCH RESULTS */}

      {searchQuery.trim() !== "" && (
        <>
          <SectionHeader
            title={`Search Results (${filteredPlaces.length})`}
            icon="fa-solid fa-magnifying-glass"
            whiteTitle
          />

          <div className={styles["search-results"]}>
            {filteredPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                variant="search"
              />
            ))}
          </div>
        </>
      )}

      {/* HOME PAGE */}

      {searchQuery.trim() === "" && (
        <>
          <div className={styles["categories-wrapper"]}>
            {categories.map((category, index) => (
              <Categories
                key={category.title}
                {...category}
                active={index === 0}
              />
            ))}
          </div>

          <SectionHeader
            title="Vibe of the Week"
            icon="fa-sharp fa-regular fa-badge-check"
          />

          {vibeResults.map((place) => (
            <VibeWeekCard
              key={place.id}
              title={place.title}
              location={`${place.location} • ${place.subtitle}`}
            />
          ))}

          <SectionHeader
            title="Trending Now"
            buttonLabel="See All"
            whiteTitle
          />

          <div className={styles["trending-slider"]}>
            {trendingResults.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                variant="trending"
              />
            ))}
          </div>

          <SectionHeader
            title="Recommended for You"
            buttonLabel="Filter"
            buttonStyle={{ color: "#dfc9ff" }}
            whiteTitle
          />

          <div className={styles["recommended-container"]}>
            {recommendedResults.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                variant="recommended"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Discover;

import { useState } from "react";
import Navbar from "./Components/NavBar";
import { Greeting } from "./Components/Greeting";
import { SearchBar } from "./Components/SearchBar";
import { Categories } from "./Components/categories";
import { SectionHeader } from "./Components/SectionHeader";
import { VibeWeekCard } from "./Components/Vibe";
import PlaceCard from "./Components/PlaceCard";
import places from "./data/places.js";
import { filterPlaces } from "./utils/filterPlaces";

import styles from "./discover.module.css";

export const Discover = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Hot");

  const categories = [
    { title: "All Hot" },
    { title: "Lounges" },
    { title: "Diner" },
    { title: "Roof Tops" },
    { title: "Parties" },
  ];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPlaces = filterPlaces(places, searchQuery);

  const vibeResults = filteredPlaces.filter(
    (place) => place.section === "vibe",
  );

  const trendingResults = filteredPlaces.filter(
    (place) => place.section === "trending",
  );

  const recommendedResults = filteredPlaces.filter(
    (place) => place.section === "recommended",
  );

  const categoryFilteredPlaces =
    activeCategory === "All Hot"
      ? places
      : places.filter((place) => place.category.includes(activeCategory));

  return (
    <div className={styles["discover-container"]}>
      <Navbar title="JOS PULSE" showGear={false} />

      <Greeting name="Alex" subtitle="J-Town is alive." />

      <div className={styles["homepage"]}>
        <SearchBar
          placeholder="Find your vibe in Jos..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* SEARCH RESULTS */}

      {searchQuery.trim() !== "" && (
        <>
          <SectionHeader
            title={`Search Results (${filteredPlaces.length})`}
            icon="fa-solid fa-magnifying-glass"
            whiteTitle
          />

          <div className={styles["search-results"]}>
            {filterPlaces.length > 0 ? (
              filteredPlaces.map((place) => (
                <PlaceCard key={place.id} place={place} variant="search" />
              ))
            ) : (
              <div className={styles["no-results"]}>
                <div className={styles["no-results-icon"]}>🔍</div>

                <h3>No places found.</h3>

                <p>No results for {searchQuery}</p>
              </div>
            )}
          </div>
        </>
      )}
      {/* HOME PAGE */}

      {searchQuery.trim() === "" && (
        <>
          <div className={styles["categories-wrapper"]}>
            {categories.map((category, index) => (
              <Categories
                key={category.title}
                title={category.title}
                active={activeCategory === category.title}
                onClick={() => setActiveCategory(category.title)}
              />
            ))}
          </div>

          <SectionHeader
            title="Vibe of the Week"
            icon="fa-sharp fa-regular fa-badge-check"
          />

          {vibeResults.map((place) => (
            <VibeWeekCard
              key={place.id}
              title={place.title}
              location={`${place.location} • ${place.subtitle}`}
            />
          ))}

          <SectionHeader
            title="Trending Now"
            buttonLabel="See All"
            whiteTitle
          />

          <div className={styles["trending-slider"]}>
            {trendingResults.map((place) => (
              <PlaceCard key={place.id} place={place} variant="trending" />
            ))}
          </div>

          <SectionHeader
            title="Recommended for You"
            buttonLabel="Filter"
            buttonStyle={{ color: "#dfc9ff" }}
            whiteTitle
          />

          <div className={styles["recommended-container"]}>
            {recommendedResults.map((place) => (
              <PlaceCard key={place.id} place={place} variant="recommended" />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Discover;
