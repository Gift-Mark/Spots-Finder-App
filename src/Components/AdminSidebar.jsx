import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTableCellsLarge, 
  faBuilding, 
  faCalendarCheck, 
  faUsers, 
  faBullhorn, 
  faTerminal, 
  faRightFromBracket 
} from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/AdminSidebar.module.css';

export const AdminSidebar = ({ activeTab = 'Overview', onTabChange, onSignOut }) => {
  const menuItems = [
    { name: 'Overview', icon: faTableCellsLarge },
    { name: 'Venue Management', icon: faBuilding },
    { name: 'Event Moderation', icon: faCalendarCheck },
    { name: 'Users', icon: faUsers },
    { name: 'Ads', icon: faBullhorn },
    { name: 'System Logs', icon: faTerminal },
  ];

  return (
    <aside className={styles.sidebar}>
      {/* Brand Header */}
      <div className={styles.brandContainer}>
        <h1 className={styles.brandName}>Jos Pulse Admin Terminal</h1>
        <span className={styles.brandTag}>Super Admin Access</span>
      </div>

      {/* Main Navigation Links */}
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

      {/* Sign Out Action Button */}
      <div className={styles.footerNav}>
        <button
          type="button"
          className={styles.signOutBtn}
          onClick={onSignOut}
        >
          <FontAwesomeIcon icon={faRightFromBracket} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;