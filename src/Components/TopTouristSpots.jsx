import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faChevronRight, faUmbrellaBeach, faWater, faLandmark } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/TopTouristSpots.module.css';
const rayfieldResortImage = '/images/Rayfield Resort.jpg';
const kurraFallsImage = '/images/Kurra-Falls.jpg';
const josMuseumImage = '/images/Jos Museum.jpg';

const mainSpot = {
  id: 1,
  name: 'Rayfield Holiday Resort',
  category: 'Resort',
  icon: faUmbrellaBeach,
  rating: 4.8,
  reviewsCount: 32,
  image: rayfieldResortImage,
};

const rightSpots = [
  {
    id: 2,
    name: 'Kurra Falls',
    category: 'Nature',
    icon: faWater,
    rating: 4.7,
    reviewsCount: 28,
    image: kurraFallsImage,
  },
  {
    id: 3,
    name: 'Jos Museum',
    category: 'Heritage',
    icon: faLandmark,
    rating: 4.5,
    reviewsCount: 19,
    image: josMuseumImage,
  },
];

export const TopTouristSpots = ({ onSeeAll }) => {
  return (
    <section className={styles.sectionContainer}>
      {/* Section Header */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Top Tourist Spots</h2>
        <button type="button" className={styles.seeAllBtn} onClick={onSeeAll}>
          <span>See all</span>
          <FontAwesomeIcon icon={faChevronRight} className={styles.arrowIcon} />
        </button>
      </div>

      {/* Asymmetrical Grid Container */}
      <div className={styles.gridContainer}>
        {/* Left Featured Main Card */}
        <div className={styles.mainCard}>
          <img src={mainSpot.image} alt={mainSpot.name} className={styles.cardImage} />
          <div className={styles.imageOverlay} />

          {/* Category Pill Badge */}
          <div className={styles.categoryBadge}>
            <FontAwesomeIcon icon={mainSpot.icon} />
            <span>{mainSpot.category}</span>
          </div>

          {/* Card Content Overlay */}
          <div className={styles.cardContent}>
            <h3 className={styles.spotNameLarge}>{mainSpot.name}</h3>
            <div className={styles.ratingRow}>
              <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
              <span className={styles.ratingScore}>{mainSpot.rating}</span>
              <span className={styles.reviewsCount}>({mainSpot.reviewsCount})</span>
            </div>
          </div>
        </div>

        {/* Right Stacked Column */}
        <div className={styles.rightColumn}>
          {rightSpots.map((spot) => (
            <div key={spot.id} className={styles.smallCard}>
              <img src={spot.image} alt={spot.name} className={styles.cardImage} />
              <div className={styles.imageOverlay} />

              {/* Category Badge */}
              <div className={styles.categoryBadge}>
                <FontAwesomeIcon icon={spot.icon} />
                <span>{spot.category}</span>
              </div>

              {/* Card Content Overlay */}
              <div className={styles.cardContent}>
                <h4 className={styles.spotNameSmall}>{spot.name}</h4>
                <div className={styles.ratingRow}>
                  <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
                  <span className={styles.ratingScore}>{spot.rating}</span>
                  <span className={styles.reviewsCount}>({spot.reviewsCount})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopTouristSpots;