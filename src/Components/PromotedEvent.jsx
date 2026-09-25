import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faLocationDot, 
  faTicket, 
  faArrowRight 
} from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/PromotedEvent.module.css';

export const PromotedEvent = ({ event }) => {
  // Default fallback data matching the design if no prop is passed
  const defaultEvent = {
    title: "Plateau Rhythm & Roots Festival 2024",
    date: "NOV 12 - 14",
    category: "MUSIC & ARTS",
    description: "Experience three days of electrifying performances, local artisanal markets, and traditional culinary showcases set against the breathtaking backdrop...",
    location: "Shere Hills Arena, Jos",
    price: "Tickets from ₦5,000",
    image: "/images/anaguta-fest.png"
  };

  const data = event || defaultEvent;

  return (
    <div className={styles.promotedCardContainer}>
      <div className={styles.cardWrapper}>
        {/* Left Side: Image with Promoted Badge */}
        <div className={styles.imageContainer}>
          <img src={data.image} alt={data.title} className={styles.eventImage} />
          <span className={styles.promotedBadge}>
            <FontAwesomeIcon icon={faStar} className={styles.badgeIcon} /> Promoted
          </span>
        </div>

        {/* Right Side: Event Details */}
        <div className={styles.detailsContainer}>
          <div className={styles.metaHeader}>
            <span className={styles.dateCategory}>
              <strong>{data.date}</strong> • {data.category}
            </span>
          </div>

          <h2 className={styles.eventTitle}>{data.title}</h2>
          
          <p className={styles.description}>{data.description}</p>

          <div className={styles.infoGroup}>
            <span className={styles.infoItem}>
              <FontAwesomeIcon icon={faLocationDot} className={styles.icon} /> {data.location}
            </span>
            <span className={styles.dotSeparator}>•</span>
            <span className={styles.infoItem}>
              <FontAwesomeIcon icon={faTicket} className={styles.icon} /> {data.price}
            </span>
          </div>

          <button className={styles.ticketButton}>
            Get Tickets <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromotedEvent;