import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faMapMarkerAlt, faTicket, faClock, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { TOURIST_SPOTS } from '../../backend/data/attractionsData';
import styles from '../CSS/AttractionsPage.module.css';

const CATEGORIES = ['All', ...new Set(TOURIST_SPOTS.map((spot) => spot.category))];

export const AttractionsPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter spots by category and search term
  const filteredSpots = TOURIST_SPOTS.filter((spot) => {
    const matchesCategory = selectedCategory === 'All' || spot.category === selectedCategory;
    const matchesSearch = spot.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          spot.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={styles.pageWrapper}>
      {/* Header Banner */}
      <header className={styles.header}>
        <div className={styles.container}>
          <button type="button" className={styles.backBtn} onClick={() => navigate('/')}>
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Home
          </button>
          <span className={styles.kicker}>EXPLORE PLATEAU STATE</span>
          <h1 className={styles.title}>Top Tourist Spots in Jos & Beyond</h1>
          <p className={styles.subtitle}>
            Discover serene highland resorts, ancient heritage sites, natural waterfalls, and wildlife sanctuaries across Plateau State.
          </p>

          {/* Search Bar */}
          <div className={styles.searchBox}>
            <input 
              type="text" 
              placeholder="Search by spot name or location (e.g. Rayfield, Shere Hills)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`${styles.container} ${styles.mainContent}`}>
        {/* Category Tabs */}
        <div className={styles.categoryTabs}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`${styles.tabBtn} ${selectedCategory === cat ? styles.activeTab : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Spots Grid */}
        <div className={styles.spotsGrid}>
          {filteredSpots.map((spot) => (
            <div 
              key={spot.id} 
              className={styles.spotCard}
              onClick={() => navigate(`/attractions/${spot.id}`)}
              role="button"
              tabIndex={0}
            >
              <div className={styles.imageWrapper}>
                <img src={spot.image} alt={spot.name} className={styles.cardImage} />
                <span className={styles.badge}>{spot.badge}</span>
                <div className={styles.ratingBadge}>
                  <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
                  <span>{spot.rating}</span>
                  <small>({spot.reviewCount})</small>
                </div>
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.spotName}>{spot.name}</h3>
                <p className={styles.location}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.pinIcon} /> {spot.location}
                </p>
                <p className={styles.description}>{spot.description}</p>

                <div className={styles.metaRow}>
                  <span><FontAwesomeIcon icon={faTicket} /> {spot.entryFee}</span>
                  <span><FontAwesomeIcon icon={faClock} /> {spot.bestTimeToVisit.split('(')[0]}</span>
                </div>

                <div className={styles.highlightsRow}>
                  {spot.highlights.map((h, idx) => (
                    <span key={idx} className={styles.highlightTag}>{h}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AttractionsPage;