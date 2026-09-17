import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar} from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/TopEstablishedGrid.module.css';

const filterTabs = ['Popular', 'Top Rated', 'Highest Reviewed'];

const defaultEstablishments = [
  {
    id: 1,
    name: 'Rayfield Terrace & Bistro',
    badge: 'Highland Fine Dining',
    rating: '4.9',
    reviewsCount: '180',
    price: '$$$',
    cuisine: 'Fine Dining / Outdoor',
    description: 'Scenic outdoor garden dining overlooking Rayfield water body.',
    buttonText: 'Book Table',
    buttonVariant: 'secondary',
    image: './assets/images/rayfield-terrace.jpg'
  },
  {
    id: 2,
    name: 'Plateau Heritage Kitchen',
    badge: '100% Traditional Choice',
    rating: '4.8',
    reviewsCount: '230',
    price: '$$',
    cuisine: 'Local Plateau Cuisine',
    description: 'Renowned for fresh Gwete, Masa, and highland herbal teas.',
    buttonText: 'Reserve a Table',
    buttonVariant: 'primary',
    image: './assets/images/heritage-kitchen.jpg'
  },
  {
    id: 3,
    name: 'Aura Sky Lounge & Eatery',
    badge: 'New & Trending',
    rating: '4.7',
    reviewsCount: '128',
    price: '$$$',
    cuisine: 'Rooftop Lounge',
    description: 'Upmarket mountain view lounge featuring craft cocktails.',
    buttonText: 'Book Table',
    buttonVariant: 'secondary',
    image: './assets/images/aura-sky-lounge.jpg'
  },
  {
    id: 4,
    name: 'Highland Strawberry Cafe',
    badge: 'Outdoor Garden',
    rating: '4.9',
    reviewsCount: '310',
    price: '$$',
    cuisine: 'Cafe / Bakery',
    description: 'Specializing in fresh local Jos strawberries and organic pastries.',
    buttonText: 'Explore Menu',
    buttonVariant: 'outline',
    image: './assets/images/strawberry-cafe.jpg'
  }
];

export const TopEstablishmentsGrid = ({ items = defaultEstablishments }) => {
  const [activeTab, setActiveTab] = useState('Popular');

  return (
    <section className={styles.sectionContainer}>
      <div className={styles.headerRow}>
        <div>
          <span className={styles.sectionSubtitle}>TOP PICKS</span>
          <h2 className={styles.sectionTitle}>Highest Rated Establishments in Jos</h2>
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
        {items.map((item) => (
          <div key={item.id} className={styles.card}>
            {/* Image Overlay & Badge */}
            <div className={styles.imageWrapper}>
              <img src={item.image} alt={item.name} className={styles.cardImage} />
              <span className={styles.categoryBadge}>{item.badge}</span>
              <div className={styles.ratingBadge}>
                <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
                <span>{item.rating}</span>
              </div>
            </div>

            {/* Content Details */}
            <div className={styles.cardContent}>
              <div className={styles.titlePriceRow}>
                <h3 className={styles.venueName}>{item.name}</h3>
                <span className={styles.priceTier}>{item.price}</span>
              </div>

              <span className={styles.cuisineTag}>{item.cuisine}</span>
              <p className={styles.description}>{item.description}</p>

              {/* Dynamic Action Button */}
              <button
                type="button"
                className={`${styles.actionBtn} ${styles[item.buttonVariant]}`}
              >
                {item.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopEstablishmentsGrid;