import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './CSS/userDashboard.module.css';

const socket = io('http://localhost:5000');

const SPOTS_GEO = [
  { id: 1, name: 'Rayfield Resort', lat: 9.8358, lng: 8.9131, type: 'Resort', price: '₦12,500' },
  { id: 2, name: 'Shere Hills Peak', lat: 9.9542, lng: 9.0225, type: 'Scenic', price: '₦3,500' },
  { id: 3, name: 'Jos Wildlife Park', lat: 9.8722, lng: 8.8751, type: 'Nature', price: '₦1,500' },
  { id: 4, name: 'Solomon Lar Leisure Gardens', lat: 9.9051, lng: 8.8912, type: 'Dining', price: 'Free' }
];

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState('Overview');
  const [activeTab, setActiveTab] = useState('Passes');
  const [behaviorStream, setBehaviorStream] = useState([]);
  const [feedPosts, setFeedPosts] = useState([
    { id: 'p1', user: 'Tobi A.', location: 'Shere Hills Monolith', content: 'Trek conditions are pristine this afternoon over Plateau!', time: '12:40 PM' }
  ]);
  const [postInput, setPostInput] = useState('');
  const [weather, setWeather] = useState({ temp: '22°', breeze: '14 km/h', humidity: '18%', uv: '3 Mod' });

  // Reserved for future live weather updates.
  void setWeather;

  useEffect(() => {
    socket.on('realtime_behavior_logged', (log) => {
      setBehaviorStream((prev) => [log, ...prev.slice(0, 5)]);
    });

    socket.on('post_published', (newPost) => {
      setFeedPosts((prev) => [newPost, ...prev]);
    });

    return () => {
      socket.off('realtime_behavior_logged');
      socket.off('post_published');
    };
  }, []);

  const logBehavior = async (eventType, payload) => {
    try {
      const res = await fetch('http://localhost:5000/api/behavior/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: 'sess_user_9921', eventType, payload })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setBehaviorStream((prev) => [data.data, ...prev.slice(0, 5)]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const publishFeedPost = () => {
    if (!postInput.trim()) return;
    const post = {
      id: `p_${Date.now()}`,
      user: 'Jane D.',
      location: 'Rayfield Promenade',
      content: postInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    socket.emit('create_post', post);
    logBehavior('CATEGORY_CLICK', { category: 'Feed Post', content: postInput });
    setPostInput('');
  };

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.brandGroup}>
          <span className={styles.brandLogo}>🔥 Jos Pulse</span>
          <nav className={styles.topNav}>
            <a href="#explore">Explore</a>
            <a href="#culture">Culture</a>
            <a href="#dining">Dining</a>
            <a href="#nightlife">Nightlife</a>
            <a href="#bookings">Bookings</a>
          </nav>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.proBadge}>● PRO MEMBER</span>
          <div className={styles.userInfo}>
            <span className={styles.userAvatar}>👤</span>
            <div>
              <strong>Jane D.</strong>
              <small>Plateau Explorer</small>
            </div>
          </div>
          <button className={styles.logoutBtn}>↪ Log Out</button>
        </div>
      </header>

      <div className={styles.mainLayout}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <small className={styles.sidebarLabel}>MAIN CONSOLE</small>
            <button
              className={`${styles.sideBtn} ${activeNav === 'Overview' ? styles.sideBtnActive : ''}`}
              onClick={() => { setActiveNav('Overview'); logBehavior('FILTER_SELECT', { nav: 'Overview' }); }}
            >
              📊 Overview
            </button>
            <button
              className={`${styles.sideBtn} ${activeNav === 'Bookings' ? styles.sideBtnActive : ''}`}
              onClick={() => { setActiveNav('Bookings'); logBehavior('FILTER_SELECT', { nav: 'Bookings' }); }}
            >
              🎟️ My Bookings
            </button>
            <button
              className={`${styles.sideBtn} ${activeNav === 'Saved' ? styles.sideBtnActive : ''}`}
              onClick={() => { setActiveNav('Saved'); logBehavior('FILTER_SELECT', { nav: 'Saved' }); }}
            >
              🔖 Saved Spots
            </button>
            <button
              className={`${styles.sideBtn} ${activeNav === 'Feed' ? styles.sideBtnActive : ''}`}
              onClick={() => { setActiveNav('Feed'); logBehavior('FILTER_SELECT', { nav: 'Feed' }); }}
            >
              📡 Live Feed
            </button>
            <button
              className={`${styles.sideBtn} ${activeNav === 'Map' ? styles.sideBtnActive : ''}`}
              onClick={() => { setActiveNav('Map'); logBehavior('VENUE_VIEW', { nav: 'Map' }); }}
            >
              🗺️ Map Engine
            </button>
          </div>

          {/* REALTIME BEHAVIOR WIDGET */}
          <div className={styles.sidebarWidget}>
            <small className={styles.sidebarLabel}>LIVE LOGSTREAM</small>
            <div className={styles.miniLogList}>
              {behaviorStream.length === 0 ? (
                <small className={styles.subtext}>Awaiting events...</small>
              ) : (
                behaviorStream.map((log, i) => (
                  <div key={log._id || i} className={styles.miniLogCard}>
                    <span className={styles.logTag}>{log.eventType}</span>
                    <small>{log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : 'Just now'}</small>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={styles.conciergeBox}>
            <strong>🎧 Jos Concierge</strong>
            <p>24/7 Plateau travel & dining assistance available.</p>
            <button className={styles.settingsBtn}>⚙️ Settings</button>
          </div>
        </aside>

        {/* MAIN DISPLAY AREA */}
        <main className={styles.content}>
          {activeNav === 'Overview' && (
            <>
              {/* HERO BANNER MATCHING MOCKUP */}
              <section className={styles.heroCard}>
                <div className={styles.heroLeft}>
                  <span className={styles.pillBadge}>📍 PLATEAU TRAVEL & VIBE PORTAL</span>
                  <h1>Good morning, Jane</h1>
                  <p>Your Plateau adventure desk — track local access passes, Rayfield lakeside bookings, and flights into Jos Yakubu Gowon Airport.</p>
                  <div className={styles.heroStats}>
                    <span>🌐 1,280m Elevation</span>
                    <span>✓ Jos Verified Hub</span>
                    <span>🕒 03:30 PM WAT</span>
                  </div>
                </div>

                <div className={styles.heroWeatherWidget}>
                  <small>PLATEAU HIGHLANDS<br />Jos, NG</small>
                  <div className={styles.weatherTemp}>{weather.temp} <span className={styles.optimaTag}>Optimal</span></div>
                  <div className={styles.weatherGrid}>
                    <div><small>BREEZE</small><br /><strong>{weather.breeze}</strong></div>
                    <div><small>HUMIDITY</small><br /><strong>{weather.humidity}</strong></div>
                    <div><small>UV INDEX</small><br /><strong>{weather.uv}</strong></div>
                  </div>
                </div>
              </section>

              {/* TWO FEATURED ACTION CARDS MATCHING MOCKUP */}
              <section className={styles.twoColumnGrid}>
                <div className={styles.actionCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardIcon}>🧭</span>
                    <small>FEATURED ESCAPES</small>
                  </div>
                  <h3>Explore Plateau Spots</h3>
                  <p>Discover historic and vibrant venues across Rayfield Resort, pristine Shere Hills monoliths, and the legendary Jos Polo Fields.</p>
                  <div className={styles.tagGroup}>
                    <span className={styles.subTag}>Rayfield Waters</span>
                    <span className={styles.subTag}>Shere Peak Trails</span>
                    <span className={styles.subTag}>National Museum</span>
                  </div>
                  <button
                    className={styles.primaryDarkBtn}
                    onClick={() => logBehavior('SEARCH', { query: 'Browse 35+ Local Venues' })}
                  >
                    Browse 35+ Local Venues →
                  </button>
                </div>

                <div className={styles.actionCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardIcon}>✈️️</span>
                    <small>YAKUBU GOWON JOS</small>
                  </div>
                  <h3>Book Domestic Flights</h3>
                  <p>Connect seamlessly from Lagos (LOS) and Abuja (ABV) to Jos Airport. Track regional highland hops, delays, and arrivals in real time.</p>
                  <div className={styles.tagGroup}>
                    <span className={styles.subTag}>LOS → JOS</span>
                    <span className={styles.subTag}>ABV → JOS</span>
                    <span className={styles.subTag}>50 min direct</span>
                  </div>
                  <button
                    className={styles.secondaryLightBtn}
                    onClick={() => logBehavior('BOOKING_ATTEMPT', { flight: 'LOS-JOS' })}
                  >
                    Check Flight Schedules ↗
                  </button>
                </div>
              </section>

              {/* TABS + QR TICKET PASS SECTION MATCHING MOCKUP */}
              <section className={styles.passSection}>
                <div className={styles.passHeader}>
                  <div>
                    <small>LIVE RESERVATIONS</small>
                    <h2>My Active Travel Passes</h2>
                  </div>
                  <div className={styles.tabToggle}>
                    <button
                      className={activeTab === 'Passes' ? styles.activeTabBtn : styles.tabBtn}
                      onClick={() => setActiveTab('Passes')}
                    >
                      🎫 Access Passes (1)
                    </button>
                    <button
                      className={activeTab === 'Flights' ? styles.activeTabBtn : styles.tabBtn}
                      onClick={() => setActiveTab('Flights')}
                    >
                      ✈️ Flight Reservations (1)
                    </button>
                  </div>
                </div>

                <div className={styles.ticketGrid}>
                  {/* LEFT PASS INFO */}
                  <div className={styles.ticketMain}>
                    <div className={styles.badgeRow}>
                      <span className={styles.goldBadge}>VIP WEEKEND PASS</span>
                      <span className={styles.activePill}>● ACTIVE FOR ENTRY</span>
                      <small className={styles.refCode}>Ref: #JP-88219-QR</small>
                    </div>

                    <h2>Rayfield Holiday Resort & Water Park</h2>
                    <p className={styles.locSub}>📍 Rayfield Lake Promenade, Jos South, Plateau State</p>

                    <div className={styles.ticketDetailsRow}>
                      <div>
                        <small>SCHEDULED DATE</small>
                        <p>Sat, Oct 25, 2026<br />10:00 AM WAT</p>
                      </div>
                      <div>
                        <small>PARTY SIZE</small>
                        <p>3 Guests<br />2 Adults, 1 Child</p>
                      </div>
                      <div>
                        <small>TOTAL PAID</small>
                        <p className={styles.priceHighlight}>₦12,500<br /><small>Instant Clearance</small></p>
                      </div>
                    </div>

                    <div className={styles.amenitiesBox}>
                      <small>🏷️ INCLUDED PRIVILEGE AMENITIES</small>
                      <p>Full 45-minute Lake Rayfield Boat Cruise, private Lakeside Cabana entry, and complimentary Zobo coolers.</p>
                    </div>

                    <div className={styles.ticketFooter}>
                      <small>🛡️ Valid Government ID required at turnstiles</small>
                      <button
                        className={styles.downloadBtn}
                        onClick={() => logBehavior('CATEGORY_CLICK', { action: 'Download Ticket PDF' })}
                      >
                        📥 Download Pass (PDF)
                      </button>
                    </div>
                  </div>

                  {/* RIGHT QR TICKET SCANNER */}
                  <div className={styles.qrCard}>
                    <div className={styles.qrHeader}>
                      <span>FAST PASS GATE</span>
                      <span>✖</span>
                    </div>

                    <div className={styles.qrFrame}>
                      {/* SVG QR CODE PATTERN MATCHING TARGET MOCKUP */}
                      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 2H10V10H2V2ZM4 4V8H8V4H4ZM14 2H22V10H14V2ZM16 4V8H20V4H16ZM2 14H10V22H2V14ZM4 16V20H8V16H4ZM12 12H14V14H12V12ZM14 14H16V16H14V14ZM16 12H18V14H16V12ZM18 14H20V16H18V14ZM20 12H22V14H20V12ZM12 16H14V18H12V16ZM14 18H16V20H14V18ZM16 16H18V18H16V16ZM18 18H20V20H18V18ZM20 16H22V18H20V16ZM12 20H14V22H12V20ZM16 20H18V22H16V20ZM20 20H22V22H20V20Z" fill="#0f172a"/>
                      </svg>
                    </div>

                    <small className={styles.scanText}>SCAN AT ENTRANCE<br />Gate A • Turnstile #3</small>
                    <button className={styles.presentBtn}>Present Pass on Phone</button>
                  </div>
                </div>
              </section>

              {/* BOTTOM CURATIONS CARDS */}
              <section className={styles.trendingSection}>
                <div className={styles.trendingHeader}>
                  <div>
                    <small>PLATEAU CURATIONS</small>
                    <h3>Trending Nearby in Jos</h3>
                  </div>
                  <a href="#catalog" className={styles.viewCatalogLink}>View Full City Catalog ›</a>
                </div>

                <div className={styles.cards3Grid}>
                  {/* CARD 1 */}
                  <div
                    className={styles.curationCard}
                    onClick={() => logBehavior('VENUE_VIEW', { name: 'Shere Hills Monolith' })}
                  >
                    <div className={styles.imageBox}>
                      <span className={styles.curTag}>HIKING & SCENIC</span>
                      <span className={styles.ratingBadge}>★ 4.9 (182)</span>
                    </div>
                    <h4>Shere Hills Monolith Trek</h4>
                    <p>Ascend to the highest points of Plateau State. Guided trail runs, rocky caves, and breathtaking overlooks.</p>
                    <div className={styles.cardFooter}>
                      <small>From ₦3,500 / guide</small>
                      <span>→</span>
                    </div>
                  </div>

                  {/* CARD 2 */}
                  <div
                    className={styles.curationCard}
                    onClick={() => logBehavior('VENUE_VIEW', { name: 'Jos Wildlife Park' })}
                  >
                    <div className={styles.imageBox2}>
                      <span className={styles.curTag}>NATURE RESERVE</span>
                      <span className={styles.ratingBadge}>★ 4.7 (210)</span>
                    </div>
                    <h4>Jos Wildlife Park & Safari</h4>
                    <p>A sprawling scenic conservation park offering tranquil pine tree picnic gardens and exotic regional fauna.</p>
                    <div className={styles.cardFooter}>
                      <small>From ₦1,500 / entry</small>
                      <span>→</span>
                    </div>
                  </div>

                  {/* CARD 3 */}
                  <div
                    className={styles.curationCard}
                    onClick={() => logBehavior('VENUE_VIEW', { name: 'Solomon Lar Gardens' })}
                  >
                    <div className={styles.imageBox3}>
                      <span className={styles.curTag}>LEISURE & DINING</span>
                      <span className={styles.ratingBadge}>★ 4.8 (95)</span>
                    </div>
                    <h4>Solomon Lar Leisure Gardens</h4>
                    <p>Charming green haven perfect for weekend picnics, local grilled Plateau suya, and peaceful relaxation.</p>
                    <div className={styles.cardFooter}>
                      <small>Free Public Access</small>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* REALTIME LIVE FEED PANEL */}
          {activeNav === 'Feed' && (
            <section className={styles.panelSection}>
              <h2>📡 Live Community Feed</h2>
              <div className={styles.postComposer}>
                <textarea
                  value={postInput}
                  onChange={(e) => setPostInput(e.target.value)}
                  placeholder="Broadcast live updates from Jos..."
                  rows="3"
                />
                <button className={styles.publishBtn} onClick={publishFeedPost}>Broadcast Live</button>
              </div>

              <div className={styles.feedStream}>
                {feedPosts.map((post) => (
                  <div key={post.id} className={styles.feedCard}>
                    <strong>{post.user}</strong> <small>📍 {post.location}</small>
                    <p>{post.content}</p>
                    <small>{post.time}</small>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* MAP ENGINE PANEL */}
          {activeNav === 'Map' && (
            <section className={styles.panelSection}>
              <h2>🗺️ Plateau Interactive Map</h2>
              <div className={styles.mapContainerBox}>
                <MapContainer center={[9.9285, 8.8921]} zoom={12} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
                  {SPOTS_GEO.map((s) => (
                    <Marker
                      key={s.id}
                      position={[s.lat, s.lng]}
                      eventHandlers={{ click: () => logBehavior('VENUE_VIEW', { placeId: s.id, name: s.name }) }}
                    >
                      <Popup><strong>{s.name}</strong><br />{s.type} • {s.price}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
