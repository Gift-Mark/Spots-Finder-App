import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../CSS/Footer.module.css";
import { subscribeNewsletter } from "../api/client.js";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ text: "", isError: false });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setMessage({ text: "", isError: false });

    // 1. Read authentication token from localStorage
    const token = localStorage.getItem("token") || localStorage.getItem("jos_pulse_token");

    // 2. If unauthenticated guest, redirect to login
    if (!token) {
      navigate("/login", {
        state: {
          message: "Please sign in or create an account to subscribe to the newsletter.",
          redirectTo: window.location.pathname,
        },
      });
      return;
    }

    // 3. Call protected subscriber API endpoint via client.js
    try {
      setLoading(true);
      const data = await subscribeNewsletter("Subscriber", email);

      setMessage({ text: data.message || "Subscribed successfully!", isError: false });
      setEmail("");
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || err.message || "Failed to subscribe.",
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className={styles.footerContainer}>
      {/* 1. Integrated Top Newsletter Banner Section */}
      <div className={styles.newsletterSection}>
        <div className={styles.newsletterContent}>
          <h3>Join the Jos Pulse Newsletter</h3>
          <p>Get exclusive updates on local vibes, upcoming events, and highland escapes.</p>
        </div>

        <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
          <input
            type="email"
            placeholder="Enter your email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.newsletterInput}
          />
          <button type="submit" disabled={loading} className={styles.subscribeBtn}>
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>

        {message.text && (
          <p className={message.isError ? styles.errorMessage : styles.successMessage}>
            {message.text}
          </p>
        )}
      </div>

      <div className={styles.divider} />

      {/* 2. Main Multi-Column Footer (Matching UI Design) */}
      <div className={styles.footerGrid}>
        {/* Brand Column */}
        <div className={styles.brandCol}>
          <h2 className={styles.brandTitle}>
            Jos <span className={styles.brandAccent}>Pulse</span>
          </h2>
          <p className={styles.brandSubtitle}>
            © 2026 Jos Pulse. Celebrating the spirit of the Plateau.
          </p>
        </div>

        {/* Explore Links */}
        <div className={styles.linksCol}>
          <h4 className={styles.colHeading}>Explore</h4>
          <ul className={styles.linksList}>
            <li><Link to="/explore">Local Guides</Link></li>
            <li><Link to="/events">Event Ticketing</Link></li>
            <li><Link to="/claim-venue">Claim Your Venue</Link></li>
          </ul>
        </div>

        {/* Legal Links */}
        <div className={styles.linksCol}>
          <h4 className={styles.colHeading}>Legal</h4>
          <ul className={styles.linksList}>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Support Links */}
        <div className={styles.linksCol}>
          <h4 className={styles.colHeading}>Support</h4>
          <ul className={styles.linksList}>
            <li><Link to="/support">Contact Support</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;