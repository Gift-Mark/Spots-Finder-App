import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTimes, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/FeaturedCulinarySpotlight.module.css';

export const FeaturedCulinarySpotlight = ({ spotlight }) => {
  const navigate = useNavigate();

  // Modal State Management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [partySize, setPartySize] = useState(2);
  const [selectedTime, setSelectedTime] = useState("7:00 PM");
  const [selectedSeating, setSelectedSeating] = useState("Main Dining Hall");
  const [formData, setFormData] = useState({ name: "", phone: "", notes: "" });
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!spotlight) return null;
  const data = spotlight;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setIsConfirmed(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsConfirmed(false);
  };

  return (
    <section id="featured-culinary" className={styles.sectionContainer}>
      <div className={styles.headerRow}>
        <span className={styles.sectionSubtitle}>FEATURED CHOICE</span>
        <Link to="/dining-listings" className={styles.viewAllLink}>
          Explore All Fine Dining &rarr;
        </Link>
      </div>

      <h2 className={styles.sectionTitle}>Featured Culinary Spotlight</h2>

      <div className={styles.cardWrapper}>
        {/* Left Side: Image with Badge Overlay */}
        <div className={styles.imageContainer}>
          <img src={data.image} alt={data.title} className={styles.spotlightImage} />
          <div className={styles.badgeGroup}>
            {data.badges.map((badge, idx) => (
              <span key={idx} className={styles.badge}>
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Right Side: Details & CTAs */}
        <div className={styles.detailsContainer}>
          <div className={styles.titleRow}>
            <h3 className={styles.venueTitle}>{data.title}</h3>
            <div className={styles.ratingBadge}>
              <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
              <span>
                <strong>{data.rating}</strong> ({data.reviewsCount} reviews)
              </span>
            </div>
          </div>

          <p className={styles.description}>{data.description}</p>

          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>LOCATION</span>
              <span className={styles.metaValue}>{data.location}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>CUISINE</span>
              <span className={styles.metaValue}>{data.cuisine}</span>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button 
              type="button" 
              className={styles.primaryBtn}
              onClick={() => setIsModalOpen(true)}
            >
              Reserve a Table
            </button>
            <button 
              type="button" 
              className={styles.secondaryBtn}
              onClick={() => navigate('/simmer')}
            >
              View Menu & List
            </button>
          </div>
        </div>
      </div>

      {/* Reservation Modal Overlay */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className={styles.closeModalBtn} 
              onClick={handleCloseModal}
              aria-label="Close Modal"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>

            {!isConfirmed ? (
              <form onSubmit={handleBookingSubmit} className={styles.modalForm}>
                <span className={styles.modalKicker}>Direct Table Reservation</span>
                <h3 className={styles.modalHeading}>Reserve at {data.title}</h3>
                <p className={styles.modalLocation}>📍 {data.location}</p>

                {/* Party Size Selector */}
                <div className={styles.formGroup}>
                  <label>Guests</label>
                  <div className={styles.counterControl}>
                    <button 
                      type="button" 
                      onClick={() => setPartySize(Math.max(1, partySize - 1))}
                    >
                      -
                    </button>
                    <span>{partySize} {partySize === 1 ? 'Guest' : 'Guests'}</span>
                    <button 
                      type="button" 
                      onClick={() => setPartySize(partySize + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Date Picker */}
                <div className={styles.formGroup}>
                  <label htmlFor="res-date">Date</label>
                  <input
                    id="res-date"
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    required
                    className={styles.formInput}
                  />
                </div>

                {/* Time Slots */}
                <div className={styles.formGroup}>
                  <label>Preferred Time Slot</label>
                  <div className={styles.timeSlotsGrid}>
                    {['5:30 PM', '6:30 PM', '7:00 PM', '8:00 PM', '9:00 PM'].map((time) => (
                      <button
                        type="button"
                        key={time}
                        className={selectedTime === time ? styles.activeSlotBtn : styles.slotBtn}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seating Preference */}
                <div className={styles.formGroup}>
                  <label htmlFor="seating-area">Seating Preference</label>
                  <select
                    id="seating-area"
                    value={selectedSeating}
                    onChange={(e) => setSelectedSeating(e.target.value)}
                    className={styles.formSelect}
                  >
                    <option value="Main Dining Hall">Main Dining Hall</option>
                    <option value="VIP Private Booth">VIP Private Booth</option>
                    <option value="Ambient Lounge Area">Ambient Lounge Area</option>
                  </select>
                </div>

                {/* Full Name */}
                <div className={styles.formGroup}>
                  <label htmlFor="guest-name">Full Name</label>
                  <input
                    id="guest-name"
                    type="text"
                    name="name"
                    placeholder="e.g. Samuel Pam"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={styles.formInput}
                  />
                </div>

                {/* Phone Number */}
                <div className={styles.formGroup}>
                  <label htmlFor="guest-phone">Phone Number (for Confirmation)</label>
                  <input
                    id="guest-phone"
                    type="tel"
                    name="phone"
                    placeholder="e.g. +234 803 123 4567"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className={styles.formInput}
                  />
                </div>

                <button type="submit" className={styles.confirmSubmitBtn}>
                  Confirm Table Reservation
                </button>
              </form>
            ) : (
              <div className={styles.successContainer}>
                <FontAwesomeIcon icon={faCheckCircle} className={styles.successIcon} />
                <h3>Table Reserved!</h3>
                <p>
                  Your reservation for <strong>{partySize} guests</strong> at{' '}
                  <strong>{data.title}</strong> ({selectedSeating}) at{' '}
                  <strong>{selectedTime}</strong> has been confirmed.
                </p>
                <div className={styles.guestSummary}>
                  <p><strong>Reserved under:</strong> {formData.name}</p>
                  <p><strong>Contact:</strong> {formData.phone}</p>
                </div>
                <small>A confirmation SMS has been sent to your mobile phone.</small>
                <button 
                  type="button" 
                  onClick={handleCloseModal} 
                  className={styles.doneBtn}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default FeaturedCulinarySpotlight;