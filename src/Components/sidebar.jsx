import styles from "../createHotspots.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThLarge,
  faLocationDot,
  faUsers,
  faChartSimple,
  faGear,
  faBullseye
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/adminDashboard") {
      return location.pathname.startsWith("/adminDashboard");
    }

    if (path === "/ModerationDashboard") {
      return location.pathname.startsWith("/ModerationDashboard");
    }

    return location.pathname === path;
  };

  return (
      <aside className={styles.sidebar}>
            <div className={styles.brandHeader}>
              <h2 className={styles.logoTitle}>Jos Pulse</h2>
              <span className={styles.logoSub}>Admin Terminal</span>
            </div>
    
            <nav className={styles.navMenu}>
              <ul>
                <li
                  className={isActive("/management") ? styles.activeNav : ""}
                  onClick={() => navigate("/management")}
                >
                  <FontAwesomeIcon icon={faThLarge} /> Dashboard
                </li>
                <li
                  className={isActive("/adminDashboard") ? styles.activeNav : ""}
                  onClick={() => navigate("/adminDashboard")}
                >
                  <FontAwesomeIcon icon={faLocationDot} /> Hot Spots
                </li>
                <li>
                  <FontAwesomeIcon icon={faUsers} /> User Pulse
                </li>
                <li
                  className={isActive("/ModerationDashboard") ? styles.activeNav : ""}
                  onClick={() => navigate("/ModerationDashboard")}
                >
                  <FontAwesomeIcon icon={faChartSimple} /> Moderation
                </li>
                <li>
                  <FontAwesomeIcon icon={faGear} /> Settings
                </li>
              </ul>
            </nav>
    
            <div className={styles.sidebarFooter}>
              <button className={styles.quickVibeBtn}>
                <FontAwesomeIcon icon={faBullseye} /> Quick VibeCheck
              </button>
    
              <div className={styles.userProfile}>
                <div className={styles.avatarPlaceholder} />
                <div className={styles.userInfo}>
                  <strong>Admin User</strong>
                  <span>System Admin</span>
                </div>
              </div>
            </div>
          </aside>
  );
};