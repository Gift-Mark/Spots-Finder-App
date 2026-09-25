import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/DiningStylesGrid.module.css';
const barcardiImage = '/images/Barcardi.jpg';
const amoraImage = '/images/Amora.jpg';
const netCafeImage = '/images/The net cafe.jpg';
const grillsImage = '/images/Grills.jpg';

const defaultStyles = [
  {
    id: 1,
    title: 'Highland Fine Dining',
    description: 'Elevated 3-course menus with scenic mountain views and wine pairings.',
    placesCount: 14,
    image: barcardiImage,
  },
  {
    id: 2,
    title: 'Authentic Plateau Bites',
    description: 'Traditional Gwete, Achicha, Masa, and local artisanal soups made daily.',
    placesCount: 28,
    image: amoraImage,
  },
  {
    id: 3,
    title: 'Cozy Cafes & Breakfast',
    description: 'Freshly roasted coffee, Ice cream bar, and baked treats.',
    placesCount: 19,
    image: netCafeImage,
  },
  {
    id: 4,
    title: 'Suya Spots & Grills',
    description: 'Freshly spiced Suya, Kilishi, and cold drinks in outdoor open-air setups.',
    placesCount: 32,
    image: grillsImage,
  },
];

export const DiningStylesGrid = ({ stylesList = defaultStyles, onSelectStyle }) => {
  return (
    <section className={styles.sectionContainer}>
      <div className={styles.headerRow}>
        <div>
          <span className={styles.sectionSubtitle}>CURATED COLLECTIONS</span>
          <h2 className={styles.sectionTitle}>Explore by Dining Style</h2>
        </div>
        <p className={styles.headerDescription}>
          Whether you crave high-altitude fine dining, or classic street suya cooked hot over charcoal, explore Jos by flavor.
        </p>
      </div>

      <div className={styles.cardsGrid}>
        {stylesList.map((item) => (
          <div 
            key={item.id} 
            className={styles.styleCard}
            onClick={() => onSelectStyle && onSelectStyle(item.title)}
          >
            <div className={styles.imageWrapper}>
              <img src={item.image} alt={item.title} className={styles.cardImage} />
            </div>

            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDescription}>{item.description}</p>
              
              <div className={styles.actionRow}>
                <span className={styles.exploreText}>
                  Explore {item.placesCount} Places
                </span>
                <FontAwesomeIcon icon={faArrowRight} className={styles.arrowIcon} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DiningStylesGrid;