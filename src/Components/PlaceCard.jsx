import { Link } from "react-router-dom";
import styles from "../discover.module.css";

// Place cards link to the detail route using the place's stable slug.
export default function PlaceCard({
  place,
  variant = "recommended",
  isSaved = false,
  onToggleSave = null,
}) {
  const isAuthenticated = !!(localStorage.getItem('token') || localStorage.getItem('jos_pulse_token'));

  return (
    <Link
      to={`/place/${place.slug}`}
      className={styles["place-link"]}
    >
      <div
        style={{ position: 'relative' }}
        className={`${styles["place-card"]} ${
          styles[variant] || ""
        }`}
      >
        {isAuthenticated && onToggleSave && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleSave(place._id || place.id);
            }}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              background: 'rgba(0,0,0,0.5)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              cursor: 'pointer',
              color: 'white',
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
            aria-label={isSaved ? 'Remove bookmark' : 'Bookmark this spot'}
          >
            {isSaved ? '🔖' : '🤍'}
          </button>
        )}

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