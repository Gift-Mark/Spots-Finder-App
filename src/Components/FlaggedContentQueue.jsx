import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/FlaggedContentQueue.module.css';

export const FlaggedContentQueue = ({ onGoToModeration }) => {
  return (
    <div className={styles.queueCard}>
      {/* Header */}
      <div className={styles.cardHeader}>
        <div className={styles.titleGroup}>
          <FontAwesomeIcon icon={faFlag} className={styles.flagIcon} />
          <h3 className={styles.title}>Flagged Content Queue</h3>
        </div>
        <span className={styles.countBadge}>12 Items</span>
      </div>

      {/* Flagged Item Card */}
      <div className={styles.flagItemBox}>
        <div className={styles.itemHeader}>
          <div className={styles.userGroup}>
            <img
              src="./assets/images/user-flagged.jpg"
              alt="Reported User"
              className={styles.userAvatar}
            />
            <span className={styles.itemSubject}>
              Inappropriate Review on "Shere Hills Hike"
            </span>
          </div>
          <span className={styles.timeAgo}>2h ago</span>
        </div>

        <p className={styles.commentExcerpt}>
          "This place is terrible, the guides don't know anything and... [profanity removed]"
        </p>

        <div className={styles.actionRow}>
          <button type="button" className={styles.deleteBtn}>
            Delete Content
          </button>
          <button type="button" className={styles.ignoreBtn}>
            Ignore Report
          </button>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className={styles.cardFooter}>
        <button
          type="button"
          className={styles.moderationHubBtn}
          onClick={onGoToModeration}
        >
          Go to Moderation Hub
        </button>
      </div>
    </div>
  );
};

export default FlaggedContentQueue;