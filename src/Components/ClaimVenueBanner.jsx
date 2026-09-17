import styles from '../CSS/ClaimVenueBanner.module.css';

export const ClaimVenueBanner = ({ onClaimClick }) => {
  return (
    <section className={styles.bannerContainer}>
      <div className={styles.bannerCard}>
        <div className={styles.textContent}>
          <h3 className={styles.title}>Own a Venue in Jos?</h3>
          <p className={styles.description}>
            Claim your listing to manage details, respond to reviews, and attract more patrons.
          </p>
        </div>

        <button 
          className={styles.claimButton} 
          onClick={onClaimClick}
          type="button"
        >
          Claim Your Venue
        </button>
      </div>
    </section>
  );
};

export default ClaimVenueBanner;