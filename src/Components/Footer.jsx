import { Link } from 'react-router-dom';
import styles from '../CSS/Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Brand Column */}
        <div className={styles.footerBrandCol}>
          <Link to="/explore" className={styles.footerBrandLink}>
            <h3 className={styles.footerBrand}>
              Jos <span className={styles.footerBrandAccent}>Pulse</span>
            </h3>
          </Link>
          <p className={styles.footerCopy}>
            © 2026 Jos Pulse. Celebrating the spirit of the Plateau.
          </p>
        </div>

        {/* Explore Links */}
        <div className={styles.footerLinkCol}>
          <h4 className={styles.footerHeading}>Explore</h4>
          <Link to="/guides" className={styles.footerLink}>Local Guides</Link>
          <Link to="/events" className={styles.footerLink}>Event Ticketing</Link>
          <Link to="/dining" className={styles.footerLink}>Restaurants & Dining</Link>
          <Link to="/explore" className={styles.footerLink}>Discover Places</Link>
          <Link to="/stays" className={styles.footerLink}>Stays & Hotels</Link>
        </div>

        {/* Partners Links */}
        <div className={styles.footerLinkCol}>
          <h4 className={styles.footerHeading}>Partners</h4>
          <Link to="/claim" className={styles.footerLink}>Claim Your Venue</Link>
          <Link to="/vendor" className={styles.footerLink}>Vendor Workspace</Link>
          <Link to="/lounges" className={styles.footerLink}>Lounges & Nightlife</Link>
        </div>

        {/* Legal & Support Links */}
        <div className={styles.footerLinkCol}>
          <h4 className={styles.footerHeading}>Legal & Support</h4>
          <Link to="/privacy" className={styles.footerLink}>Privacy Policy</Link>
          <Link to="/terms" className={styles.footerLink}>Terms of Service</Link>
          <Link to="/contact" className={styles.footerLink}>Contact Support</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;