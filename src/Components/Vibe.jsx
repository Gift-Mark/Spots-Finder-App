import { Link } from "react-router-dom";
import styles from "../discover.module.css";

// Featured card for the weekly recommendation section.
export const VibeWeekCard = ({
  place,
  badge = "MUST VISIT",
}) => {
  return (
    <Link
      to={`/place/${place.slug}`}
      className={styles["vibe-link"]}
    >
      <div className={styles["vibe-week-card"]}>
        <div className={styles["badge-must-visit"]}>
          {badge}
        </div>

        <p className={styles["card-title"]}>
          {place.title}
        </p>

        <div className={styles["card-location"]}>
          <i className="fa-solid fa-location-dot"></i>

          <span>
            {place.location} • {place.subtitle}
          </span>
        </div>
      </div>
    </Link>
  );
};