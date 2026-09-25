import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTableCellsLarge, 
  faBuilding, 
  faTicket, 
  faBullhorn, 
  faStar, 
  faGear 
} from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/VendorSidebar.module.css';

export const VendorSidebar = ({ activeTab = 'Overview', onTabChange }) => {
  const menuItems = [
    { name: 'Overview', icon: faTableCellsLarge },
    { name: 'My Venue Profile', icon: faBuilding },
    { name: 'Events & Tickets', icon: faTicket },
    { name: 'Promoted Listings', icon: faBullhorn },
    { name: 'Reviews', icon: faStar },
  ];

  return (
    <aside className={styles.sidebar}>
      {/* Brand Header */}
      <div className={styles.brandContainer}>
        <h1 className={styles.brandName}>Jos Pulse</h1>
        <span className={styles.brandTag}>Vendor Dashboard</span>
      </div>

      {/* Account Info */}
      <div className={styles.accountCard}>
        <img 
          src="/images/Rayfield Golf club.webp"
          alt="Rayfield Golf Club" 
          className={styles.accountAvatar}
        />
        <div className={styles.accountDetails}>
          <h3 className={styles.accountName}>Rayfield Golf Club</h3>
          <span className={styles.accountRole}>Manager Account</span>
        </div>
      </div>

      {/* Primary Navigation Links */}
      <nav className={styles.navigation}>
        {menuItems.map((item) => (
          <button
            key={item.name}
            type="button"
            className={`${styles.navItem} ${activeTab === item.name ? styles.activeNavItem : ''}`}
            onClick={() => onTabChange && onTabChange(item.name)}
          >
            <FontAwesomeIcon icon={item.icon} className={styles.navIcon} />
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Settings at Bottom */}
      <div className={styles.footerNav}>
        <button
          type="button"
          className={`${styles.navItem} ${activeTab === 'Settings' ? styles.activeNavItem : ''}`}
          onClick={() => onTabChange && onTabChange('Settings')}
        >
          <FontAwesomeIcon icon={faGear} className={styles.navIcon} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default VendorSidebar;