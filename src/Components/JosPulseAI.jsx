import { useEffect, useRef, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faPaperPlane, faXmark, faArrowsRotate, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import { askWebsiteSupport } from '../api/client';
import styles from '../CSS/JosPulseAI.module.css';

const STORAGE_KEY = 'jos_ai_messages';
const MAX_MESSAGES = 30;

const WELCOME_MESSAGE =
  "Hi! I'm Jos Pulse AI 🤖\nI'm your guide to everything on this website — restaurants, events, stays, attractions, prices, opening hours and more.\n\nHow can I help you today?";

// Quick reply suggestions per page path
const PAGE_SUGGESTIONS = {
  '/explore':      ['What are the top spots in Jos?', 'Upcoming events this weekend', 'Best restaurants to visit'],
  '/dining':       ['Best restaurants in Jos', 'Where can I find suya?', 'Cozy cafes in Jos'],
  '/events':       ["What events are happening?", 'How do I buy tickets?', 'Upcoming music festivals'],
  '/stays':        ['Best hotels in Jos', 'Budget accommodation options', 'Rayfield resort info'],
  '/nightlife':    ['Best clubs in Jos', 'Live music venues', 'Late night food spots'],
  '/lounges':      ['Top lounges in Jos', 'Shisha bars near me', 'Relaxed bar recommendations'],
  '/golf':         ['Tee time booking', 'Golf club details', 'Rayfield Golf Club hours'],
  '/culture':      ['Cultural sites in Jos', 'Jos Museum', 'Heritage tours'],
  '/attractions':  ['Top tourist spots', 'Shere Hills trek info', 'Kurra Falls location'],
  '/guides':       ['Local guide prices', 'Heritage guided tours', 'Book a city guide'],
  '/flights':      ['Flights to Jos', 'Abuja to Jos route', 'Airport info'],
  '/claim':        ['How do I claim my venue?', 'Vendor dashboard info', 'Business listing process'],
  '/contact':      ['How to reach the team', 'Report a problem', 'Partnership inquiries'],
  '/privacy':      ['What data does Jos Pulse collect?', 'How is my data used?'],
  '/terms':        ['Terms of service summary', 'Refund policy', 'Venue owner rules'],
};

const DEFAULT_SUGGESTIONS = [
  'What is Jos Pulse?',
  'Best places to visit in Jos',
  'Upcoming events this week',
  'How do I create an account?',
];

const loadStoredMessages = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (Array.isArray(stored) && stored.length) {
      return stored.slice(-MAX_MESSAGES);
    }
  } catch {
    // Corrupted storage — fall through to fresh welcome.
  }
  return [{ sender: 'ai', text: WELCOME_MESSAGE }];
};

// Render AI message text — supports basic **bold**, bullet lines, and internal links
function AiMessageContent({ text }) {
  const lines = String(text).split('\n');
  return (
    <span>
      {lines.map((line, i) => {
        // Bullet point lines
        if (line.startsWith('• ') || line.startsWith('- ')) {
          return (
            <span key={i} style={{ display: 'block', paddingLeft: '4px' }}>
              {renderInline(line)}
              {i < lines.length - 1 && <br />}
            </span>
          );
        }
        return (
          <span key={i}>
            {renderInline(line)}
            {i < lines.length - 1 && <br />}
          </span>
        );
      })}
    </span>
  );
}

// Replace **bold** and /path-style links inside a line
function renderInline(line) {
  // Match **bold** and internal /paths mentioned
  const parts = [];
  const regex = /\*\*(.+?)\*\*|(\/([\w-]+))/g;
  let lastIdx = 0;
  let match;
  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIdx) {
      parts.push(line.slice(lastIdx, match.index));
    }
    if (match[1]) {
      // **bold**
      parts.push(<strong key={match.index}>{match[1]}</strong>);
    } else if (match[2]) {
      // /path link
      parts.push(
        <Link key={match.index} to={match[2]} style={{ color: '#f97316', textDecoration: 'underline', fontSize: 'inherit' }}>
          {match[2]}
        </Link>
      );
    }
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < line.length) {
    parts.push(line.slice(lastIdx));
  }
  return parts.length ? parts : line;
}

export const JosPulseAI = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [sessionId] = useState(() => {
    const existing = localStorage.getItem('jos_session_id');
    if (existing) return existing;
    const newId = `sess_${crypto.randomUUID()}`;
    localStorage.setItem('jos_session_id', newId);
    return newId;
  });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [messages, setMessages] = useState(loadStoredMessages);

  // Get suggestions for current page
  const currentSuggestions = PAGE_SUGGESTIONS[location.pathname] || DEFAULT_SUGGESTIONS;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  // Persist conversation
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_MESSAGES)));
    } catch {
      // Storage unavailable
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleReset = () => {
    if (isSending) return;
    setMessages([{ sender: 'ai', text: WELCOME_MESSAGE }]);
    setShowSuggestions(true);
  };

  const sendMessage = useCallback(async (prompt) => {
    const text = String(prompt).trim();
    if (!text || isSending) return;

    setMessages(prev => [...prev, { sender: 'user', text }].slice(-MAX_MESSAGES));
    setInput('');
    setShowSuggestions(false);
    setIsSending(true);

    try {
      const response = await askWebsiteSupport(text, sessionId, location.pathname);
      const reply =
        response?.reply ||
        response?.message ||
        "I couldn't find an answer just now — try rephrasing or ask me something else about Jos Pulse.";
      setMessages(prev => [...prev, { sender: 'ai', text: reply }].slice(-MAX_MESSAGES));
    } catch {
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: 'The support service is temporarily unavailable. Please try again in a moment.' },
      ].slice(-MAX_MESSAGES));
    } finally {
      setIsSending(false);
    }
  }, [isSending, sessionId, location.pathname]);

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  return (
    <div className={styles.chatWrapper}>
      {/* Floating launch button */}
      {!isOpen && (
        <button
          className={styles.floatingBtn}
          onClick={() => setIsOpen(true)}
          aria-label="Open Jos Pulse AI support chat"
        >
          <FontAwesomeIcon icon={faRobot} />
          <span>Jos Pulse AI</span>
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <section className={styles.chatBox} aria-label="Jos Pulse AI assistant" role="dialog">
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerTitle}>
              <FontAwesomeIcon icon={faRobot} />
              <div>
                <div>Jos Pulse AI</div>
                <div className={styles.onlineStatus}>
                  <span className={styles.onlineDot} />
                  Online — ask me anything
                </div>
              </div>
            </div>
            <div className={styles.headerButtons}>
              <button
                className={styles.headerActionBtn}
                onClick={handleReset}
                aria-label="Start new conversation"
                title="New conversation"
                disabled={isSending}
              >
                <FontAwesomeIcon icon={faArrowsRotate} />
              </button>
              <button
                className={styles.headerActionBtn}
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                title="Close"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className={styles.messagesArea} role="log" aria-live="polite">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={msg.sender === 'ai' ? styles.aiMsg : styles.userMsg}
              >
                {msg.sender === 'ai' ? (
                  <AiMessageContent text={msg.text} />
                ) : (
                  msg.text
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isSending && (
              <div className={styles.aiMsg}>
                <div className={styles.typingDots}>
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick reply suggestions */}
          {showSuggestions && !isSending && (
            <div className={styles.suggestionsArea}>
              <div className={styles.suggestionsLabel}>
                <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '9px' }} />
                Suggested questions
              </div>
              <div className={styles.suggestionsList}>
                {currentSuggestions.map((s, i) => (
                  <button
                    key={i}
                    className={styles.suggestionChip}
                    onClick={() => handleSuggestionClick(s)}
                    type="button"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Privacy note */}
          <p className={styles.privacyNote}>
            Questions are saved with personal details removed to improve support. Don't share passwords or payment info.
          </p>

          {/* Input form */}
          <form onSubmit={handleSend} className={styles.inputArea}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about any place, event or feature…"
              value={input}
              maxLength={500}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Your question for Jos Pulse AI"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              aria-label="Send message"
              title="Send"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </form>
        </section>
      )}
    </div>
  );
};

export default JosPulseAI;
