import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/PromotedEventsSection.module.css';
import nzemBeromImage from '../assets/images/nzem berom.jpg';
import WaterwayResort from '../assets/images/Waterway Resort.avif';
import tastyFingersImage from '../assets/images/Tasty Fingers.webp';
const defaultEvents = [
  {
    id: 1,
    title: 'Nzem Berom Cultural Festival',
    location: 'Rwang Pam Stadium',
    month: 'OCT',
    day: '14',
    price: 'Free',
    actionText: 'VIEW DETAILS',
    image: nzemBeromImage,
  },
  {
    id: 2,
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

        <div className={styles.promotedCard}>
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
              onClick={onBookTable}
            >
              Book a Table
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: FEATURED WEEKEND EVENTS */}
      <div className={styles.eventsColumn}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Featured Weekend Events</h2>
          <Link to="/events" className={styles.seeAllBtn}>
            <span>See all</span>
            <FontAwesomeIcon icon={faChevronRight} className={styles.arrowIcon} />
          </Link>
        </div>

        <div className={styles.eventsGrid}>
          {displayEvents.map((event) => (
            <div key={event.id} className={styles.eventCard}>
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
                  <Link to={`/events/${event.id}`} className={styles.actionBtn}>
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