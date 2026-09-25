import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar} from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/TopEstablishedGrid.module.css';
const barcardiImage = '/images/Barcardi.jpg';
const valadaImage = '/images/Valada.jpg';
const varlaineImage = '/images/varlaine.jpg';
const tinCityCafeImage = '/images/Tin City cafe.jpg';

const filterTabs = ['Popular', 'Top Rated', 'Highest Reviewed'];

const defaultEstablishments = [
  {
    id: 1,
    name: 'Barcardi Jos',
    badge: 'Highland Fine Dining',
    rating: '4.4',
    reviewsCount: '245+',
    price: ' ₦4,500',
    cuisine: 'Italian / Outdoor',
    description: 'Scenic outdoor garden dining in GRA with romantic ambience and call-button service.',
    buttonText: 'Book Table',
    buttonVariant: 'secondary',
    image: barcardiImage
  },
  {
    id: 2,
    name: 'Valada',
    badge: '100% Traditional Choice',
    rating: '4.0',
    reviewsCount: '1,163',
    price: '₦4,000',
    cuisine: 'Local Plateau Cuisine',
    description: 'Renowned for fresh Gwete, Masa, and highland herbal teas.',
    buttonText: 'Reserve a Table',
    buttonVariant: 'primary',
    image: valadaImage
  },
  {
    id: 3,
    name: 'Varlaine Lounge',
    badge: 'New & Trending',
    rating: '4.2',
    reviewsCount: '1.7K',
    price: '₦8,000',
    cuisine: 'Rooftop Lounge',
    description: 'Boast a rooftop lounge with panoramic city views with craft cocktails.',
    buttonText: 'Book Table',
    buttonVariant: 'secondary',
    image: varlaineImage
  },
  {
    id: 4,
    name: 'The Tin City Cafe',
    badge: 'Outdoor Garden',
    rating: '4.5',
    reviewsCount: '462',
    price: '₦3,500',
    cuisine: 'Cafe / Bakery',
    description: 'Best cafe in Nigeria from Experience. Pastries staright from oven mornings.',
    buttonText: 'Explore Menu',
    buttonVariant: 'outline',
    image: tinCityCafeImage
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