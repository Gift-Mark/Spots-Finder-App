import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faUserCheck,
  faStar,
  faLanguage,
  faCalendarAlt,
  faClock,
  faUsers,
  faCheckCircle,
  faShieldHalved
} from "@fortawesome/free-solid-svg-icons";
import styles from "../CSS/GuideBookingModal.module.css";

// Sample verified local guides for Plateau heritage sites
const verifiedGuides = [
  {
    id: "g1",
    name: "Da Gwom Gyang",
    title: "Senior Plateau Historian & Cultural Explorer",
    rating: 4.95,
    reviewsCount: 128,
    languages: ["English", "Berom", "Hausa"],
    ratePerHour: 5000, // NGN
    avatar: "/images/guides/guide1.jpg",
    verified: true,
    specialties: ["Jos National Museum", "Riyom Rock", "Nok Terracottas"]
  },
  {
    id: "g2",
    name: "Ngo Blessing Lar",
    title: "Festival Specialist & Ethnographer",
    rating: 4.9,
    reviewsCount: 94,
    languages: ["English", "Tarok", "Hausa"],
    ratePerHour: 4500,
    avatar: "/images/guides/guide2.jpg",
    verified: true,
    specialties: ["Nzem Berom", "MOTNA", "Jos Central"]
  },
  {
    id: "g3",
    name: "Pam Dachung",
    title: "Eco-Heritage & Geological Guide",
    rating: 4.88,
    reviewsCount: 76,
    languages: ["English", "Hausa"],
    ratePerHour: 4000,
    avatar: "/images/guides/guide3.jpg",
    verified: true,
    specialties: ["Riyom Rock", "Shere Hills", "Assop Falls"]
  }
];

export function GuideBookingModal({ spot, onClose }) {
  const [selectedGuideId, setSelectedGuideId] = useState(verifiedGuides[0].id);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("10:00");
  const [groupSize, setGroupSize] = useState(2);
  const [durationHours, setDurationHours] = useState(2);
  const [preferredLanguage, setPreferredLanguage] = useState("English");
  const [specialRequests, setSpecialRequests] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedGuide = verifiedGuides.find((g) => g.id === selectedGuideId) || verifiedGuides[0];
  const totalPrice = selectedGuide.ratePerHour * durationHours;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bookingDate) {
      alert("Please select a date for your guided tour.");
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div>
            <h2>Hire a Local Cultural Guide</h2>
            <p className={styles.subtext}>
              Book a verified heritage expert for <strong>{spot.title}</strong>
            </p>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {isSubmitted ? (
          /* Confirmation State */
          <div className={styles.successState}>
            <FontAwesomeIcon icon={faCheckCircle} className={styles.successIcon} />
            <h3>Tour Request Submitted!</h3>
            <p>
              Your booking with <strong>{selectedGuide.name}</strong> for{" "}
              <strong>{spot.title}</strong> on <strong>{bookingDate}</strong> at{" "}
              <strong>{bookingTime}</strong> has been received.
            </p>
            <div className={styles.summaryCard}>
              <div><span>Guide:</span> {selectedGuide.name}</div>
              <div><span>Duration:</span> {durationHours} Hour(s)</div>
              <div><span>Visitors:</span> {groupSize} person(s)</div>
              <div><span>Estimated Total:</span> ₦{totalPrice.toLocaleString()}</div>
            </div>
            <p className={styles.contactNote}>
              <FontAwesomeIcon icon={faShieldHalved} /> Your verified guide will reach out via WhatsApp/Phone to confirm meeting details.
            </p>
            <button type="button" className={styles.primaryBtn} onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          /* Booking Form */
          <form className={styles.bookingForm} onSubmit={handleSubmit}>
            {/* Guide Selection */}
            <div className={styles.sectionGroup}>
              <label className={styles.sectionTitle}>Select Verified Guide</label>
              <div className={styles.guideCardsList}>
                {verifiedGuides.map((guide) => {
                  const isSelected = guide.id === selectedGuideId;
                  return (
                    <div
                      key={guide.id}
                      className={`${styles.guideCard} ${isSelected ? styles.selectedGuide : ''}`}
                      onClick={() => setSelectedGuideId(guide.id)}
                    >
                      <div className={styles.guideAvatarWrapper}>
                        <div className={styles.avatarPlaceholder}>
                          {guide.name.charAt(0)}
                        </div>
                        {guide.verified && (
                          <span className={styles.verifiedBadge} title="Verified Cultural Guide">
                            <FontAwesomeIcon icon={faUserCheck} />
                          </span>
                        )}
                      </div>

                      <div className={styles.guideInfo}>
                        <div className={styles.guideHeaderRow}>
                          <span className={styles.guideName}>{guide.name}</span>
                          <span className={styles.guideRating}>
                            <FontAwesomeIcon icon={faStar} /> {guide.rating} ({guide.reviewsCount})
                          </span>
                        </div>
                        <p className={styles.guideRole}>{guide.title}</p>
                        <div className={styles.guideMeta}>
                          <span>
                            <FontAwesomeIcon icon={faLanguage} /> {guide.languages.join(", ")}
                          </span>
                          <span className={styles.priceTag}>
                            ₦{guide.ratePerHour.toLocaleString()}/hr
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Date & Time Row */}
            <div className={styles.formGridRow}>
              <div className={styles.inputGroup}>
                <label>
                  <FontAwesomeIcon icon={faCalendarAlt} /> Visit Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>
                  <FontAwesomeIcon icon={faClock} /> Start Time
                </label>
                <select value={bookingTime} onChange={(e) => setBookingTime(e.target.value)}>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:30">11:30 AM</option>
                  <option value="13:00">01:00 PM</option>
                  <option value="14:30">02:30 PM</option>
                  <option value="16:00">04:00 PM</option>
                </select>
              </div>
            </div>

            {/* Duration & Visitors Row */}
            <div className={styles.formGridRow}>
              <div className={styles.inputGroup}>
                <label>
                  <FontAwesomeIcon icon={faClock} /> Duration (Hours)
                </label>
                <select value={durationHours} onChange={(e) => setDurationHours(Number(e.target.value))}>
                  <option value={1}>1 Hour (Quick Highlights)</option>
                  <option value={2}>2 Hours (Standard Guided Tour)</option>
                  <option value={3}>3 Hours (In-Depth Tour + Q&A)</option>
                  <option value={4}>4 Hours (Full Experience)</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>
                  <FontAwesomeIcon icon={faUsers} /> Visitors Count
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={groupSize}
                  onChange={(e) => setGroupSize(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Preferred Language */}
            <div className={styles.inputGroup}>
              <label>
                <FontAwesomeIcon icon={faLanguage} /> Preferred Language
              </label>
              <select value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)}>
                {selectedGuide.languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            {/* Special Request */}
            <div className={styles.inputGroup}>
              <label>Special Requests or Accessibility Needs (Optional)</label>
              <textarea
                rows={2}
                placeholder="e.g. Seeking detailed history on pottery techniques, traveling with elderly family members..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
              />
            </div>

            {/* Price Footer & Action */}
            <div className={styles.formFooter}>
              <div className={styles.priceSummary}>
                <span>Total Estimated Fee:</span>
                <strong>₦{totalPrice.toLocaleString()}</strong>
              </div>
              <button type="submit" className={styles.primaryBtn}>
                Confirm & Request Guide
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default GuideBookingModal;