import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMagnifyingGlass, 
  faBell, 
  faCircleQuestion, 
  faGrip,
  faUser,
  faGear,
  faRightFromBracket,
  faPlus,
  faGlobe,
  faCheckDouble
} from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/VendorHeader.module.css';

export const VendorHeader = ({ 
  onSearch, 
  businessName, 
  venueImage, 
  category,
  onNavigateTab,
  onOpenCreateEvent 
}) => {
  const navigate = useNavigate();

  // Active Dropdown States
  const [activeMenu, setActiveMenu] = useState(null); // 'notifications' | 'help' | 'apps' | 'profile' | null
  const headerRef = useRef(null);

  // Sample Live Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Ticket Sold', desc: 'A user bought 2 tickets for Highland Jazz Night', time: '10m ago', unread: true },
    { id: 2, title: 'Venue Claim Pending', desc: 'Upload proof of ownership to complete verification', time: '1h ago', unread: true },
    { id: 3, title: 'New 5-Star Review', desc: 'Aisha Bello left a review for ' + (businessName || 'your venue'), time: '1d ago', unread: false }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (menuName) => {
    setActiveMenu(prev => prev === menuName ? null : menuName);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleLogout = () => {
    if (window.confirm('Log out of Vendor Dashboard?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('jos_pulse_user');
      navigate('/login');
    }
  };

  return (
    <header className={styles.headerContainer} ref={headerRef} style={{ position: 'relative' }}>
      {/* Search Input */}
      <div className={styles.searchWrapper}>
        <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search events, reviews, tickets..."
          className={styles.searchInput}
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
      </div>

      {/* Action Utility Buttons */}
      <div className={styles.utilities} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        
        {/* 1. NOTIFICATIONS BUTTON & DROPDOWN */}
        <div style={{ position: 'relative' }}>
          <button 
            type="button" 
            className={styles.iconBtn} 
            aria-label="Notifications"
            onClick={() => toggleMenu('notifications')}
            style={{ position: 'relative' }}
          >
            <FontAwesomeIcon icon={faBell} />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', backgroundColor: '#EF4444', borderRadius: '50%' }} />
            )}
          </button>

          {activeMenu === 'notifications' && (
            <div style={dropdownStyles.container}>
              <div style={dropdownStyles.header}>
                <strong style={{ fontSize: '13px', color: '#0F172A' }}>Notifications ({unreadCount})</strong>
                {unreadCount > 0 && (
                  <button onClick={markAllNotificationsRead} style={dropdownStyles.linkBtn}>
                    <FontAwesomeIcon icon={faCheckDouble} /> Mark read
                  </button>
                )}
              </div>
              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9', backgroundColor: n.unread ? '#FEFCE8' : '#FFFFFF' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '12px', color: '#0F172A' }}>{n.title}</strong>
                      <span style={{ fontSize: '10px', color: '#94A3B8' }}>{n.time}</span>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#475569', lineHeight: '1.4' }}>{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. HELP & SUPPORT BUTTON & DROPDOWN */}
        <div style={{ position: 'relative' }}>
          <button 
            type="button" 
            className={styles.iconBtn} 
            aria-label="Help Center"
            onClick={() => toggleMenu('help')}
          >
            <FontAwesomeIcon icon={faCircleQuestion} />
          </button>

          {activeMenu === 'help' && (
            <div style={dropdownStyles.container}>
              <div style={dropdownStyles.header}>
                <strong style={{ fontSize: '13px', color: '#0F172A' }}>Jos Pulse Partner Help</strong>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a 
                  href="https://wa.me/2348030000000?text=Hello%20Jos%20Pulse%20Support,%20I%20need%20help%20with%20my%20vendor%20dashboard" 
                  target="_blank" 
                  rel="noreferrer"
                  style={dropdownStyles.actionItem}
                >
                  💬 Chat Support via WhatsApp
                </a>
                <button 
                  type="button"
                  onClick={() => alert('Platform guide: Navigate tabs to manage events, ticket payouts, and reviews.')} 
                  style={dropdownStyles.actionItemBtn}
                >
                  📖 View Dashboard Guide
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. APP SWITCHER / QUICK ACTIONS */}
        <div style={{ position: 'relative' }}>
          <button 
            type="button" 
            className={styles.iconBtn} 
            aria-label="Quick Actions"
            onClick={() => toggleMenu('apps')}
          >
            <FontAwesomeIcon icon={faGrip} />
          </button>

          {activeMenu === 'apps' && (
            <div style={{ ...dropdownStyles.container, width: '220px' }}>
              <div style={dropdownStyles.header}>
                <strong style={{ fontSize: '13px', color: '#0F172A' }}>Quick Tools</strong>
              </div>
              <div style={{ padding: '8px' }}>
                <button 
                  onClick={() => { setActiveMenu(null); onOpenCreateEvent && onOpenCreateEvent(); }}
                  style={dropdownStyles.menuBtn}
                >
                  <FontAwesomeIcon icon={faPlus} style={{ color: '#F97316' }} /> Create New Event
                </button>
                <button 
                  onClick={() => { setActiveMenu(null); navigate('/events'); }}
                  style={dropdownStyles.menuBtn}
                >
                  <FontAwesomeIcon icon={faGlobe} style={{ color: '#2563EB' }} /> View Live Events Page
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. PROFILE AVATAR & DROPDOWN MENU */}
        <div style={{ position: 'relative', marginLeft: '8px' }}>
          <div 
            onClick={() => toggleMenu('profile')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '4px 8px', borderRadius: '8px', transition: 'background 0.2s' }}
          >
            <div style={{ textAlign: 'right' }}>
              <strong style={{ display: 'block', fontSize: '13px', color: '#0F172A' }}>
                {businessName || 'Vendor Account'}
              </strong>
              <span style={{ fontSize: '11px', color: '#64748B' }}>
                {category || 'Partner'}
              </span>
            </div>

            {venueImage ? (
              <img 
                src={venueImage} 
                alt={businessName} 
                style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #F97316' }} 
              />
            ) : (
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#0F172A', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                {businessName ? businessName.charAt(0) : 'V'}
              </div>
            )}
          </div>

          {activeMenu === 'profile' && (
            <div style={{ ...dropdownStyles.container, right: 0, width: '200px' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9', backgroundColor: '#F8FAFC' }}>
                <strong style={{ fontSize: '13px', color: '#0F172A', display: 'block' }}>{businessName}</strong>
                <span style={{ fontSize: '11px', color: '#64748B' }}>{category}</span>
              </div>
              <div style={{ padding: '8px' }}>
                <button 
                  onClick={() => { setActiveMenu(null); onNavigateTab && onNavigateTab('My Venue Profile'); }}
                  style={dropdownStyles.menuBtn}
                >
                  <FontAwesomeIcon icon={faUser} /> Venue Profile
                </button>
                <button 
                  onClick={() => { setActiveMenu(null); onNavigateTab && onNavigateTab('Settings'); }}
                  style={dropdownStyles.menuBtn}
                >
                  <FontAwesomeIcon icon={faGear} /> Account Settings
                </button>
                <div style={{ borderTop: '1px solid #F1F5F9', margin: '4px 0' }} />
                <button 
                  onClick={handleLogout}
                  style={{ ...dropdownStyles.menuBtn, color: '#DC2626' }}
                >
                  <FontAwesomeIcon icon={faRightFromBracket} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

const dropdownStyles = {
  container: {
    position: 'absolute',
    top: '48px',
    right: 0,
    width: '280px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    border: '1px solid #E2E8F0',
    zIndex: 1000,
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #F1F5F9',
    backgroundColor: '#FAFAFA'
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: '#F97316',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    padding: 0
  },
  actionItem: {
    display: 'block',
    padding: '10px 12px',
    backgroundColor: '#F8FAFC',
    borderRadius: '8px',
    color: '#0F172A',
    fontSize: '12px',
    fontWeight: '600',
    textDecoration: 'none',
    border: '1px solid #E2E8F0'
  },
  actionItemBtn: {
    width: '100%',
    textAlign: 'left',
    padding: '10px 12px',
    backgroundColor: '#F8FAFC',
    borderRadius: '8px',
    color: '#0F172A',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid #E2E8F0',
    cursor: 'pointer'
  },
  menuBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    color: '#334155',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background 0.15s'
  }
};

export default VendorHeader;