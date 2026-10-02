import { useState, useEffect } from "react";
import styles from "../CSS/HeritageGrid.module.css";

// Pure helper function defined outside the component
function getRemainingTime(targetDate) {
  const difference = +new Date(targetDate) - +new Date();
  if (difference <= 0) return null;

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export function FestivalCountdown({ targetDate }) {
  // 1. Lazy initialization: sets initial state on first mount without triggering setState inside effect
  const [timeLeft, setTimeLeft] = useState(() => getRemainingTime(targetDate));

  useEffect(() => {
    // 2. Only update state on interval ticks
    const timer = setInterval(() => {
      setTimeLeft(getRemainingTime(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return <div className={styles.liveNowBadge}>🎉 FESTIVAL IS LIVE NOW!</div>;
  }

  return (
    <div className={styles.countdownContainer}>
      <span className={styles.countdownLabel}>FESTIVAL STARTS IN</span>
      <div className={styles.timerGrid}>
        <div className={styles.timeBlock}>
          <strong>{timeLeft.days}</strong>
          <span>Days</span>
        </div>
        <div className={styles.timeBlock}>
          <strong>{timeLeft.hours}</strong>
          <span>Hrs</span>
        </div>
        <div className={styles.timeBlock}>
          <strong>{timeLeft.minutes}</strong>
          <span>Min</span>
        </div>
        <div className={styles.timeBlock}>
          <strong>{timeLeft.seconds}</strong>
          <span>Sec</span>
        </div>
      </div>
    </div>
  );
}