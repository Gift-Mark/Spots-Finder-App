import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faBell, faCircleQuestion, faGrip } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/VendorHeader.module.css';

export const VendorHeader = ({ onSearch }) => {
  return (
    <header className={styles.headerContainer}>
      {/* Global Search Bar */}
      <div className={styles.searchWrapper}>
        <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search..."
          className={styles.searchInput}
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
      </div>

      {/* Action Utility Icons */}
      <div className={styles.utilities}>
        <button type="button" className={styles.iconBtn} aria-label="Notifications">
          <FontAwesomeIcon icon={faBell} />
          <span className={styles.notificationDot} />
        </button>

        <button type="button" className={styles.iconBtn} aria-label="Help Center">
          <FontAwesomeIcon icon={faCircleQuestion} />
        </button>

        <button type="button" className={styles.iconBtn} aria-label="App Switcher">
          <FontAwesomeIcon icon={faGrip} />
        </button>

        {/* User Profile Avatar */}
        <div className={styles.profileAvatar}>
          <img src="./assets/images/rayfield-golf-logo.jpg" alt="Rayfield Golf Club Manager" />
        </div>
      </div>
    </header>
  );
};

export default VendorHeader;