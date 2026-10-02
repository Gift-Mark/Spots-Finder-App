import { useState, useEffect } from 'react';
import Header from './Components/headerNav';
import HeroSection from './Components/HeroSection';
import HeritageGrid from './Components/HeritageGrid';
import styles from './CSS/culture.module.css';

import { Footer } from './Components/Footer';
import ItineraryProvider from './Components/ItineraryProvider';

const heroImage = '/images/shere hills.jpg';

export const CulturePage = () => {
  // Active State Management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userLocation, setUserLocation] = useState({ lat: 9.9167, lng: 8.8833 }); // Default: Central Jos

  // Automatically request browser GPS position on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Using default Jos coordinates:", error.message);
        }
      );
    }
  }, []);

  const handleSearch = (query, category) => {
    setSearchQuery(query);
    if (category) {
      setSelectedCategory(category);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header />

      <HeroSection
        badgeText="Destination Plateau"
        title="Culture & Heritage of the Plateau"
        subtitle="Discover the rugged beauty, ancient historical sites, and vibrant traditions that define the heart of Nigeria."
        placeholder="Search landmarks, museums..."
        heroImage={heroImage}
        onSearch={handleSearch}
      />
      
      {/* Main Interactive Workspace */}
      <main className={styles.mainContent}>
        <ItineraryProvider>
          <HeritageGrid 
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            userLocation={userLocation}
          />
        </ItineraryProvider>
      </main>

      <Footer />
    </div>
  );
};

export default CulturePage;