import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/PromoteSpotCard.module.css';

export const PromoteSpotCard = ({ onSubscribe }) => {
  return (
    <div className={styles.card}>
      <div className={styles.titleRow}>
        <FontAwesomeIcon icon={faBullhorn} className={styles.hornIcon} />
        <h3 className={styles.title}>Promote Your Spot</h3>
      </div>

      <p className={styles.description}>
        Get in front of more tourists. Upgrade to a 30-day 'Featured Spot' banner on the Jos Pulse homepage.
      </p>

      <ul className={styles.benefitsList}>
        <li>
          <FontAwesomeIcon icon={faCircleCheck} className={styles.checkIcon} />
          <span>Top search visibility</span>
        </li>
        <li>
          <FontAwesomeIcon icon={faCircleCheck} className={styles.checkIcon} />
          <span>Featured in weekly newsletter</span>
        </li>
      </ul>

      <button
        type="button"
        className={styles.subscribeBtn}
        onClick={onSubscribe}
      >
        Subscribe for ₦15,000/mo
      </button>
    </div>
  );
};

export default PromoteSpotCard;