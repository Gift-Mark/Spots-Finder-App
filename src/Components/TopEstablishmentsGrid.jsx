import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/TopEstablishedGrid.module.css';

const filterTabs = ['Popular', 'Top Rated', 'Highest Reviewed'];

const featureAliases = {
  outdoorGardenSeating: ['outdoorgardenseating', 'outdoor garden', 'garden'],
  liveMusic: ['livemusic', 'live music', 'dj'],
  privateDining: ['privatedining', 'private dining'],
  childFriendly: ['childfriendly', 'child friendly', 'family friendly'],
  parking: ['parking'],
  cocktailBar: ['cocktailbar', 'cocktail bar'],
  halal: ['halal'],
  vegetarian: ['vegetarian', 'vegan'],
};

const matchesPriceTier = (priceText = '', priceFilter) => {
  if (priceFilter === 'All' || !priceFilter) return true;

  const value = Number(priceText.replace(/[^\d]/g, ''));
  if (!Number.isFinite(value)) return false;
  if (priceFilter === '₦') return value < 3000;
  if (priceFilter === '₦₦') return value >= 3000 && value <= 10000;
  if (priceFilter === '₦₦₦') return value > 10000;
  return true;
};

const hasCoordinates = (place) => (
  Number.isFinite(place.coordinates?.latitude) &&
  Number.isFinite(place.coordinates?.longitude)
);

const distanceFrom = (place, userPosition) => {
  if (!hasCoordinates(place)) return Number.POSITIVE_INFINITY;

  const radians = (degrees) => (degrees * Math.PI) / 180;
  const latitudeDelta = radians(place.coordinates.latitude - userPosition.latitude);
  const longitudeDelta = radians(place.coordinates.longitude - userPosition.longitude);
  const value = Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(radians(userPosition.latitude)) *
      Math.cos(radians(place.coordinates.latitude)) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
};

export const TopEstablishmentsGrid = ({
  places = [],
  isLoading = false,
  error = '',
  priceFilter = 'All',
  searchQuery = '',
  filters = {},
}) => {
  const [activeTab, setActiveTab] = useState('Popular');
  const [userPosition, setUserPosition] = useState(null);
  const [locationError, setLocationError] = useState('');
  const normalizedQuery = searchQuery.trim().toLowerCase();

  useEffect(() => {
    if (filters.sortBy !== 'nearest') {
      setLocationError('');
      return undefined;
    }

    if (!navigator.geolocation) {
      setLocationError('Location is not available in this browser.');
      return undefined;
    }

    let isCurrentRequest = true;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (isCurrentRequest) {
          setUserPosition({ latitude: coords.latitude, longitude: coords.longitude });
          setLocationError('');
        }
      },
      () => {
        if (isCurrentRequest) setLocationError('Location permission was not granted.');
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );

    return () => {
      isCurrentRequest = false;
    };
  }, [filters.sortBy]);

  const filteredItems = places.filter((place) => {
    const matchesBudget = matchesPriceTier(place.price, priceFilter);
    const matchesOpening = (!filters.openNow || place.isOpenNow === true) &&
      (!filters.aroundTheClock || place.isOpen24Hours === true);
    const placeFeatures = [
      ...(place.amenities || []),
      ...(place.dietaryOptions || []),
      ...(place.tags || []),
    ].map((value) => String(value).toLowerCase().replace(/[\s/_-]/g, ''));
    const matchesFeatures = Object.entries(featureAliases).every(([key, aliases]) => (
      !filters[key] || aliases.some((alias) => (
        placeFeatures.some((feature) => feature.includes(alias.replace(/[\s/_-]/g, '')))
      ))
    ));

    const searchableText = [
      place.title,
      place.badge,
      place.cuisine,
      place.description,
      place.location,
      ...(place.category || []),
      ...(place.tags || []),
    ].join(' ').toLowerCase();

    return matchesBudget && matchesOpening && matchesFeatures && searchableText.includes(normalizedQuery);
  });

  const currentItems = [...filteredItems];
  if (filters.sortBy === 'nearest' && userPosition) {
    currentItems.sort((left, right) => distanceFrom(left, userPosition) - distanceFrom(right, userPosition));
  } else if (activeTab === 'Top Rated') {
    currentItems.sort((left, right) => Number(right.rating || 0) - Number(left.rating || 0));
  } else if (activeTab === 'Highest Reviewed') {
    currentItems.sort((left, right) => Number(right.reviewsCount || 0) - Number(left.reviewsCount || 0));
  } else {
    currentItems.sort((left, right) => Number(right.isPromoted) - Number(left.isPromoted));
  }

  return (
    <section id="top-establishments" className={styles.sectionContainer}>
      <div className={styles.headerRow}>
        <div>
          <span className={styles.sectionSubtitle}>TOP PICKS</span>
          <h2 className={styles.sectionTitle}>
            {activeTab === 'Popular' && 'Most Popular Establishments in Jos'}
            {activeTab === 'Top Rated' && 'Top Rated Places in Jos'}
            {activeTab === 'Highest Reviewed' && 'Highest Reviewed Spots in Jos'}
          </h2>
        </div>

        <div className={styles.tabsContainer}>
          {filterTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <p className={styles.emptyState}>Loading dining places...</p>}
      {!isLoading && error && <p className={styles.emptyState}>{error}</p>}

      {!isLoading && !error && currentItems.length > 0 && (
        <div className={styles.cardsGrid}>
          {currentItems.map((item) => {
            const placeId = item.slug || item._id || item.id;
            return (
              <Link key={item._id || item.id || item.title} to={`/place/${placeId}`} className={styles.cardLink}>
                <article className={styles.card}>
                  <div className={styles.imageWrapper}>
                    <img src={item.image} alt={item.title} className={styles.cardImage} />
                    <span className={styles.categoryBadge}>{item.badge || item.category?.[0]}</span>
                    <div className={styles.ratingBadge}>
                      <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
                      <span>{Number(item.rating || 0).toFixed(1)}</span>
                      <small className={styles.reviewCount}>({item.reviewsCount || 0})</small>
                    </div>
                  </div>

                  <div className={styles.cardContent}>
                    <div className={styles.titlePriceRow}>
                      <h3 className={styles.venueName}>{item.title}</h3>
                      <span className={styles.priceTier}>{item.price}</span>
                    </div>
                    <span className={styles.cuisineTag}>{item.cuisine || item.category?.[0]}</span>
                    <p className={styles.description}>{item.description}</p>
                    <div className={styles.actionRow}>
                      <span className={`${styles.actionBtn} ${styles.primary}`} aria-hidden> {item.buttonText || 'View details'}</span>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      )}

      {!isLoading && !error && currentItems.length === 0 && (
        <p className={styles.emptyState}>
          {places.length ? 'No establishments match these filters.' : 'No dining places are available yet.'}
        </p>
      )}
      {filters.sortBy === 'nearest' && !locationError && userPosition &&
        !currentItems.some(hasCoordinates) && (
          <p className={styles.emptyState}>Distance sorting is unavailable because these listings do not have coordinates.</p>
        )}
      {filters.sortBy === 'nearest' && locationError && (
        <p className={styles.emptyState}>{locationError}</p>
      )}
    </section>
  );
};

export default TopEstablishmentsGrid;