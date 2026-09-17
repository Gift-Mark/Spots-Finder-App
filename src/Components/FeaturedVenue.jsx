import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/FeaturedVenue.module.css';

export const FeaturedVenue = ({ venue }) => {
  const defaultVenue = {
    name: "The Net Club & Lounge",
    rating: "4.8",
    reviewsCount: "214",
    priceRange: "$$$",
    description: "The premier destination for luxury nightlife in Rayfield. Featuring international DJs, expertly crafted cocktails, and exclusive VIP experiences.",
    tags: ["Premium Club", "Rayfield"],
    image: "./assets/images/net-club.jpg"
  };

  const data = venue || defaultVenue;

  return (
    <section className={styles.sectionContainer}>
      <h2 className={styles.sectionTitle}>Featured Venue</h2>

      <div className={styles.cardWrapper}>
        {/* Left Side Image with Promoted Badge */}
        <div className={styles.imageContainer}>
          <img src={data.image} alt={data.name} className={styles.venueImage} />
          <span className={styles.promotedBadge}>
            <FontAwesomeIcon icon={faStar} className={styles.starIcon} /> Promoted
          </span>
        </div>

        {/* Right Side Content Details */}
        <div className={styles.detailsContainer}>
          <div className={styles.headerRow}>
            <h3 className={styles.venueName}>{data.name}</h3>
          </div>

          <div className={styles.ratingRow}>
            <span className={styles.stars}>
              <FontAwesomeIcon icon={faStar} />
            </span>
            <span className={styles.ratingText}>
              {data.rating} ({data.reviewsCount} reviews)
            </span>
            <span className={styles.dotSeparator}>•</span>
            <span className={styles.priceRange}>{data.priceRange}</span>
          </div>

          <p className={styles.description}>{data.description}</p>

          <div className={styles.tagsRow}>
            {data.tags.map((tag, index) => (
              <span key={index} className={styles.tagPill}>
                {tag}
              </span>
            ))}
          </div>

          <button className={styles.bookButton}>Book a Table</button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedVenue;