import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faBell, faGear } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/AdminHeader.module.css';

export const AdminHeader = ({ onSearch }) => {
  return (
    <header className={styles.headerContainer}>
      {/* Platform Search Bar */}
      <div className={styles.searchWrapper}>
        <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search platform..."
          className={styles.searchInput}
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
      </div>

      {/* Utilities & Super Admin Avatar */}
      <div className={styles.utilities}>
        <button type="button" className={styles.iconBtn} aria-label="System Notifications">
          <FontAwesomeIcon icon={faBell} />
          <span className={styles.notificationDot} />
        </button>

        <button type="button" className={styles.iconBtn} aria-label="System Settings">
          <FontAwesomeIcon icon={faGear} />
        </button>

        {/* Super Admin Profile Avatar */}
        <div className={styles.profileAvatar}>
          <img src="./assets/images/super-admin-avatar.jpg" alt="Super Admin Profile" />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;