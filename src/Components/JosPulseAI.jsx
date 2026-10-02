import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faPaperPlane, faXmark } from '@fortawesome/free-solid-svg-icons';
import { askWebsiteSupport } from '../api/client';
import styles from '../CSS/JosPulseAI.module.css';

export const JosPulseAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState('');
  const [sessionId] = useState(() => {
    const existingId = localStorage.getItem('jos_session_id');
    if (existingId) return existingId;

    const newId = `sess_${crypto.randomUUID()}`;
    localStorage.setItem('jos_session_id', newId);
    return newId;
  });
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hi, I'm Jos Pulse support. Ask me about places, opening hours, entry prices, events, flights, or using the website.",
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSend = async (e) => {
    e.preventDefault();
    const prompt = input.trim();
    if (!prompt || isSending) return;

    setMessages((previous) => [...previous, { sender: 'user', text: prompt }].slice(-30));
    setInput('');
    setIsSending(true);

    try {
      const response = await askWebsiteSupport(prompt, sessionId, window.location.pathname);
      setMessages((previous) => [...previous, { sender: 'ai', text: response.reply }].slice(-30));
    } catch {
      setMessages((previous) => [
        ...previous,
        { sender: 'ai', text: 'Support chat is temporarily unavailable. Please try again shortly.' },
      ].slice(-30));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.chatWrapper}>
      {!isOpen && (
        <button className={styles.floatingBtn} onClick={() => setIsOpen(true)} aria-label="Open Jos Pulse support chat">
          <FontAwesomeIcon icon={faRobot} />
          <span>Website Support</span>
        </button>
      )}

      {isOpen && (
        <section className={styles.chatBox} aria-label="Jos Pulse website support" role="dialog">
          <div className={styles.chatHeader}>
            <div className={styles.headerTitle}>
              <FontAwesomeIcon icon={faRobot} />
              <span>Jos Pulse Support</span>
            </div>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)} aria-label="Close support chat">
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          <div className={styles.messagesArea} role="log" aria-live="polite">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={msg.sender === 'ai' ? styles.aiMsg : styles.userMsg}
              >
                {msg.text}
              </div>
            ))}
            {isSending && <div className={styles.aiMsg}>Checking Jos Pulse information...</div>}
            <div ref={messagesEndRef} />
          </div>

          <p className={styles.privacyNote}>Chat questions are saved with contact details removed to improve website support. Don’t share passwords or payment details.</p>
          <form onSubmit={handleSend} className={styles.inputArea}>
            <input
              type="text"
              placeholder="Ask about a place or website feature"
              value={input}
              maxLength={500}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Your support question"
            />
            <button type="submit" disabled={isSending || !input.trim()} aria-label="Send question">
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </form>
        </section>
      )}
    </div>
  );
};

export default JosPulseAI;