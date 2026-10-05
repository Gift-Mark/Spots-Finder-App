import { useState } from 'react';
import { subscribeNewsletter } from '../api/client';
import styles from '../CSS/Footer.module.css';

export function NewsletterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const data = await subscribeNewsletter(name.trim(), email.trim());
      setStatus({ type: 'success', message: data.message || 'Subscribed successfully.' });
      setName('');
      setEmail('');
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Could not subscribe right now. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.newsletterForm}>
        <input
          type="text"
          required
          maxLength={120}
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`${styles.newsletterInput} ${styles.newsletterNameInput}`}
          disabled={loading}
          aria-label="Your name"
        />
        <input
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.newsletterInput}
          disabled={loading}
          aria-label="Email address for newsletter"
        />
        <button type="submit" className={styles.subscribeBtn} disabled={loading}>
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {status && (
        <p
          className={status.type === 'success' ? styles.successMessage : styles.errorMessage}
          role="status"
        >
          {status.message}
        </p>
      )}
    </>
  );
}

export default NewsletterForm;