import styles from "../feed.module.css";

// Feed post renderer; actions are currently visual and receive display data as props.
export const PostCard = ({
  userName,
  userAvatar,
  location,
  postTime,
  postImage,
  postText,
  likes,
  comments
}) => {
  return (
    <div className={styles["post-card"]}>
      <div className={styles["post-header"]}>
        <div className={styles["user-info"]}>
          <img 
          className={styles["user-avatar"]}
          src={userAvatar}
          alt={userName}
          />
          <div className={styles["user-meta"]}>
            <span className={styles["user-name"]}>{userName}</span>
            <span className={styles["location-tag"]}>
              <i class="fa-solid fa-location-dot"></i> {location}
            </span>
          </div>
        </div>
        <span className={styles["post-time"]}>{postTime}</span>
      </div>

      <div className={styles["post-media"]}>
        <img src={postImage} alt="Post view" />
      </div>

       <div className={styles["post-body"]}>
        {postText}
      </div>

      <div className={styles["post-actions"]}>
        <div className={styles["left-actions"]}>
          <button className={styles["action-btn-liked"]}>
            <i className="fa-solid fa-heart"></i> {likes}
          </button>
          <button className={styles["action-btn"]}>
            <i className="fa-regular fa-comment"></i> {comments}
          </button>
        </div>
        <button className={styles["share-btn"]}>
          <i className="fa-regular fa-share-from-square"></i>
        </button>
      </div>
    </div>
  );
};