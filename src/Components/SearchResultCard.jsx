import styles from "../discover.module.css";
import { Link } from "react-router-dom";

const icons = {
  vibe: "🎉",
  trending: "🔥",
  recommended: "⭐",
};

// Compact result representation used when search results need a lighter layout.
export default function SearchResultCard({
  id,
  title,
  location,
  category,
  section,
}) {
  return (
    <Link
    to={`/place/${id}`}
    className={styles["search-link"]}
    >
    <div className={styles["search-card"]}>
      <h3>
        {icons[section]} {title}
      </h3>

      <p>{location}</p>

      <small>{category}</small>

      <span>{section.toUpperCase()}</span>
    </div>
    </Link>
  );
}