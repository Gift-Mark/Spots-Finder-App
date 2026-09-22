import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/LoungePartnerBanner.module.css';

export const LoungePartnerBanner = ({ onClaimClick }) => {
  return (
    <section className={styles.bannerContainer}>
      <div className={styles.bannerCard}>
        <div className={styles.leftContent}>
          <div className={styles.iconContainer}>
            <FontAwesomeIcon icon={faStore} className={styles.storeIcon} />
          </div>
          <div className={styles.textContent}>
            <h3 className={styles.title}>
              Own a Lounge, Cocktail Bar, or Nightspot in Jos?
            </h3>
            <p className={styles.description}>
              Connect with tourists, returning diaspora, and locals exploring Jos nightlife. Get verified on Jos Pulse today.
            </p>
          </div>
        </div>

        <button 
          className={styles.claimButton} 
          onClick={onClaimClick}
          type="button"
        >
          Connect or Register Lounge
        </button>
      </div>
    </section>
  );
};

export default LoungePartnerBanner;