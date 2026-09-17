import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/NightlifeHero.module.css';

const filterPills = [
  { id: 'all', label: 'All' },
  { id: 'clubs', label: 'Clubs' },
  { id: 'lounges', label: 'Lounges' },
  { id: 'live-music', label: 'Live Music' },
  { id: 'late-night-eats', label: 'Late Night Eats' },
];

export const NightlifeHero = ({ onSearch, onCategorySelect }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');

  const handlePillClick = (id) => {
    setActiveCategory(id);
    if (onCategorySelect) onCategorySelect(id);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) onSearch(value);
  };

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroOverlay} />
      <div className={styles.heroContent}>
        <h1 className={styles.title}>Experience the Pulse of Jos After Dark</h1>
        <p className={styles.subtitle}>
          Discover the best clubs, lounges, and late-night spots the city has to offer.
        </p>

        {/* Search & Filter Container */}
        <div className={styles.searchCard}>
          <div className={styles.searchBar}>
            <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search venues, cuisines, or neighborhoods..."
              value={query}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.pillsRow}>
            {filterPills.map((pill) => (
              <button
                key={pill.id}
                type="button"
                className={`${styles.pill} ${activeCategory === pill.id ? styles.activePill : ''}`}
                onClick={() => handlePillClick(pill.id)}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NightlifeHero;