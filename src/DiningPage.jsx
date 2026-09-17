import { useState } from 'react';
import Header from './Components/headerNav';
import DiningHero from './Components/DiningHero';
import FeaturedCulinarySpotlight from './Components/FeaturedCulinarySpotslight';
import DiningStylesGrid from './Components/DiningStylesGrid';
import TopEstablishmentsGrid from './Components/TopEstablishmentsGrid';
import HighlandFarmAdvantage from './Components/HighlandFarm';
import DiningPartnerBanner from './Components/DiningPartner';
import Footer from './Components/Footer';
import styles from './CSS/DiningPage.module.css';

export const DiningPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ price: 'All' });

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleSelectStyle = (styleTitle) => {
    setSearchQuery(styleTitle);
  };

  const handleClaimClick = () => {
    alert('Redirecting to Restaurant & Venue Registration Form...');
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />

      <DiningHero 
        onSearch={handleSearch} 
        onFilterChange={handleFilterChange} 
      />

      <main className={styles.mainContent}>
        {/* Pass state values as props or use them to conditionally render */}
        <FeaturedCulinarySpotlight />

        <DiningStylesGrid onSelectStyle={handleSelectStyle} />

        {/* Pass search and price filters into the grid */}
        <TopEstablishmentsGrid searchQuery={searchQuery} priceFilter={filters.price} />

        <HighlandFarmAdvantage />

        <DiningPartnerBanner onClaimClick={handleClaimClick} />
      </main>

      <Footer />
    </div>
  );
};

export default DiningPage;