import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faSliders } from '@fortawesome/free-solid-svg-icons';
import styles from './DiningHero.module.css';

const popularTags = [
  'Rayfield',
  'Traditional Plateau',
  'Fine Dining Altitude',
  'Suya & Spots',
  'Outdoor Dining',
  'Cafes & Bakery',
];

export const DiningHero = ({ onSearch, onFilterChange }) => {
  const [query, setQuery] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('All');

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (onSearch) onSearch(val);
  };

  const handlePriceChange = (e) => {
    const price = e.target.value;
    setSelectedPrice(price);
    if (onFilterChange) onFilterChange({ price });
  };

  const handleTagClick = (tag) => {
    setQuery(tag);
    if (onSearch) onSearch(tag);
  };

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroOverlay} />
      <div className={styles.heroContent}>
        {/* Badge */}
        <span className={styles.sectionBadge}>
          <span className={styles.orangeDot} /> JOS DINING & RESTAURANTS
        </span>

        {/* Title & Subtitle */}
        <h1 className={styles.title}>
          Savor the Flavors of the Plateau: Restaurants & Dining in Jos
        </h1>
        <p className={styles.subtitle}>
          From sizzling authentic Plateau Suya and Masa spots to refined highland gastro-lounges offering scenic mountain views, uncover Jos’s most vibrant culinary spots.
        </p>

        {/* Search & Filter Bar */}
        <div className={styles.searchCard}>
          <div className={styles.inputGroup}>
            <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by restaurant name, cuisine, neighborhood (e.g. Rayfield, Suya)..."
              value={query}
              onChange={handleSearchChange}
            />
          </div>

          <div className={styles.controlsGroup}>
            <div className={styles.priceSelectWrapper}>
              <span className={styles.priceLabel}>PRICE</span>
              <select value={selectedPrice} onChange={handlePriceChange}>
                <option value="All">All</option>
                <option value="$">$</option>
                <option value="$$">$$</option>
                <option value="$$$">$$$</option>
              </select>
            </div>

            <button type="button" className={styles.filterBtn}>
              <FontAwesomeIcon icon={faSliders} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Popular Tags */}
        <div className={styles.tagsContainer}>
          {popularTags.map((tag, idx) => (
            <button
              key={idx}
              type="button"
              className={styles.tagPill}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiningHero;