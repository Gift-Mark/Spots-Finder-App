import { Link } from 'react-router-dom';
import NewsletterForm from './NewsletterForm';
import styles from '../CSS/Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Col 1: Brand & Newsletter */}
        <div className={styles.brandCol}>
          <h3 className={styles.brandTitle}>Jos Pulse</h3>
          <p className={styles.newsletterText}>
            Subscribe to get the latest updates on events, festivals, and spots in Jos.
          </p>

          <NewsletterForm />

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
            <li><Link to="/contact">Contact Support</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
