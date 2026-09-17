import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/FeaturedCulinarySpotlight.module.css';

export const FeaturedCulinarySpotlight = ({ spotlight }) => {
  const defaultSpotlight = {
    title: 'The Crest View Restaurant & Lounge',
    rating: '4.9',
    reviewsCount: '214',
    badges: ['Fine Dining', 'Scenic View'],
    description: 'Perched high on Rayfield Hill, offering panoramic plateau vistas paired with an artisan culinary menu. Signature dishes include locally spiced beef tenderloin and Jos mountain berry tart.',
    location: 'Rayfield, Plateau State',
    cuisine: 'Fusion / Ridge Cuisine',
    image: './assets/images/crest-view.jpg',
  };

  const data = spotlight || defaultSpotlight;

  return (
    <section className={styles.sectionContainer}>
      <div className={styles.headerRow}>
        <span className={styles.sectionSubtitle}>FEATURED CHOICE</span>
        <a href="#view-all" className={styles.viewAllLink}>
          Explore All Fine Dining &rarr;
        </a>
      </div>

      <h2 className={styles.sectionTitle}>Featured Culinary Spotlight</h2>

      <div className={styles.cardWrapper}>
        {/* Left Side: Image with Badge Overlay */}
        <div className={styles.imageContainer}>
          <img src={data.image} alt={data.title} className={styles.spotlightImage} />
          <div className={styles.badgeGroup}>
            {data.badges.map((badge, idx) => (
              <span key={idx} className={styles.badge}>
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Right Side: Details & CTAs */}
        <div className={styles.detailsContainer}>
          <div className={styles.titleRow}>
            <h3 className={styles.venueTitle}>{data.title}</h3>
            <div className={styles.ratingBadge}>
              <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
              <span>
                <strong>{data.rating}</strong> ({data.reviewsCount} reviews)
              </span>
            </div>
          </div>

          <p className={styles.description}>{data.description}</p>

          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>LOCATION</span>
              <span className={styles.metaValue}>{data.location}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>CUISINE</span>
              <span className={styles.metaValue}>{data.cuisine}</span>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button type="button" className={styles.primaryBtn}>
              Reserve a Table
            </button>
            <button type="button" className={styles.secondaryBtn}>
              View Menu & List
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCulinarySpotlight;