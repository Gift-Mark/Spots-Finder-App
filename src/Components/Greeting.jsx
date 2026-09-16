import styles from "../discover.module.css";

// Presentation-only greeting; navigation state determines the text shown here.
export const Greeting = ({ name = "Alex", subtitle = "J-Town is alive." }) => {
  return (
    <div className={styles["greet-section"]}>
      <p className={styles["greet"]}>{name}</p>
      <p className={styles["town"]}>{subtitle}</p>
    </div>
  );
};