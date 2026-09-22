import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faBuilding, faGlassWhiskey, faMusic, faWineGlass } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/LoungesHero.module.css';

const quickTags = [
  'All Spots',
  'Rooftops & Views',
  'Live Music & Acoustics',
  'Craft Cocktails',
  'Speakeasies',
  'Acoustic Nights',
];

const featureCards = [
  {
    id: 'granite-ridge',
    title: 'Granite Ridge Rooftops',
    subtitle: 'Panoramic highland mountain views, open-air breezes, and sunset views.',
    placesCount: 12,
    icon: faBuilding,
  },
  {
    id: 'artisan-speakeasies',
    title: 'Artisan Speakeasies',
    subtitle: 'Hidden entrance lounges, master craft mixology, and signature drinks.',
    placesCount: 8,
    icon: faGlassWhiskey,
  },
  {
    id: 'live-jazz',
    title: 'Live Jazz & Acoustic',
    subtitle: 'Soulful live bands, acoustic sets, and chilled highland rhythms.',
    placesCount: 15,
    icon: faMusic,
  },
  {
    id: 'wine-cigar',
    title: 'Wine & Cigar Clubs',
    subtitle: 'Refined lounge atmospheres, craft spirits, and private seating.',
    placesCount: 6,
    icon: faWineGlass,
  },
];

export const LoungesHero = ({ onSearch, onCategorySelect }) => {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('All Spots');

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (onSearch) onSearch(val);
  };

  const handleTagClick = (tag) => {
    setActiveTag(tag);
    if (onCategorySelect) onCategorySelect(tag);
  };

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroOverlay} />
      
      <div className={styles.heroContainer}>
        {/* Badge */}
        <span className={styles.sectionBadge}>
          HIGHLAND LOUNGES & BARS
        </span>

        {/* Main Headline & Subtitle */}
        <h1 className={styles.title}>
          Unwind Above the Clouds: Lounges & Bars in Jos
        </h1>
        <p className={styles.subtitle}>
          From breezy panoramic granite ridge rooftops to intimate speakeasies serving artisan botanical cocktails and live Plateau acoustic jazz under the cool 1,200m night sky.
        </p>

        {/* Search Input Bar */}
        <div className={styles.searchCard}>
          <div className={styles.inputGroup}>
            <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search bars, cocktail lounges, wine cellars, or spots in Rayfield, Old Airport..."
              value={query}
              onChange={handleSearchChange}
            />
          </div>
          <button type="button" className={styles.findBtn}>
            Find a Spot
          </button>
        </div>

        {/* Quick Filter Tag Pills */}
        <div className={styles.tagsContainer}>
          {quickTags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`${styles.tagPill} ${activeTag === tag ? styles.activeTagPill : ''}`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* 4 Feature Cards Row */}
        <div className={styles.featureCardsGrid}>
          {featureCards.map((card) => (
            <div 
              key={card.id} 
              className={styles.featureCard}
              onClick={() => handleTagClick(card.title)}
            >
              <div className={styles.cardHeader}>
                <FontAwesomeIcon icon={card.icon} className={styles.cardIcon} />
                <span className={styles.countBadge}>{card.placesCount} Spots</span>
              </div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardSubtitle}>{card.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LoungesHero;