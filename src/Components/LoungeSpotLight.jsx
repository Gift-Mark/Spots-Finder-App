import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faMusic, faGlassMartiniAlt, faTag, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/LoungeSpotlight.module.css';
import meesPalaceImage from '../assets/images/Mees Palace.webp';

export const LoungeSpotlight = ({ spotlight }) => {
  const defaultSpotlight = {
    title: 'Mees Palace',
    rating: '4.1',
    reviewsCount: '600',
    location: 'Rayfield, Jos',
    badge: 'SPOTLIGHT PICK',
    description: 'Family-friendly recreation hub in Rayfield with cinema, arcade, event hall, and open-air lounge. Cold drinks, grilled bites, and relaxed outdoor seating in a spacious, serene setting.',
    signatureDrink: 'Chapman',
    vibe: 'Highland Sunset & Chill',
    averagePrice: '₦10,000',
    liveEventNotice: 'Check Instagram @meespalace for weekend movie premieres',
    image: meesPalaceImage,
  };

  const data = spotlight || defaultSpotlight;

  return (
    <section className={styles.sectionContainer}>
      <div className={styles.headerRow}>
        <span className={styles.sectionSubtitle}>CURATED HIGHLAND SPOTLIGHT</span>
        <a href="#view-all-lounges" className={styles.viewAllLink}>
          Explore All Rooftops & Bars &rarr;
        </a>
      </div>

      <div className={styles.cardWrapper}>
        {/* Left Side: Media & Live Event Ribbon */}
        <div className={styles.imageContainer}>
          <img src={data.image} alt={data.title} className={styles.spotlightImage} />
          
          <div className={styles.ratingBadge}>
            <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
            <span><strong>{data.rating}</strong> ({data.reviewsCount} reviews)</span>
          </div>

          <div className={styles.categoryBadge}>{data.badge}</div>

          {data.liveEventNotice && (
            <div className={styles.liveBanner}>
              <div className={styles.liveBannerText}>
                <FontAwesomeIcon icon={faMusic} className={styles.musicIcon} />
                <span>{data.liveEventNotice}</span>
              </div>
              <button type="button" className={styles.rsvpLink}>
                View Event
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Details & CTAs */}
        <div className={styles.detailsContainer}>
          <span className={styles.locationTag}>{data.location.toUpperCase()}</span>
          <h2 className={styles.venueTitle}>{data.title}</h2>

          <p className={styles.description}>{data.description}</p>

          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <FontAwesomeIcon icon={faGlassMartiniAlt} className={styles.metaIcon} />
              <div>
                <span className={styles.metaLabel}>Signature</span>
                <span className={styles.metaValue}>{data.signatureDrink}</span>
              </div>
            </div>

            <div className={styles.metaItem}>
              <FontAwesomeIcon icon={faTag} className={styles.metaIcon} />
              <div>
                <span className={styles.metaLabel}>Vibe</span>
                <span className={styles.metaValue}>{data.vibe}</span>
              </div>
            </div>

            <div className={styles.metaItem}>
              <FontAwesomeIcon icon={faDollarSign} className={styles.metaIcon} />
              <div>
                <span className={styles.metaLabel}>Average</span>
                <span className={styles.metaValue}>{data.averagePrice}</span>
              </div>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button type="button" className={styles.primaryBtn}>
              Reserve VIP Table
            </button>
            <button type="button" className={styles.secondaryBtn}>
              Explore Drink & Tapas
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoungeSpotlight;