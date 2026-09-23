import styles from '../CSS/HeritageSpotlight.module.css';
import heritageImage from '../assets/images/Rayfield Golf club.webp';

export const HeritageSpotlight = ({ onBookTeeTime, onLearnMore }) => {
  return (
    <section className={styles.spotlightBanner}>
      {/* Background Image Container */}
      <img
        src={heritageImage}
        alt="Rayfield Golf Club"
        className={styles.bgImage}
      />
      <div className={styles.overlay} />

      {/* Main Content Area */}
      <div className={styles.content}>
        <span className={styles.badge}>Heritage Spotlight</span>
        <h2 className={styles.title}>Rayfield Golf Club</h2>
        <p className={styles.description}>
          Tee off at Nigeria's oldest golf course, established in 1913. Experience
          the perfect blend of rich history and premium sporting facilities set
          against stunning landscapes.
        </p>

        <div className={styles.actionRow}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={onBookTeeTime}
          >
            Book a Tee Time
          </button>
          <button
            type="button"
            className={styles.outlineBtn}
            onClick={onLearnMore}
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Floating Right Stats Glass Card */}
      <div className={styles.statsCard}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>18</span>
          <span className={styles.statLabel}>HOLE COURSE</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.statItem}>
          <span className={styles.statNumber}>1913</span>
          <span className={styles.statLabel}>ESTABLISHED</span>
        </div>
      </div>
    </section>
  );
};

export default HeritageSpotlight;