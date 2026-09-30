import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/PromotedEventsSection.module.css';

const nzemBeromImage = '/images/nzem berom.jpg';
const WaterwayResort = '/images/Waterway Resort.avif';
const tastyFingersImage = '/images/Tasty Fingers.webp';

const defaultEvents = [
  {
    id: 'nzem-berom',
    title: 'Nzem Berom Cultural Festival',
    location: 'Rwang Pam Stadium',
    month: 'OCT',
    day: '14',
    price: 'Free',
    actionText: 'VIEW DETAILS',
    image: nzemBeromImage,
  },
  {
    id: 'plateau-live-music',
    title: 'Plateau Live Music Night',
    location: 'Waterway Resort',
    month: 'OCT',
    day: '16',
    price: '₦5,000',
    actionText: 'BUY TICKETS',
    image: WaterwayResort,
  },
];

export const PromotedEventsSection = ({ events = defaultEvents, onBookTable }) => {
  const navigate = useNavigate();

  const displayEvents = events?.every(
    (event) => event.month && event.day && event.price && event.actionText && event.image
  )
    ? events
    : defaultEvents;

  return (
    <section className={styles.sectionContainer}>
      {/* LEFT COLUMN: PROMOTED CARD */}
      <div className={styles.promotedColumn}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Promoted</h2>
        </div>

        <div 
          id="tasty-fingers-promo"
          className={styles.promotedCard}
          onClick={() => navigate('/place/tasty-fingers')}
          style={{ cursor: 'pointer' }}
        >
          <div className={styles.imageWrapper}>
            <img
              src={tastyFingersImage}
              alt="Tasty Fingers Restaurant"
              className={styles.promotedImage}
            />
            <span className={styles.adBadge}>Ad</span>
          </div>

          <div className={styles.promotedBody}>
            <h3 className={styles.promotedTitle}>Tasty Fingers Restaurant</h3>
            <p className={styles.promotedDescription}>
              Experience fine dining with a panoramic view of the city. Exclusive...
            </p>
            <button
              type="button"
              className={styles.bookTableBtn}
              onClick={(e) => {
                e.stopPropagation(); // Prevents card click navigation if custom booking handler is passed
                if (onBookTable) {
                  onBookTable();
                } else {
                  navigate('/place/tasty-fingers');
                }
              }}
            >
              Book a Table
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: FEATURED WEEKEND EVENTS */}
      <div id="festival-events" className={styles.eventsColumn}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Featured Weekend Events</h2>
          <Link to="/events" className={styles.seeAllBtn}>
            <span>See all</span>
            <FontAwesomeIcon icon={faChevronRight} className={styles.arrowIcon} />
          </Link>
        </div>

        <div className={styles.eventsGrid}>
          {displayEvents.map((event) => (
            <div 
              key={event.id} 
              className={styles.eventCard}
              onClick={() => navigate(`/place/${event.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.eventImageWrapper}>
                <img
                  src={event.image}
                  alt={event.title}
                  className={styles.eventImage}
                />
                <div className={styles.dateBadge}>
                  <span className={styles.dateMonth}>{event.month}</span>
                  <span className={styles.dateDay}>{event.day}</span>
                </div>
              </div>

              <div className={styles.eventBody}>
                <h3 className={styles.eventTitle}>{event.title}</h3>
                <div className={styles.locationRow}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.mapIcon} />
                  <span>{event.location}</span>
                </div>

                <div className={styles.eventFooter}>
                  <span className={styles.eventPrice}>{event.price}</span>
                  <Link 
                    to={`/place/${event.id}`} 
                    className={styles.actionBtn}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {event.actionText}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotedEventsSection;