import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faCalendarAlt, 
  faClock, 
  faUsers, 
  faGolfBall, 
  faCheckCircle,
  faFlag
} from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/TeeTime.module.css';

const TEE_TIMES = [
  '07:00 AM', '08:30 AM', '10:00 AM', 
  '11:30 AM', '01:30 PM', '03:00 PM', '04:30 PM'
];

export const TeeTimeBookingModal = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '08:30 AM',
    players: '1',
    playerCategory: 'Visitor / Guest',
    needCaddy: true,
    needClubs: false,
    fullName: '',
    phone: '',
    email: ''
  });

  if (!isOpen) return null;

  // Rate Calculations (in Naira)
  const baseRate = formData.playerCategory === 'Rayfield Member' ? 2500 : 7500;
  const caddyFee = formData.needCaddy ? 3000 : 0;
  const clubFee = formData.needClubs ? 5000 : 0;
  const playerCount = parseInt(formData.players, 10);
  const estimatedTotal = (baseRate + caddyFee + clubFee) * playerCount;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Tee Time Booking Payload:', { ...formData, estimatedTotal });
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {submitted ? (
          <div className={styles.successState}>
            <FontAwesomeIcon icon={faCheckCircle} className={styles.successIcon} />
            <h2>Tee Time Reserved!</h2>
            <p className={styles.successSub}>
              Your booking request for <strong>Rayfield Golf Club (Est. 1913)</strong> has been received.
            </p>

            <div className={styles.summaryCard}>
              <div className={styles.summaryRow}>
                <span>Date & Time:</span>
                <strong>{formData.date} @ {formData.time}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Players:</span>
                <strong>{formData.players} Player(s) ({formData.playerCategory})</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Estimated Fee:</span>
                <strong className={styles.priceHighlight}>₦{estimatedTotal.toLocaleString()}</strong>
              </div>
            </div>

            <p className={styles.noteText}>
              A confirmation WhatsApp/SMS has been routed to <strong>{formData.phone}</strong>. Please present your reference at the Rayfield Club Desk on arrival.
            </p>

            <button type="button" className={styles.primaryBtn} onClick={handleReset}>
              Done
            </button>
          </div>
        ) : (
          <>
            <header className={styles.header}>
              <span className={styles.kicker}>
                <FontAwesomeIcon icon={faFlag} /> NIGERIA'S OLDEST COURSE (EST. 1913)
              </span>
              <h2 className={styles.title}>Book a Tee Time</h2>
              <p className={styles.subtitle}>
                Rayfield Golf Club • 18-Hole Historic Course, Jos
              </p>
            </header>

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Row 1: Date & Time */}
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label><FontAwesomeIcon icon={faCalendarAlt} /> Select Date</label>
                  <input 
                    type="date" 
                    required 
                    value={formData.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label><FontAwesomeIcon icon={faClock} /> Preferred Tee Time</label>
                  <select 
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  >
                    {TEE_TIMES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Players & Category */}
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label><FontAwesomeIcon icon={faUsers} /> Number of Golfers</label>
                  <select 
                    value={formData.players}
                    onChange={(e) => setFormData({ ...formData, players: e.target.value })}
                  >
                    <option value="1">1 Player (Single)</option>
                    <option value="2">2 Players (Twosome)</option>
                    <option value="3">3 Players (Threesome)</option>
                    <option value="4">4 Players (Foursome)</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label>Membership Status</label>
                  <select 
                    value={formData.playerCategory}
                    onChange={(e) => setFormData({ ...formData, playerCategory: e.target.value })}
                  >
                    <option value="Visitor / Guest">Visitor / Guest (₦7,500 Green Fee)</option>
                    <option value="Rayfield Member">Rayfield Member (₦2,500 Green Fee)</option>
                  </select>
                </div>
              </div>

              {/* Add-ons & Equipment */}
              <div className={styles.addonsBox}>
                <span className={styles.addonsTitle}>
                  <FontAwesomeIcon icon={faGolfBall} /> On-Course Add-ons
                </span>
                
                <div className={styles.checkboxGrid}>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      checked={formData.needCaddy}
                      onChange={(e) => setFormData({ ...formData, needCaddy: e.target.checked })}
                    />
                    <span>Hire Local Caddy (+₦3,000 / player)</span>
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      checked={formData.needClubs}
                      onChange={(e) => setFormData({ ...formData, needClubs: e.target.checked })}
                    />
                    <span>Rent Golf Club Set (+₦5,000 / player)</span>
                  </label>
                </div>
              </div>

              {/* Contact Details */}
              <div className={styles.inputGroup}>
                <label>Full Name *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Captain David Jang"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>WhatsApp / Phone *</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="08012345678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="golfer@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Rate Calculation Footer */}
              <div className={styles.priceRow}>
                <div>
                  <span className={styles.priceLabel}>Estimated Total Fees</span>
                  <div className={styles.priceValue}>₦{estimatedTotal.toLocaleString()}</div>
                </div>
                
                <button type="submit" className={styles.primaryBtn}>
                  Confirm Reservation Request
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default TeeTimeBookingModal;