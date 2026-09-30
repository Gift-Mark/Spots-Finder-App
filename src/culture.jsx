import { useState, useEffect } from 'react';
import Header from './Components/headerNav';
import HeroSection from './Components/HeroSection';
import HeritageGrid from './Components/HeritageGrid';
import HeritageMapView from './Components/HeritageMapView';
import { heritageItems } from './data/heritageItems';
import styles from './CSS/culture.module.css';

import { 
  faLandmark, 
  faBuildingColumns, 
  faMasksTheater 
} from '@fortawesome/free-solid-svg-icons';
import { Footer } from './Components/Footer';

const heroImage = '/images/shere hills.jpg';

export const CulturePage = () => {
  const culturePills = [
    { id: 'all', label: 'All', icon: null },
    { id: 'historical', label: 'Historical Sites', icon: faLandmark },
    { id: 'museums', label: 'Museums', icon: faBuildingColumns },
    { id: 'festivals', label: 'Traditional Festivals', icon: faMasksTheater },
  ];

  // Active State Management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'
  const [selectedSpot, setSelectedSpot] = useState(null);
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

  const handleLoadMore = () => {
    console.log('Loading additional heritage sites...');
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
        filterPills={culturePills}
        selectedCategory={selectedCategory}
        onCategorySelect={(catId) => setSelectedCategory(catId)}
        onSearch={handleSearch}
      />
      
      {/* Main Interactive Workspace */}
      <main className={styles.mainContent}>
        {/* Map / Grid Mode Toggle Bar */}
        <div className={styles.viewToggleBar}>
          <div className={styles.toggleButtons}>
            <button
              className={`${styles.toggleBtn} ${viewMode === 'grid' ? styles.activeToggle : ''}`}
              onClick={() => setViewMode('grid')}
            >
              🔲 Grid View
            </button>
            <button
              className={`${styles.toggleBtn} ${viewMode === 'map' ? styles.activeToggle : ''}`}
              onClick={() => setViewMode('map')}
            >
              🗺️ Map View
            </button>
          </div>
        </div>

        {/* Dynamic Display Switch */}
        {viewMode === 'grid' ? (
          <HeritageGrid 
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            userLocation={userLocation}
            onLoadMore={handleLoadMore} 
          />
        ) : (
          <HeritageMapView 
            spots={heritageItems}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            userLocation={userLocation}
            selectedSpot={selectedSpot}
            onSpotSelect={setSelectedSpot}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CulturePage;