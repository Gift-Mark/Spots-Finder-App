import { useState } from 'react';
import Header from './Components/headerNav';
import LoungesHero from './Components/LoungesHero';
import LoungeSpotlight from './Components/LoungeSpotLight';
import TopVenuesGrid from './Components/TopVenuesGrid';
import JosNightVibe from './Components/JosNightVibe';
import LoungePartnerBanner from './Components/LoungePartnerBanner';
import Footer from './Components/Footer';
import styles from './CSS/LoungesPage.module.css';

export const LoungesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Spots');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleClaimClick = () => {
    alert('Redirecting to Lounge & Nightspot Partner Registration Form...');
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Global Navigation Header */}
      <Header />

      {/* Hero Header Section */}
      <LoungesHero 
        onSearch={handleSearch} 
        onCategorySelect={handleCategorySelect} 
      />

      {/* Main Page Content */}
      <main className={styles.mainContent}>
        {/* Curated Spotlight Choice */}
        <LoungeSpotlight />

        {/* 4-Column Grid: Top Venues This Week */}
        <TopVenuesGrid 
          searchQuery={searchQuery} 
          category={selectedCategory} 
        />

        {/* Informational Feature: Jos Night Vibe */}
        <JosNightVibe />

        {/* Partner Callout Banner */}
        <LoungePartnerBanner onClaimClick={handleClaimClick} />
      </main>

      {/* Global Navigation Footer */}
      <Footer />
    </div>
  );
};

export default LoungesPage;