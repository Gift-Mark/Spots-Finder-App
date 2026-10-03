import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faSliders, faXmark } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/DiningHero.module.css';

const popularTags = [
  { label: 'Rayfield', query: 'Rayfield', target: 'top-establishments' },
  { label: 'Traditional Plateau', query: 'Traditional Plateau', target: 'dining-styles' },
  { label: 'Fine Dining Altitude', query: 'Fine Dining', target: 'featured-culinary' },
  { label: 'Suya & Spots', query: 'Suya', target: 'dining-styles' },
  { label: 'Outdoor Dining', query: 'Outdoor Dining', target: 'top-establishments' },
  { label: 'Cafes & Bakery', query: 'Cafe', target: 'dining-styles' },
];

const amenityOptions = [
  ['outdoorGardenSeating', 'Outdoor Garden Seating'],
  ['liveMusic', 'Live Music / DJ'],
  ['privateDining', 'Private Dining Rooms'],
  ['childFriendly', 'Child Friendly'],
  ['parking', 'Parking Available'],
  ['cocktailBar', 'Cocktail Bar'],
];

const dietaryOptions = [
  ['halal', 'Halal Certified'],
  ['vegetarian', 'Vegetarian / Vegan Options'],
];

const defaultFilters = {
  openNow: false,
  aroundTheClock: false,
  sortBy: '',
  ...Object.fromEntries([...amenityOptions, ...dietaryOptions].map(([key]) => [key, false])),
};

export const DiningHero = ({ onSearch, onFilterChange, activeFilters = defaultFilters }) => {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState(defaultFilters);

  useEffect(() => {
    if (!isFiltersOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsFiltersOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFiltersOpen]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setActiveTag(null);
    if (onSearch) onSearch(val);
  };

  const handlePriceChange = (e) => {
    const price = e.target.value;
    setSelectedPrice(price);
    if (onFilterChange) onFilterChange({ price });
  };

  const openFilters = () => {
    setDraftFilters({ ...defaultFilters, ...activeFilters });
    setIsFiltersOpen(true);
  };

  const updateDraftFilter = (key, value) => {
    setDraftFilters((current) => ({ ...current, [key]: value }));
  };

  const applyFilters = () => {
    if (onFilterChange) onFilterChange(draftFilters);
    setIsFiltersOpen(false);
  };

  const clearFilters = () => {
    const clearedFilters = { ...defaultFilters, price: selectedPrice };
    setDraftFilters(clearedFilters);
    if (onFilterChange) onFilterChange(clearedFilters);
  };

  const handleTagClick = (tag) => {
    const nextQuery = activeTag === tag.label ? '' : tag.query;
    setActiveTag(nextQuery ? tag.label : null);
    setQuery(nextQuery);
    if (onSearch) onSearch(nextQuery);

    if (nextQuery) {
      window.requestAnimationFrame(() => {
        document.getElementById(tag.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
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
                <option value="All">All Prices</option>
                <option value="₦">₦ (Budget / Street Food)</option>
                <option value="₦₦">₦₦ (Moderate / Casual)</option>
                <option value="₦₦₦">₦₦₦ (Fine Dining / Upscale)</option>
              </select>
            </div>

            <button
              type="button"
              className={styles.filterBtn}
              onClick={openFilters}
              aria-expanded={isFiltersOpen}
              aria-controls="dining-filter-drawer"
            >
              <FontAwesomeIcon icon={faSliders} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Popular Tags */}
        <div className={styles.tagsContainer}>
          {popularTags.map((tag) => (
            <button
              key={tag.label}
              type="button"
              className={`${styles.tagPill} ${activeTag === tag.label ? styles.activeTag : ''}`}
              aria-pressed={activeTag === tag.label}
              onClick={() => handleTagClick(tag)}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {isFiltersOpen && (
        <div className={styles.filterBackdrop} onClick={() => setIsFiltersOpen(false)}>
          <aside
            id="dining-filter-drawer"
            className={styles.filterDrawer}
            role="dialog"
            aria-modal="true"
            aria-labelledby="filterDrawerTitle"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.drawerHeader}>
              <h2 id="filterDrawerTitle">Dining filters</h2>
              <button
                type="button"
                className={styles.closeDrawerBtn}
                onClick={() => setIsFiltersOpen(false)}
                aria-label="Close filters"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className={styles.drawerBody}>
              <fieldset className={styles.filterGroup}>
                <legend>Opening Hours</legend>
                <label className={styles.filterOption}>
                  <input
                    type="checkbox"
                    checked={draftFilters.openNow}
                    onChange={(event) => updateDraftFilter('openNow', event.target.checked)}
                  />
                  <span>Open Now</span>
                </label>
                <label className={styles.filterOption}>
                  <input
                    type="checkbox"
                    checked={draftFilters.aroundTheClock}
                    onChange={(event) => updateDraftFilter('aroundTheClock', event.target.checked)}
                  />
                  <span>24 Hours</span>
                </label>
              </fieldset>

              <fieldset className={styles.filterGroup}>
                <legend>Amenities &amp; Features</legend>
                {amenityOptions.map(([key, label]) => (
                  <label className={styles.filterOption} key={key}>
                    <input
                      type="checkbox"
                      checked={draftFilters[key]}
                      onChange={(event) => updateDraftFilter(key, event.target.checked)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </fieldset>

              <fieldset className={styles.filterGroup}>
                <legend>Dietary Options</legend>
                {dietaryOptions.map(([key, label]) => (
                  <label className={styles.filterOption} key={key}>
                    <input
                      type="checkbox"
                      checked={draftFilters[key]}
                      onChange={(event) => updateDraftFilter(key, event.target.checked)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </fieldset>

              <div className={styles.filterGroup}>
                <label className={styles.sortLabel} htmlFor="dining-sort">Sort By</label>
                <select
                  id="dining-sort"
                  className={styles.sortSelect}
                  value={draftFilters.sortBy}
                  onChange={(event) => updateDraftFilter('sortBy', event.target.value)}
                >
                  <option value="">Recommended</option>
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviewed</option>
                  <option value="nearest">Nearest to Me</option>
                </select>
              </div>
            </div>

            <div className={styles.drawerFooter}>
              <button type="button" className={styles.clearFiltersBtn} onClick={clearFilters}>
                Clear all
              </button>
              <button type="button" className={styles.applyFiltersBtn} onClick={applyFilters}>
                Apply filters
              </button>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
};

export default DiningHero;