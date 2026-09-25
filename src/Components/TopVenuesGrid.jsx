import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/TopsVenueGrid.module.css';
const silkSuiteImage = '/images/Silk Suite.jpg';
const varlaineImage = '/images/varlaine.jpg';
const barcardiImage = '/images/Barcardi.jpg';
const hillStationImage = '/images/Hill Station.jpg';

const filterTabs = [
  'Popular Right Now',
  'Scenic Sunset Spots',
  'Live Music Lounges',
  'Late Night',
];

const defaultVenues = [
  {
    id: 1,
    name: 'Silk Suites Rooftop',
    badge: 'Open Now',
    badgeVariant: 'green',
    rating: '4.2',
    reviewsCount: '1,177',
    location: 'Rayfield/Bukuru Road area',
    cuisine: 'Rooftop Bar & Chill Drinks',
    description: 'Elevated scenic views overlooking Jos plateau sunset with artisan craft drinks.',
    tags: ['Scenic Views', 'Rooftop Bar'],
    buttonText: 'Book Table',
    image: silkSuiteImage,
  },
  {
    id: 2,
    name: 'Varlaine Park',
    badge: 'Featured Pick of the Week',
    badgeVariant: 'orange',
    rating: '3.2',
    reviewsCount: '210',
    location: 'No 2 Chan Road Rayfield Road, opposite New Govt House, Little, Jos, Plateau',
    cuisine: 'Cocktail Lounge / Grill',
    description: 'Rustic subterranean speakeasy vibe combined with an open-air granite terrace.',
    tags: ['Live Acoustic', 'Craft Cocktails'],
    buttonText: 'View Menu & Details',
    image: varlaineImage,
  },
  {
    id: 3,
    name: 'Barcardi Restaurant',
    badge: 'Open Now',
    badgeVariant: 'green',
    rating: '4.4',
    reviewsCount: '251',
    location: '11  Dandaura Road Off Wase Road',
    cuisine: 'Speakeasy & Jazz Bar',
    description: 'Intimate seating, premium scotch menu, and warm acoustic jazz performances.',
    tags: ['Whiskey Lounge', 'Live Jazz'],
    buttonText: 'Book Table',
    image: barcardiImage,
  },
  {
    id: 4,
    name: 'Hill Station Hotel',
    badge: 'Vintage Wine Tasting',
    badgeVariant: 'dark',
    rating: '3.7',
    reviewsCount: '401',
    location: '10 Tudun Wada Road, Jos, Plateau State',
    cuisine: 'Wine Cellar & Bistro',
    description: 'Historic cellar atmosphere with private wine tasting and European bistro bites.',
    tags: ['Wine Cellar', 'Private Dining'],
    buttonText: 'Book Table',
    image: hillStationImage,
  },
];

export const TopVenuesGrid = ({ venues = defaultVenues }) => {
  const [activeTab, setActiveTab] = useState('Popular Right Now');

  return (
    <section className={styles.sectionContainer}>
      <div className={styles.headerRow}>
        <div>
          <span className={styles.sectionSubtitle}>CURATED HIGHLAND SPOTS</span>
          <h2 className={styles.sectionTitle}>Top Venues This Week</h2>
        </div>

        {/* Filter Tabs */}
        <div className={styles.tabsContainer}>
          {filterTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 4-Column Cards Grid */}
      <div className={styles.cardsGrid}>
        {venues.map((venue) => (
          <div key={venue.id} className={styles.card}>
            {/* Image & Status Badge Overlay */}
            <div className={styles.imageWrapper}>
              <img src={venue.image} alt={venue.name} className={styles.cardImage} />
              
              <span className={`${styles.statusBadge} ${styles[venue.badgeVariant]}`}>
                {venue.badge}
              </span>

              <div className={styles.ratingBadge}>
                <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
                <span><strong>{venue.rating}</strong></span>
              </div>
            </div>

            {/* Content Details */}
            <div className={styles.cardContent}>
              <div className={styles.locationRow}>
                <span className={styles.locationText}>{venue.location}</span>
                <span className={styles.cuisineText}>{venue.cuisine}</span>
              </div>

              <h3 className={styles.venueName}>{venue.name}</h3>
              <p className={styles.description}>{venue.description}</p>

              <div className={styles.tagsRow}>
                {venue.tags.map((tag, idx) => (
                  <span key={idx} className={styles.pillTag}>
                    {tag}
                  </span>
                ))}
              </div>

              <button type="button" className={styles.actionBtn}>
                <span>{venue.buttonText}</span>
                <FontAwesomeIcon icon={faArrowRight} className={styles.arrowIcon} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopVenuesGrid;