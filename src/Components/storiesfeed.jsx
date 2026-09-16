import styles from "../feed.module.css";

// A live story receives a distinct class based on its title.
export const StoriesFeed = ({ image, title }) => {
  const isLiveStory = title?.toLowerCase() === "live";

  return (
    <div className={`${styles["story-item"]} ${isLiveStory ? styles["story-item-live"] : ""}`}>
      <div className={styles["story-ring"]}>
        <img
          src={image}
          alt={title}
          className={styles["story-img"]}
        />
      </div>
      <span className={styles["story-name"]}>{title}</span>
    </div>
  );
};