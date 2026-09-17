import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMusic, 
  faGolfBallTee, 
  faIcons, 
  faUtensils, 
  faCalendar,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/EventsHeader.module.css';

const categories = [
  { id: 'all', label: 'All Events' },
  { id: 'music', label: 'Music & Festivals', icon: faMusic },
  { id: 'sports', label: 'Golf & Sports', icon: faGolfBallTee },
  { id: 'traditional', label: 'Traditional', icon: faIcons },
  { id: 'dining', label: 'Dining', icon: faUtensils },
];

export const EventsHeader = ({ onFilterChange, onTimeframeChange }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('Upcoming Week');

  const handleCategoryClick = (id) => {
    setActiveCategory(id);
    if (onFilterChange) onFilterChange(id);
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.topRow}>
        <div>
          <h1 className={styles.title}>Discover the Pulse</h1>
          <p className={styles.subtitle}>
            Explore upcoming festivals, premier golf tournaments, and vibrant dining events across the rugged beauty of Plateau State.
          </p>
        </div>

        {/* Timeframe Select Dropdown */}
        <div className={styles.timeframeDropdown}>
          <FontAwesomeIcon icon={faCalendar} className={styles.calendarIcon} />
          <select 
            value={selectedTimeframe} 
            onChange={(e) => {
              setSelectedTimeframe(e.target.value);
              if (onTimeframeChange) onTimeframeChange(e.target.value);
            }}
          >
            <option value="Upcoming Week">Upcoming Week</option>
            <option value="This Month">This Month</option>
            <option value="This Weekend">This Weekend</option>
          </select>
          <FontAwesomeIcon icon={faChevronDown} className={styles.arrowIcon} />
        </div>
      </div>

      {/* Category Pills */}
      <div className={styles.pillsRow}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`${styles.pill} ${activeCategory === cat.id ? styles.activePill : ''}`}
            onClick={() => handleCategoryClick(cat.id)}
          >
            {cat.icon && <FontAwesomeIcon icon={cat.icon} className={styles.pillIcon} />}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventsHeader;