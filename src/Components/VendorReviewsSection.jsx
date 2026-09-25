import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faReply, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/VendorReviewSection.module.css';

const reviewsData = [
  {
    id: 1,
    author: 'Nnenna Okonkwo',
    timeAgo: '2 days ago',
    rating: 5,
    avatar: '/images/Alex Rivera.avif',
    comment:
      'Absolutely stunning greens. The weather in Jos makes playing a full 18 holes a breeze. Highly recommend the clubhouse restaurant afterward!',
  },
  {
    id: 2,
    author: 'David M.',
    timeAgo: '5 days ago',
    rating: 4,
    avatar: '/images/Jordan K.avif',
    comment:
      'Great event venue for the tournament. Customer service at the registration desk was smooth, though parking got a bit tight around 3 PM.',
  },
];

export const VendorReviewsSection = () => {
  const [sortOption, setSortOption] = useState('Newest');
  const [replyingTo, setReplyingTo] = useState(null);

  return (
    <div className={styles.reviewsCard}>
      {/* Header Row */}
      <div className={styles.headerRow}>
        <div className={styles.titleGroup}>
          <FontAwesomeIcon icon={faCommentDots} className={styles.headerIcon} />
          <h3 className={styles.title}>Recent Vibe Reviews & Ratings</h3>
        </div>

        <div className={styles.sortWrapper}>
          <label htmlFor="sort-reviews" className={styles.sortLabel}>
            Sort by:
          </label>
          <select
            id="sort-reviews"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="Newest">Newest</option>
            <option value="Highest Rating">Highest Rating</option>
            <option value="Lowest Rating">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className={styles.reviewsList}>
        {reviewsData.map((review) => (
          <div key={review.id} className={styles.reviewItem}>
            <div className={styles.reviewHeader}>
              <div className={styles.authorGroup}>
                <img
                  src={review.avatar}
                  alt={review.author}
                  className={styles.avatar}
                />
                <div>
                  <h4 className={styles.authorName}>{review.author}</h4>
                  <span className={styles.timeAgo}>{review.timeAgo}</span>
                </div>
              </div>

              {/* Star Rating Display */}
              <div className={styles.starsRow}>
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    className={
                      i < review.rating ? styles.starFilled : styles.starEmpty
                    }
                  />
                ))}
              </div>
            </div>

            <p className={styles.commentText}>"{review.comment}"</p>

            {/* Action Row */}
            <div className={styles.actionRow}>
              <button
                type="button"
                className={styles.replyBtn}
                onClick={() =>
                  setReplyingTo(replyingTo === review.id ? null : review.id)
                }
              >
                <FontAwesomeIcon icon={faReply} className={styles.replyIcon} />
                <span>Reply</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorReviewsSection;