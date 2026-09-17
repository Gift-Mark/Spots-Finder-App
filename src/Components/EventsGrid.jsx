import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/EventsGrid.module.css';

const defaultEvents = [
  {
    id: 1,
    category: 'Golf & Sports',
    image: './assets/images/golf-event.jpg',
    dateText: 'This Saturday, 7:00 AM',
    title: 'Rayfield Annual Classic Tournament',
    location: 'Rayfield Golf Club',
  },
  {
    id: 2,
    category: 'Dining',
    image: './assets/images/dining-event.jpg',
    dateText: 'Next Friday, 6:30 PM',
    title: 'Plateau Culinary Heritage Dinner',
    location: 'The View Restaurant',
  },
  {
    id: 3,
    category: 'Adventure',
    image: './assets/images/adventure-event.jpg',
    dateText: 'Dec 5, 8:00 AM',
    title: 'Wase Rock Expedition Challenge',
    location: 'Wase Town Basecamp',
  },
];

export const EventsGrid = ({ events, onLoadMore, hasMore = true }) => {
  return (
    <div className={styles.gridContainer}>
      <div className={styles.cardsGrid}>
        {events.map((event) => (
          <div key={event.id} className={styles.eventCard}>
            <div className={styles.imageWrapper}>
              <img src={event.image} alt={event.title} className={styles.cardImage} />
              <span className={styles.categoryBadge}>{event.categoryLabel || event.category}</span>
            </div>

            <div className={styles.cardContent}>
              <span className={styles.dateText}>{event.dateText}</span>
              <h3 className={styles.eventTitle}>{event.title}</h3>
              <p className={styles.locationText}>
                <FontAwesomeIcon icon={faLocationDot} className={styles.locationIcon} />
                {event.location}
              </p>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className={styles.loadMoreContainer}>
          <button className={styles.loadMoreBtn} onClick={onLoadMore}>
            Load More Events <FontAwesomeIcon icon={faChevronDown} className={styles.arrowIcon} />
          </button>
        </div>
      )}
    </div>
  );
};

export default EventsGrid;