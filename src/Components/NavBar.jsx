import styles from "./NavBar.module.css";

// Compact page header whose optional callbacks are supplied by each screen.
const Navbar = ({ title = "Hot Spots", onMenuClick, onBellClick, onGearClick, showGear = true }) => {
  return (
    <nav className={styles['top-nav']}>
      <i
        className={styles['menu-icon']}
        onClick={onMenuClick}
        style={{ cursor: 'pointer' }}
        aria-label="menu"
      >☰</i>

      <h1>{title}</h1>

      <div className={styles['right-icons']}>
        <i
          className={styles['bell-icon']}
          onClick={onBellClick}
          style={{ cursor: 'pointer' }}
          aria-label="notifications"
        >🔔</i>
        {showGear && (
          <i
            className={styles['gear-icon']}
            onClick={onGearClick}
            style={{ cursor: 'pointer' }}
            aria-label="settings"
          >⚙</i>
        )}
      </div>
    </nav>
  );
};

export default Navbar;