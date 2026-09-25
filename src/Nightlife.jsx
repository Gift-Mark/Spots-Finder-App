import { useState, useMemo } from 'react';
import Header from './Components/headerNav';
import NightlifeHero from './Components/NightlifeHero';
import FeaturedVenue from './Components/FeaturedVenue';
import TrendingSpots from './Components/TrendingSpots';
import ClaimVenueBanner from './Components/ClaimVenueBanner';
import Footer from './Components/Footer';
import styles from './CSS/Nightlife.module.css';

import { faMusic, faGlassWater, faChampagneGlasses, faUtensils } from '@fortawesome/free-solid-svg-icons';

// Master list of nightlife venues
const ALL_SPOTS = [
  {
    id: 1,
    name: 'Evergreen Garden',
    category: 'live-music',
    categoryLabel: 'Live Music',
    icon: faMusic,
    rating: '4.5',
    reviewsCount: '182',
    price: '$$',
    location: 'GRA, Jos',
    image: '/images/garden bar.avif',
  },
  {
    id: 2,
    name: 'Pulse Lounge',
    category: 'lounges',
    categoryLabel: 'Cocktails',
    icon: faGlassWater,
    rating: '4.7',
    reviewsCount: '306',
    price: '$$$',
    location: 'Secretariat Junction',
    image: '/images/Net bar.avif',
  },
  {
    id: 3,
    name: 'Hills View Club',
    category: 'clubs',
    categoryLabel: 'Club',
    icon: faChampagneGlasses,
    rating: '4.2',
    reviewsCount: '94',
    price: '$$',
    location: 'Laminga Route',
    image: '/images/Hills.avif',
  },
  {
    id: 4,
    name: 'Suya & Bites Late Grill',
    category: 'late-night-eats',
    categoryLabel: 'Late Night Eats',
    icon: faUtensils,
    rating: '4.6',
    reviewsCount: '120',
    price: '$',
    location: 'Ahmadu Bello Way',
    image: '/images/Sharwarma.jpg',
  },
];

export const NightlifePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Safe search & category filtering logic
  const filteredSpots = useMemo(() => {
    return ALL_SPOTS.filter((spot) => {
      if (!spot) return false;

      const matchesCategory =
        selectedCategory === 'all' ||
        (spot.category && spot.category.toLowerCase() === selectedCategory.toLowerCase());

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        spot.name.toLowerCase().includes(query) ||
        spot.location.toLowerCase().includes(query) ||
        spot.categoryLabel.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleClaimClick = () => {
    alert('Redirecting to Venue Claim Form...');
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 1. Global Navigation Bar */}
      <Header />

      {/* 2. Hero Section with Search & Category Pills */}
      <NightlifeHero
        onSearch={setSearchQuery}
        onCategorySelect={setSelectedCategory}
      />

      {/* 3. Main Content Section */}
      <main className={styles.mainContent}>
        {/* Featured Card Displayed when no specific search is narrowing results */}
        {!searchQuery && selectedCategory === 'all' && (
          <FeaturedVenue />
        )}

        {/* Dynamic Trending Spots Grid */}
        {filteredSpots.length > 0 ? (
          <TrendingSpots spots={filteredSpots} />
        ) : (
          <div className={styles.noResults}>
            <h3>No venues found</h3>
            <p>Try searching for a different area, venue name, or select another category filter.</p>
          </div>
        )}

        {/* Claim Venue Callout Banner */}
        <ClaimVenueBanner onClaimClick={handleClaimClick} />
      </main>

      {/* 4. Global Footer */}
      <Footer />
    </div>
  );
};

export default NightlifePage;