import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Components/headerNav';
import DiningHero from './Components/DiningHero';
import FeaturedCulinarySpotlight from './Components/FeaturedCulinarySpotslight';
import DiningStylesGrid from './Components/DiningStylesGrid';
import TopEstablishmentsGrid from './Components/TopEstablishmentsGrid';
import HighlandFarmAdvantage from './Components/HighlandFarm';
import DiningPartnerBanner from './Components/DiningPartner';
import Footer from './Components/Footer';
import { fetchPlaces } from './api/client';
import styles from './CSS/DiningPage.module.css';

export const DiningPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ price: 'All' });
  const [diningPlaces, setDiningPlaces] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(true);
  const [placesError, setPlacesError] = useState('');

  useEffect(() => {
    let isMounted = true;

    fetchPlaces({ section: 'dining' })
      .then((response) => {
        if (!isMounted) return;
        setDiningPlaces(response.data || []);
        setPlacesError('');
      })
      .catch(() => {
        if (isMounted) setPlacesError('Dining places could not be loaded. Check the connection and try again.');
      })
      .finally(() => {
        if (isMounted) setPlacesLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredPlace = diningPlaces.find((place) => place.isFeatured) || diningPlaces[0];
  const spotlight = featuredPlace && {
    id: featuredPlace._id,
    title: featuredPlace.title,
    rating: featuredPlace.rating,
    reviewsCount: featuredPlace.reviewsCount,
    badges: featuredPlace.category || [],
    description: featuredPlace.description,
    location: featuredPlace.location,
    cuisine: featuredPlace.cuisine || featuredPlace.category?.[0],
    image: featuredPlace.image,
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleSelectStyle = (styleTitle) => {
    setSearchQuery(styleTitle);

    if (styleTitle === 'Restaurants & Lounges') {
      navigate('/restaurants-directory?category=restaurants-lounges');
    }

    if (styleTitle === 'Authentic Plateau Bites') {
      navigate('/plateau-bites-directory');
    }

    if (styleTitle === 'Cozy Cafes & Breakfast') {
      navigate('/cozy-cafes-directory');
    }

    if (styleTitle === 'Suya Spots & Grills') {
      navigate('/famous-suya-directory');
    }
  };

  const handleClaimClick = () => {
    navigate('/partner-landing');
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />

      <DiningHero 
        onSearch={handleSearch} 
        onFilterChange={handleFilterChange} 
        activeFilters={filters}
      />

      <main className={styles.mainContent}>
        {/* Pass state values as props or use them to conditionally render */}
        <FeaturedCulinarySpotlight spotlight={spotlight} />

        <DiningStylesGrid places={diningPlaces} onSelectStyle={handleSelectStyle} />

        {/* Pass search and price filters into the grid */}
        <TopEstablishmentsGrid
          places={diningPlaces}
          isLoading={placesLoading}
          error={placesError}
          searchQuery={searchQuery}
          priceFilter={filters.price}
          filters={filters}
        />

        <HighlandFarmAdvantage />

        <DiningPartnerBanner onClaimClick={handleClaimClick} />
      </main>

      <Footer />
    </div>
  );
};

export default DiningPage;