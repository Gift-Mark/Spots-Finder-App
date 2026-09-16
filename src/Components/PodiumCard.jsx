import styles from "../Profile.module.css";

// One ranked user in the three-place profile podium.
export const PodiumCard = ({
  rank,
  image,
  name,
  score,
  badge,
  icon,
  className,
}) => {
  return (
    <div className={`${styles["podium-column"]} ${className}`}>
      <div className={styles["podium-avatar-wrapper"]}>
        <img 
          className={styles["podium-avatar"]}
          src={image}
          alt={name}
        />
        <span className={styles['badge-rank']}>
          {badge}
        </span>
      </div>

      <p className={styles['podium-name']}>{name}</p>

      <p className={styles['podium-score']}>
        <i className={icon}></i> {score}
      </p>

      <div className={styles['podium-block']}>
        {rank}
      </div>
    </div>
  );
};