import styles from '../Profile.module.css';

// Compact ranked-user row shown below the podium.
export const LeaderboardRow = ({
  rank,
  image,
  name,
  level,
  score,
  badgeIcon,
  currentUser = false,
}) => {
  return (
    <div
      className={`${styles['row-item']} ${currentUser ? styles["current-user"] : ""}`}
    >
      <div className={styles["row-left"]}>
        <span className={styles["row-index"]}>{rank}</span>

        <img className={styles["row-avatar"]} src={image} alt={name} />

        <div className={styles["row-identity"]}>
          <span className={styles["row-name"]}>
            {name} <i className={badgeIcon}></i>
          </span>

          <span className={styles["row-badge-sub"]}>{level}</span>
        </div>
      </div>

      <div className={styles["row-right"]}>
        <span className={styles["row-score"]}>{score}</span>
      </div>
    </div>
  );
};
