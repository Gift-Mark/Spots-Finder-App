import styles from './Main Analytics Dashboard.module.css';

// Dashboard presents aggregate activity metrics for administrators.
const MainAnalyticsDashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <h2 className={styles.logo}>Jos Pulse</h2>
          <span className={styles.logoSub}>Analytics</span>
        </div>
        <nav className={styles.nav}>
          <ul>
            <li className={styles.active}>
              <span className={styles.icon}>⊞</span> Overview
            </li>
            <li>
              <span className={styles.icon}>🧭</span> Discover Data
            </li>
            <li>
              <span className={styles.icon}>🗺</span> Heat Maps
            </li>
            <li>
              <span className={styles.icon}>👤</span> Admin Profile
            </li>
          </ul>
        </nav>
        <button className={styles.signOut}>
          <span className={styles.icon}>↳</span> Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Top Bar / Subheader */}
        <header className={styles.topBar}>
          <p className={styles.subtitle}>Live insights for Jos metropolitan area.</p>
          <div className={styles.liveBadge}>
            <span className={styles.pulseDot}></span> LIVE DATA
            <span className={styles.lastUpdated}>Last updated: Just now</span>
          </div>
        </header>

        {/* Top Stats Row */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.cardHeader}>
              <span>Total Active Seekers</span>
              <span className={styles.statIcon}>👥</span>
            </div>
            <p className={styles.value}>12,482</p>
            <span className={`${styles.note} ${styles.positive}`}>📈 +14.5% vs yesterday</span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.cardHeader}>
              <span>Trending Venues</span>
              <span className={styles.statIcon}>🔥</span>
            </div>
            <p className={styles.value}>34</p>
            <span className={`${styles.note} ${styles.positive}`}>📈 +5 new in last hour</span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.cardHeader}>
              <span>Vibe Check Accuracy</span>
              <span className={styles.statIcon}>🛡</span>
            </div>
            <p className={styles.value}>92.8%</p>
            <span className={`${styles.note} ${styles.neutral}`}>→ Consistent with avg</span>
          </div>
        </div>

        {/* Middle Row: Graph + Top Districts */}
        <div className={styles.middleRow}>
          {/* City Pulse Graph Card */}
          <div className={styles.graphCard}>
            <div className={styles.cardHeaderWithControls}>
              <div>
                <h3>City Pulse</h3>
                <p className={styles.cardSubtext}>Occupancy trends over 24h</p>
              </div>
              <div className={styles.timeToggle}>
                <button className={styles.activeToggle}>24H</button>
                <button>7D</button>
              </div>
            </div>
            <div className={styles.graphPlaceholder}>[Line Graph Render]</div>
          </div>

          {/* Top Districts Card */}
          <div className={styles.districtCard}>
            <h3>🏢 Top Districts</h3>
            <ul className={styles.districtList}>
              <li>
                <div className={styles.districtInfo}>
                  <span className={`${styles.avatar} ${styles.purpleBg}`}>R</span>
                  <div>
                    <strong>Rayfield</strong>
                    <span className={`${styles.badge} ${styles.lively}`}>Lively</span>
                  </div>
                </div>
                <div className={styles.capacityWrapper}>
                  <span className={styles.capacityVal}>98%</span>
                  <span className={styles.capacityLabel}>Capacity</span>
                </div>
              </li>

              <li>
                <div className={styles.districtInfo}>
                  <span className={`${styles.avatar} ${styles.goldBg}`}>T</span>
                  <div>
                    <strong>Terminus</strong>
                    <span className={`${styles.badge} ${styles.electric}`}>Electric</span>
                  </div>
                </div>
                <div className={styles.capacityWrapper}>
                  <span className={styles.capacityVal}>85%</span>
                  <span className={styles.capacityLabel}>Capacity</span>
                </div>
              </li>

              <li>
                <div className={styles.districtInfo}>
                  <span className={`${styles.avatar} ${styles.blueBg}`}>G</span>
                  <div>
                    <strong>Old GRA</strong>
                    <span className={`${styles.badge} ${styles.chill}`}>Chill</span>
                  </div>
                </div>
                <div className={styles.capacityWrapper}>
                  <span className={styles.capacityVal}>72%</span>
                  <span className={styles.capacityLabel}>Capacity</span>
                </div>
              </li>
            </ul>
            <button className={styles.viewMap}>View Map</button>
          </div>
        </div>

        {/* Social Feed Section */}
        <section className={styles.feedSection}>
          <div className={styles.feedHeader}>
            <h3>💬 What's the Word?</h3>
            <span className={styles.darkBadge}>Live Feed</span>
          </div>

          <div className={styles.feedGrid}>
            <div className={styles.postCard}>
              <div className={styles.postHeader}>
                <div className={styles.userMeta}>
                  <div className={styles.userAvatar}></div>
                  <strong>@NightOwlJos</strong>
                </div>
                <span className={styles.timeAgo}>2m ago</span>
              </div>
              <p>The rooftop at Rayfield Lounge is absolutely packed right now. Vibe is unmatched! 🔥</p>
              <div className={styles.locationTag}>
                <span>📍</span> Rayfield Lounge
              </div>
            </div>

            <div className={styles.postCard}>
              <div className={styles.postHeader}>
                <div className={styles.userMeta}>
                  <div className={styles.userAvatar}></div>
                  <strong>@BassDrop</strong>
                </div>
                <span className={styles.timeAgo}>15m ago</span>
              </div>
              <p>DJ just started the set at Club Terminus. Line is moving slow but worth it.</p>
              <div className={styles.locationTag}>
                <span>🎵</span> Club Terminus
              </div>
            </div>

            <div className={styles.postCard}>
              <div className={styles.postHeader}>
                <div className={styles.userMeta}>
                  <div className={styles.userAvatar}></div>
                  <strong>@ChillVibes</strong>
                </div>
                <span className={styles.timeAgo}>42m ago</span>
              </div>
              <p>Old GRA remains the best spot for a quiet drink. Cocktail menu is solid.</p>
              <div className={styles.locationTag}>
                <span>🍸</span> The Vintage Room
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MainAnalyticsDashboard;