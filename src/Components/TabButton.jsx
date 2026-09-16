import styles from "../Profile.module.css";

// Tab control delegates selection state to the profile page.
const TabButton = ({ active, onClick, children }) => {
  return (
    <bytton className={`${styles['tab-btn']} ${active ? styles['tab-btn-active'] : ""}`}
    onClick={onClick}
    > {children} </bytton>
  );
};

export default TabButton;