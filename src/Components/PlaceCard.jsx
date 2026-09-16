import { Link } from "react-router-dom";
import styles from "../discover.module.css";

// Place cards link to the detail route using the place's stable slug.
export default function PlaceCard({
  place,
  variant = "recommended"
}) {
  return (
    <Link
      to={`/place/${place.slug}`}
      className={styles["place-link"]}
    >
      <div
        className={`${styles["place-card"]} ${
          styles[variant] || ""
        }`}
      >
        <img
          src={place.image}
          alt={place.title}
          className={styles["place-image"]}
          loading="lazy"
        />

        <div className={styles["place-content"]}>
          <h3>{place.title}</h3>

          <p>
            📍 {place.location}
          </p>

          <p>
            {place.category.join(" • ")}
          </p>

          {place.badge && (
            <span
              className={styles[place.badgeClass]}
            >
              {place.badge}
            </span>
          )}

          {place.percent && (
            <span
              className={styles[place.badgeClass]}
            >
              {place.percent}
            </span>
          )}

          {place.subtitle && (
            <p>{place.subtitle}</p>
          )}
        </div>
      </div>
    </Link>
  );
}