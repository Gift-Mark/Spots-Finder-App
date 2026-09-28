import { useState, useEffect } from 'react';
import { fetchPlaces } from '../api/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/TopsVenueGrid.module.css';

export const TopVenuesGrid = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for tab filtering
  const [activeTab, setActiveTab] = useState('All');
  const filterTabs = ['All', 'Sports', 'Racquet Sports', 'Motorsport'];

  useEffect(() => {
    const getTrendingVenues = async () => {
      try {
        setLoading(true);
        // Fetch items from the backend
        const response = await fetchPlaces({ section: 'trending' });
        setVenues(response.data || []);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load top spots');
      } finally {
        setLoading(false);
      }
    };

    getTrendingVenues();
  }, []);

  // Filter local state when activeTab changes
  const filteredVenues = activeTab === 'All'
    ? venues
    : venues.filter((venue) => 
        venue.category && venue.category.includes(activeTab)
      );

  if (loading) return <div className="p-6 text-center">Loading local spots...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <section className={styles.sectionContainer}>
      <div className={styles.headerRow}>
        <div>
          <span className={styles.sectionSubtitle}>CURATED HIGHLAND SPOTS</span>
          <h2 className={styles.sectionTitle}>Top Venues This Week</h2>
        </div>

        {/* Filter Tabs */}
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

      {/* 4-Column Cards Grid */}
      <div className={styles.cardsGrid}>
        {filteredVenues.map((venue) => (
          <div key={venue._id || venue.id} className={styles.card}>
            {/* Image & Status Badge Overlay */}
            <div className={styles.imageWrapper}>
              <img 
                src={venue.image} 
                alt={venue.title || venue.name} 
                className={styles.cardImage} 
              />
              
              <span className={`${styles.statusBadge} ${styles[venue.badgeVariant || 'green']}`}>
                {venue.badge || 'Featured'}
              </span>

              <div className={styles.ratingBadge}>
                <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
                <span><strong>{venue.rating || '4.5'}</strong></span>
              </div>
            </div>

            {/* Content Details */}
            <div className={styles.cardContent}>
              <div className={styles.locationRow}>
                <span className={styles.locationText}>{venue.location || 'Jos, Plateau'}</span>
                <span className={styles.cuisineText}>{venue.price || 'Free'}</span>
              </div>

              {/* Title mapping */}
              <h3 className={styles.venueName}>{venue.title || venue.name}</h3>
              <p className={styles.description}>{venue.description}</p>

              {/* Category / Tags Pills mapping with safely handled arrays */}
              <div className={styles.tagsRow}>
                {(venue.tags && venue.tags.length > 0 ? venue.tags : venue.category || []).map((tag, idx) => (
                  <span key={idx} className={styles.pillTag}>
                    {tag}
                  </span>
                ))}
              </div>

              <button type="button" className={styles.actionBtn}>
                <span>{venue.buttonText || 'Explore Spot'}</span>
                <FontAwesomeIcon icon={faArrowRight} className={styles.arrowIcon} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopVenuesGrid;