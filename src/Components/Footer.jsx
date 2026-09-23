import { Link } from 'react-router-dom';
import { useState } from 'react';
import styles from '../CSS/Footer.module.css';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Col 1: Brand & Newsletter */}
        <div className={styles.brandCol}>
          <h3 className={styles.brandTitle}>Jos Pulse</h3>
          <p className={styles.newsletterText}>
            Subscribe to get the latest updates on events, festivals, and spots in Jos.
          </p>

          {subscribed ? (
            <p className={styles.successMessage}>✓ Thanks for subscribing!</p>
          ) : (
            <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.newsletterInput}
              />
              <button type="submit" className={styles.subscribeBtn}>
                Subscribe
              </button>
            </form>
          )}

          <p className={styles.copyright}>
            © 2026 Jos Pulse. Celebrating the spirit of the Plateau.
          </p>
        </div>

        {/* Col 2: Explore */}
        <div className={styles.navCol}>
          <h4 className={styles.colTitle}>Explore</h4>
          <ul className={styles.linkList}>
            <li><Link to="/guides">Local Guides</Link></li>
            <li><Link to="/events">Event Ticketing</Link></li>
            <li><Link to="/claim">Claim Your Venue</Link></li>
          </ul>
        </div>

        {/* Col 3: Legal */}
        <div className={styles.navCol}>
          <h4 className={styles.colTitle}>Legal</h4>
          <ul className={styles.linkList}>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Col 4: Support */}
        <div className={styles.navCol}>
          <h4 className={styles.colTitle}>Support</h4>
          <ul className={styles.linkList}>
            <li><Link to="/support">Contact Support</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;