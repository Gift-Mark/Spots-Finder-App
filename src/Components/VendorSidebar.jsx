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

export const VendorSidebar = ({ activeTab, onTabChange, businessName, venueImage }) => {
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

      {/* Dynamic Account Info Card (Replaces hardcoded Rayfield Golf Club) */}
      <div className={styles.accountCard} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', margin: '16px', backgroundColor: '#1E293B', borderRadius: '8px' }}>
        {venueImage ? (
          <img 
            src={venueImage} 
            alt={businessName} 
            style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} 
          />
        ) : (
          <div style={{ width: '40px', height: '40px', borderRadius: '6px', backgroundColor: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#FFF', fontSize: '16px' }}>
            {businessName ? businessName.charAt(0) : 'V'}
          </div>
        )}
        <div style={{ overflow: 'hidden' }}>
          <h3 className={styles.accountName} style={{ margin: 0, fontSize: '14px', color: '#FFFFFF', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {businessName || 'Vendor Portal'}
          </h3>
          <span className={styles.accountRole} style={{ fontSize: '11px', color: '#94A3B8' }}>Verified Partner</span>
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