import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faXmark, 
  faStar, 
  faCamera, 
  faLightbulb, 
  faCheckCircle, 
  faTrash 
} from "@fortawesome/free-solid-svg-icons";
import styles from "../CSS/UserReviewModal.module.css";
import { postReview } from "../api/client";

export function UserReviewModal({ spot, onClose }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [visitorTip, setVisitorTip] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [photos, setPhotos] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const isAuthenticated = !!(localStorage.getItem('token') || localStorage.getItem('jos_pulse_token'));

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotoUrls = files.map((file) => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setPhotos((prev) => [...prev, ...newPhotoUrls]);
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!visitorTip.trim()) {
      alert("Please enter a short visitor tip or review.");
      return;
    }
    setIsLoading(true);
    setSubmitError('');
    try {
      await postReview(spot._id || spot.id, {
        rating,
        comment: visitorTip,
        guestName: reviewerName,
        guestHandle: reviewerName,
      });
      setIsSubmitted(true);
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || 'Failed to submit review.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div>
            <h2>Share Visitor Tip & Photos</h2>
            <p className={styles.subtext}>Contribute to the community guide for <strong>{spot.title}</strong></p>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {isSubmitted ? (
          <div className={styles.successState}>
            <FontAwesomeIcon icon={faCheckCircle} className={styles.successIcon} />
            <h3>Thank You for Your Contribution!</h3>
            <p>Your tip and photo submission for <strong>{spot.title}</strong> has been received and will appear after moderation.</p>
            <button type="button" className={styles.primaryBtn} onClick={onClose}>
              Close
            </button>
          </div>
        ) : !isAuthenticated ? (
          <div className={styles.successState}>
            <p>Please log in to post a review.</p>
            <button type="button" className={styles.primaryBtn} onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form className={styles.reviewForm} onSubmit={handleSubmit}>
            {/* Rating Stars */}
            <div className={styles.inputGroup}>
              <label><FontAwesomeIcon icon={faStar} /> Your Rating</label>
              <div className={styles.starRatingRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`${styles.starBtn} ${(hoverRating || rating) >= star ? styles.starActive : ''}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <FontAwesomeIcon icon={faStar} />
                  </button>
                ))}
                <span className={styles.ratingValueText}>{rating} / 5</span>
              </div>
            </div>

            {/* Reviewer Name */}
            <div className={styles.inputGroup}>
              <label>Your Name / Handle</label>
              <input
                type="text"
                placeholder="e.g. Pam G. or @tourist_jos"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                required
              />
            </div>

            {/* Visitor Tip / Review */}
            <div className={styles.inputGroup}>
              <label><FontAwesomeIcon icon={faLightbulb} /> Visitor Tip or Advice</label>
              <textarea
                rows={3}
                placeholder="e.g. Best visited before noon for optimal lighting. Guided tours near the gate are very informative!"
                value={visitorTip}
                onChange={(e) => setVisitorTip(e.target.value)}
                required
              />
            </div>

            {/* Upload Photos */}
            <div className={styles.inputGroup}>
              <label><FontAwesomeIcon icon={faCamera} /> Add Recent Photos</label>
              <div className={styles.uploadBox}>
                <input
                  type="file"
                  id="photoUploadInput"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className={styles.fileInputHidden}
                />
                <label htmlFor="photoUploadInput" className={styles.uploadLabel}>
                  <FontAwesomeIcon icon={faCamera} className={styles.uploadIcon} />
                  <span>Click to select or drop photos here</span>
                </label>
              </div>

              {/* Photo Previews */}
              {photos.length > 0 && (
                <div className={styles.previewGrid}>
                  {photos.map((item, index) => (
                    <div key={index} className={styles.previewCard}>
                      <img src={item.url} alt={`Upload preview ${index + 1}`} />
                      <button
                        type="button"
                        className={styles.removePhotoBtn}
                        onClick={() => removePhoto(index)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Footer */}
            <div className={styles.formFooter}>
              {submitError && (
                <p style={{ color: 'red', marginBottom: '0.5rem' }}>{submitError}</p>
              )}
              <button type="submit" className={styles.primaryBtn} disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit Contribution'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default UserReviewModal;