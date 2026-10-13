import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faPaperPlane, faXmark, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { askWebsiteSupport } from '../api/client';
import styles from '../CSS/JosPulseAI.module.css';

const STORAGE_KEY = 'jos_ai_messages';
const MAX_MESSAGES = 30;

const WELCOME_MESSAGE =
  "Hi, I'm Jos Pulse AI. Ask me anything about the website — places, opening hours, entry prices, events, flights, tee times, accounts, or any page or feature.";

// Restore the previous conversation so the chat keeps context across reloads.
const loadStoredMessages = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (Array.isArray(stored) && stored.length) {
      return stored.slice(-MAX_MESSAGES);
    }
  } catch {
    // Corrupted storage — fall through to a fresh welcome message.
  }
  return [{ sender: 'ai', text: WELCOME_MESSAGE }];
};

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
  const [messages, setMessages] = useState(loadStoredMessages);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  // Persist the visible conversation (capped) so it survives reloads.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_MESSAGES)));
    } catch {
      // Storage full/unavailable — the chat still works for this session.
    }
  }, [messages]);

  const handleReset = () => {
    if (isSending) return;
    const fresh = [{ sender: 'ai', text: WELCOME_MESSAGE }];
    setMessages(fresh);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const prompt = input.trim();
    if (!prompt || isSending) return;

    setMessages((previous) => [...previous, { sender: 'user', text: prompt }].slice(-MAX_MESSAGES));
    setInput('');
    setIsSending(true);

    try {
      const response = await askWebsiteSupport(prompt, sessionId, window.location.pathname);
      const reply =
        response?.reply ||
        response?.message ||
        "I couldn't find an answer just now — please try rephrasing your question.";
      setMessages((previous) => [...previous, { sender: 'ai', text: reply }].slice(-MAX_MESSAGES));
    } catch {
      setMessages((previous) => [
        ...previous,
        { sender: 'ai', text: 'Support chat is temporarily unavailable. Please try again shortly.' },
      ].slice(-MAX_MESSAGES));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.chatWrapper}>
      {!isOpen && (
        <button className={styles.floatingBtn} onClick={() => setIsOpen(true)} aria-label="Open Jos Pulse AI chat">
          <FontAwesomeIcon icon={faRobot} />
          <span>Jos Pulse AI</span>
        </button>
      )}

      {isOpen && (
        <section className={styles.chatBox} aria-label="Jos Pulse AI assistant" role="dialog">
          <div className={styles.chatHeader}>
            <div className={styles.headerTitle}>
              <FontAwesomeIcon icon={faRobot} />
              <span>Jos Pulse AI</span>
            </div>
            <div className={styles.headerButtons}>
              <button
                className={styles.closeBtn}
                onClick={handleReset}
                aria-label="Start a new chat"
                title="Start a new chat"
              >
                <FontAwesomeIcon icon={faArrowsRotate} />
              </button>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)} aria-label="Close chat">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
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
              placeholder="Ask about a place, price, event or feature"
              value={input}
              maxLength={500}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Your question"
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
