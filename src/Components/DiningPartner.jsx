import styles from '../CSS/DiningPartner.module.css';

export const DiningPartnerBanner = ({ onClaimClick }) => {
  return (
    <section className={styles.bannerContainer}>
      <div className={styles.bannerCard}>
        <div className={styles.textContent}>
          <span className={styles.badge}>RESTAURANT PARTNERS</span>
          <h3 className={styles.title}>
            Own a Restaurant, Cafe, or Suya Spot in Jos?
          </h3>
          <p className={styles.description}>
            Connect directly with thousands of foodies, corporate catering buyers, and travelers looking up the culinary heartbeat of Plateau State. Update menus, accept reservations, and manage reviews.
          </p>
        </div>

        <button 
          className={styles.claimButton} 
          onClick={onClaimClick}
          type="button"
        >
          Claim or Register Venue
        </button>
      </div>
    </section>
  );
};

export default DiningPartnerBanner;