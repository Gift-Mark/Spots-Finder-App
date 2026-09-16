import styles from './BottomNav.module.css';

// Shared primary navigation; the parent owns the selected tab state.
const BottomNav = ({ activeTab = 'profile', onTabSelect = () => {} }) => {
  return (
    <nav className={styles['bottom-nav']}>
      <button
        className={`${styles['nav-item']} ${activeTab === 'home' ? styles['nav-item-active'] : ''}`}
        onClick={() => onTabSelect('home')}
      >
        <i className="fa-solid fa-house"></i>
        <span>Home</span>
      </button>

      <button
        className={`${styles['nav-item']} ${activeTab === 'map' ? styles['nav-item-active'] : ''}`}
        onClick={() => onTabSelect('map')}
      >
        <i className="fa-solid fa-map-location-dot"></i>
        <span>Map</span>
      </button>

      <button
        className={`${styles['nav-item']} ${activeTab === 'feed' ? styles['nav-item-active'] : ''}`}
        onClick={() => onTabSelect('feed')}
      >
        <i className="fa-regular fa-newspaper"></i>
        <span>Feed</span>
      </button>

      <button
        className={`${styles['profile-pill']} ${activeTab === 'profile' ? styles['profile-pill-active'] : ''}`}
        onClick={() => onTabSelect('profile')}
      >
        <i className="fa-solid fa-user"></i>
        <span>Profile</span>
      </button>
    </nav>
  );
};

export default BottomNav;