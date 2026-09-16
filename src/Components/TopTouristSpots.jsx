import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faLocationDot, 
  faGolfBallTee, 
  faTree, 
  faWater, 
  faLandmark 
} from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/TopTouristSpots.module.css';

const touristSpots = [
  {
    id: 'rayfield-holiday-resort',
    title: 'Rayfield Holiday Resort',
    category: 'Resort',
    rating: 4.8,
    image: '/assets/images/Rayfield Resort.jpg',
    reviews: 128,
    location: 'Jos East, Plateau State',
    large:true,
    icon: faTree,
    featured: true,
  },
  {
    id: 'assop-falls',
    title: 'Assop Falls',
    category: 'Nature',
    rating: 4.7,
    image: '/assets/images/Kurra-Falls.jpg',
    reviews: 95,
    location: 'Rayfield, Jos',
    icon: faGolfBallTee,
    featured: true,
  },
  {
    id: 'jos-museum',
    title: 'Jos Museum',
    category: 'Heritage',
    rating: 4.5,
    image: '/assets/images/assop_falls.jpg',
    reviews: 110,
    location: 'Hawan Kibo, Jos',
    icon: faWater,
    featured: false,
  },
  {
    id: 'jos-wildlife-park',
    title: 'Jos Wildlife Park',
    category: 'Culture & Wildlife',
    rating: 4.6,
    reviews: 84,
    location: 'Tudun Wada, Jos',
    image: '/assets/images/jos_wildlife.jpg',
    icon: faLandmark,
    featured: false,
  },
];

export const TopTouristSpots = ({ onSpotClick }) => {
  return (
    <section className={styles['jp-spots-section']}>
      <div className={styles['jp-spots-container']}>
        
        {/* Section Header */}
        <div className={styles['jp-spots-header']}>
          <div>
            <span className={styles['jp-spots-badge']}>Discover Plateau</span>
            <h2 className={styles['jp-spots-title']}>Top Tourist Spots in Jos</h2>
          </div>
          <p className={styles['jp-spots-description']}>
            Explore world-class landscapes, iconic landmarks, and historic recreational destinations across the Plateau.
          </p>
        </div>

        {/* Spot Cards Grid */}
        <div className={styles['jp-spots-grid']}>
          {touristSpots.map((spot) => (
            <article 
              key={spot.id} 
              className={styles['jp-spot-card']}
              onClick={() => onSpotClick && onSpotClick(spot.id)}
            >
              {/* Card Image Wrapper */}
              <div className={styles['jp-spot-image-wrapper']}>
                <img 
                  src={spot.image} 
                  alt={spot.title} 
                  className={styles['jp-spot-image']}  
                  loading="lazy"
                />
                {spot.featured && (
                  <span className={styles['jp-spot-featured-badge']}>Featured</span>
                )}
                <div className={styles['jp-spot-category-tag']}>
                  <FontAwesomeIcon icon={spot.icon} className={styles['jp-spot-category-icon']} />
                  <span>{spot.category}</span>
                </div>
              </div>

              {/* Card Content */}
              <div className={styles['jp-spot-body']}>
                <div className={styles['jp-spot-rating']}>
                  <FontAwesomeIcon icon={faStar} className={styles['jp-star-icon']} />
                  <span className={styles['jp-rating-score']}>{spot.rating}</span>
                  <span className={styles['jp-rating-count']}>({spot.reviews} reviews)</span>
                </div>

                <h3 className={styles['jp-spot-card-title']}>{spot.title}</h3>

                <div className={styles['jp-spot-location']}>
                  <FontAwesomeIcon icon={faLocationDot} className={styles['jp-location-icon']} />
                  <span>{spot.location}</span>
                </div>

                <div className={styles['jp-spot-footer']}>
                  <button type="button" className="jp-spot-action-btn">
                    Explore Details
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};