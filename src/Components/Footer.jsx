import { Link } from "react-router-dom";
import styles from "../CSS/Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Brand Column */}
        <div className={styles.footerBrand}>
          <h3>Jos Pulse</h3>
          <p>© 2026 Jos Pulse. Celebrating the spirit of the Plateau.</p>
        </div>

        {/* Navigation Column 1 */}
        <div className={styles.footerCol}>
          <h4>Explore</h4>
          <ul>
            <li>
              <Link to="/spots">Local Guides</Link>
            </li>
            <li>
              <Link to="/events">Event Ticketing</Link>
            </li>
            <li>
              <Link to="/claim-venue">Claim Your Venue</Link>
            </li>
          </ul>
        </div>

        {/* Navigation Column 2 */}
        <div className={styles.footerCol}>
          <h4>Legal</h4>
          <ul>
            <li>
              <Link to="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms">Terms of Service</Link>
            </li>
          </ul>
        </div>

        {/* Navigation Column 3 */}
        <div className={styles.footerCol}>
          <h4>Support</h4>
          <ul>
            <li>
              <Link to="/support">Contact Support</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;