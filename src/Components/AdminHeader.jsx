import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faBell, faGear } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/AdminHeader.module.css';

export const AdminHeader = ({ onSearch, onNotifications, onSettings, onProfile }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <header className={styles.headerContainer}>
      {/* Platform Search Bar with Enter key support */}
      <form onSubmit={handleSubmit} className={styles.searchWrapper}>
        <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search platform... (Press Enter)"
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (onSearch) {
              onSearch(e.target.value); // Real-time global filter on type
            }
          }}
        />
      </form>

      {/* Utilities & Super Admin Avatar with Working Click Handlers */}
      <div className={styles.utilities}>
        <button 
          type="button" 
          className={styles.iconBtn} 
          aria-label="System Notifications"
          onClick={onNotifications}
          title="View Notifications"
        >
          <FontAwesomeIcon icon={faBell} />
          <span className={styles.notificationDot} />
        </button>

        <button 
          type="button" 
          className={styles.iconBtn} 
          aria-label="System Settings"
          onClick={onSettings}
          title="System Logs & Settings"
        >
          <FontAwesomeIcon icon={faGear} />
        </button>

        {/* Super Admin Profile Avatar */}
        <div 
          className={styles.profileAvatar} 
          onClick={onProfile}
          style={{ cursor: 'pointer' }}
          title="Super Admin Profile (Click)"
        >
          <img src="/images/John Doe.avif" alt="Super Admin Profile" />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;