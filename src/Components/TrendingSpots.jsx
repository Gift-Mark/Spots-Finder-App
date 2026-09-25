import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faLocationDot, 
  faMusic, 
  faGlassWater, 
  faChampagneGlasses 
} from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/TrendingSpots.module.css';

const defaultSpots = [
  {
    id: 1,
    name: 'Evergreen Garden',
    category: 'Live Music',
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
    category: 'Cocktails',
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
    category: 'Club',
    icon: faChampagneGlasses,
    rating: '4.2',
    reviewsCount: '94',
    price: '$$',
    location: 'Laminga Route',
    image: '/images/Hills.avif',
  },
];

export const TrendingSpots = ({ spots = defaultSpots }) => {
  return (
    <section className={styles.sectionContainer}>
      <h2 className={styles.sectionTitle}>Trending Spots</h2>

      <div className={styles.spotsGrid}>
        {spots.map((spot) => (
          <div key={spot.id} className={styles.spotCard}>
            {/* Image & Badge Overlay */}
            <div className={styles.imageWrapper}>
              <img src={spot.image} alt={spot.name} className={styles.cardImage} />
              <span className={styles.categoryBadge}>
                {spot.icon && <FontAwesomeIcon icon={spot.icon} className={styles.badgeIcon} />}
                {spot.category}
              </span>
            </div>

            {/* Card Content */}
            <div className={styles.cardContent}>
              <div className={styles.titleRow}>
                <h3 className={styles.spotName}>{spot.name}</h3>
                <span className={styles.priceTier}>{spot.price}</span>
              </div>

              <div className={styles.ratingRow}>
                <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
                <span className={styles.ratingText}>
                  {spot.rating} ({spot.reviewsCount})
                </span>
              </div>

              <p className={styles.locationText}>
                <FontAwesomeIcon icon={faLocationDot} className={styles.locationIcon} />
                {spot.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingSpots;