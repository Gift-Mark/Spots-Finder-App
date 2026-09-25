import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/JosPulseAI.module.css';

export const JosPulseAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I'm your Jos Pulse AI Guide. Are you looking for adventure sports, cultural heritage, or local dining in Jos today?",
    },
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);

    // Simple rule/heuristic AI inference based on user input
    setTimeout(() => {
      let reply = "I recommend checking out Shere Hills for hiking or the Jos Museum for cultural history!";
      const query = input.toLowerCase();

      if (query.includes('sport') || query.includes('hike') || query.includes('golf')) {
        reply = "For sports lovers, I recommend hiking at Shere Hills or teeing off at Africa's oldest course, Rayfield Golf Club!";
      } else if (query.includes('festival') || query.includes('culture') || query.includes('heritage')) {
        reply = "You shouldn't miss the Nzem Berom Cultural Festival or a trip to the historic Jos Museum!";
      } else if (query.includes('food') || query.includes('eat') || query.includes('restaurant')) {
        reply = "Check out The Crest Restaurant for panoramic views and local cuisine!";
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 600);

    setInput('');
  };

  return (
    <div className={styles.chatWrapper}>
      {!isOpen && (
        <button className={styles.floatingBtn} onClick={() => setIsOpen(true)}>
          <FontAwesomeIcon icon={faRobot} />
          <span>Ask AI Concierge</span>
        </button>
      )}

      {isOpen && (
        <div className={styles.chatBox}>
          <div className={styles.chatHeader}>
            <div className={styles.headerTitle}>
              <FontAwesomeIcon icon={faRobot} />
              <span>Jos Pulse AI Guide</span>
            </div>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className={styles.messagesArea}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={msg.sender === 'ai' ? styles.aiMsg : styles.userMsg}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className={styles.inputArea}>
            <input
              type="text"
              placeholder="e.g., Plan a 2-day outdoor adventure in Jos..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit">
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default JosPulseAI;