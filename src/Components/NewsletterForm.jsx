import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../CSS/Footer.module.css';

export const NewsletterForm = () => {
  const [message, setMessage] = useState({ text: '', isError: false });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setMessage({ text: '', isError: false });

    // 1. Check if token exists in localStorage
    const token = localStorage.getItem('token');

    // 2. Guest Guard: Redirect to Login if no active session
    if (!token) {
      navigate('/login', {
        state: {
          message: 'Please sign in or create an account to subscribe to the newsletter.',
          redirectTo: window.location.pathname,
        },
      });
      return;
    }

    // 3. Logged-in user: Execute protected subscription call
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to subscribe.');
      }

      setMessage({ text: data.message, isError: false });
    } catch (err) {
      setMessage({ text: err.message, isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
        <button type="submit" className={styles.subscribeBtn} disabled={loading}>
          {loading ? 'Subscribing...' : 'Subscribe to Newsletter'}
        </button>
      </form>

      {message.text && (
        <p className={message.isError ? styles.errorMessage : styles.successMessage}>
          {message.text}
        </p>
      )}
    </div>
  );
};

export default NewsletterForm;