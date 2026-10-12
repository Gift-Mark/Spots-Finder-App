import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../CSS/Footer.module.css";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ text: "", isError: false });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setMessage({ text: "", isError: false });

    // 1. Read authentication token from localStorage
    const token = localStorage.getItem("token");

    // 2. If NO token exists, redirect guest to Login/Register with prompt state
    if (!token) {
      navigate("/login", {
        state: {
          message: "Please sign in or create an account to subscribe to the newsletter.",
          redirectTo: window.location.pathname,
        },
      });
      return;
    }

    // 3. If token EXISTS, call the protected API endpoint
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to subscribe.");
      }

      setMessage({ text: data.message, isError: false });
      setEmail("");
    } catch (err) {
      setMessage({ text: err.message, isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.newsletterSection}>
          <h3>Join the Jos Pulse Newsletter</h3>
          <p>Get exclusive updates on local vibes, events, and highland escapes.</p>

          <form onSubmit={handleSubscribe} className={styles.form}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>

          {message.text && (
            <p className={message.isError ? styles.errorMessage : styles.successMessage}>
              {message.text}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;