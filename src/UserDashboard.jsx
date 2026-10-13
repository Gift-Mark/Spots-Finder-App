import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './CSS/userDashboard.module.css';
import { getMySavedSpots, getUserProfile, updateUserProfile, toggleSaveSpot, fetchMyBookings } from './api/client';

const socket = io('http://localhost:5000');

const SPOTS_GEO = [
  { id: 1, name: 'Rayfield Resort', lat: 9.8358, lng: 8.9131, type: 'Resort', price: '₦12,500' },
  { id: 2, name: 'Shere Hills Peak', lat: 9.9542, lng: 9.0225, type: 'Scenic', price: '₦3,500' },
  { id: 3, name: 'Jos Wildlife Park', lat: 9.8722, lng: 8.8751, type: 'Nature', price: '₦1,500' },
  { id: 4, name: 'Solomon Lar Leisure Gardens', lat: 9.9051, lng: 8.8912, type: 'Dining', price: 'Free' }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  })();

  // Greeting logic:
  // - Login and Register pass a time-based state.greeting, e.g. "Good morning, Jane"
  // - Direct navigation (no state): compute time-based greeting from current hour
  const heroGreeting = (() => {
    if (location.state?.greeting) return location.state.greeting;
    const firstName = currentUser?.firstName || 'Explorer';
    const hour = new Date().getHours();
    const timeWord = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    return `${timeWord}, ${firstName}`;
  })();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('jos_pulse_token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };
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

  // Saved spots state (shared by 'Saved' and 'MySpots' panels)
  const [savedSpots, setSavedSpots] = useState([]);
  const [savedLoading, setSavedLoading] = useState(false);

  // Bookings state — Overview is the default panel and its bookings fetch runs on
  // mount, so this flag starts true (loading flags are flipped where tab changes originate)
  const [myBookings, setMyBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  // Profile state
  const [profileData, setProfileData] = useState({ firstName: '', lastName: '', email: '', profileImage: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const profileImageInputRef = useRef(null);

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

  // Fetch saved spots when navigating to Saved panel
  // (savedLoading is flipped true by the nav click handler — effects must not set
  // state synchronously; the .finally() below clears it)
  useEffect(() => {
    if (activeNav === 'Saved') {
      getMySavedSpots()
        .then(res => {
          // Backend returns { success, count, data: [...] }
          const spots = res?.data ?? (Array.isArray(res) ? res : []);
          setSavedSpots(spots);
        })
        .catch(() => setSavedSpots([]))
        .finally(() => setSavedLoading(false));
    }
  }, [activeNav]);

  // Fetch bookings when navigating to Bookings panel OR when on Overview (for the passes tab)
  useEffect(() => {
    if (activeNav === 'Bookings' || activeNav === 'Overview') {
      fetchMyBookings()
        .then(res => {
          const bookings = res?.data ?? (Array.isArray(res) ? res : []);
          setMyBookings(bookings);
        })
        .catch(() => setMyBookings([]))
        .finally(() => setBookingsLoading(false));
    }
  }, [activeNav]);

  // Fetch profile when navigating to Profile panel
  useEffect(() => {
    if (activeNav === 'Profile') {
      getUserProfile()
        .then(res => {
          const d = res.data || res;
          setProfileData({
            firstName: d.firstName || '',
            lastName: d.lastName || '',
            email: d.email || '',
            profileImage: d.profileImage || '',
          });
          setProfileImagePreview(d.profileImage || '');
        })
        .catch(() => {})
        .finally(() => setProfileLoading(false));
    }
  }, [activeNav]);

  // Tab switching: flip the target panel's loading flag here (event-driven) instead of
  // synchronously inside the fetch effects; each effect's .finally() clears the flag.
  const changeNav = (nav) => {
    if (nav === activeNav) return;
    if (nav === 'Saved') setSavedLoading(true);
    else if (nav === 'Bookings' || nav === 'Overview') setBookingsLoading(true);
    else if (nav === 'Profile') setProfileLoading(true);
    setActiveNav(nav);
  };

  // Handle local image file selection — creates a preview URL
  const handleProfileImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setProfileImagePreview(objectUrl);
    // Store base64 so it can be sent to the backend
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfileData((prev) => ({ ...prev, profileImage: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

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

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg('');
    try {
      await updateUserProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        profileImage: profileData.profileImage,
      });
      setProfileMsg('Profile updated successfully!');
    } catch (err) {
      setProfileMsg(err.response?.data?.message || err.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.brandGroup}>
          <span className={styles.brandLogo}>🔥 Jos Pulse</span>
          <nav className={styles.topNav}>
            <Link className={styles.active} to="/explore">Explore</Link>
            <Link to="/culture">Culture</Link>
            <Link to="/DiningPage">Restaurants</Link>
            <Link to="/flights">Flights</Link>
            <Link to="/stays">Stays</Link>
            <Link to="/events">Events</Link>
          </nav>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.proBadge}>● PRO MEMBER</span>
          <div className={styles.userInfo}>
            <span className={styles.userAvatar}>
              {profileImagePreview ? (
                <img src={profileImagePreview} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
              ) : '👤'}
            </span>
            <div className={styles.userNameBlock}>
              <strong className={styles.userName}>
                {currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() : 'Explorer'}
              </strong>
              <span className={styles.userRole}>Plateau Explorer</span>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout} type="button">↪ Log Out</button>
        </div>
      </header>

      <div className={styles.mainLayout}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <small className={styles.sidebarLabel}>MAIN CONSOLE</small>
            <button
              className={`${styles.sideBtn} ${activeNav === 'Overview' ? styles.sideBtnActive : ''}`}
              onClick={() => { changeNav('Overview'); logBehavior('FILTER_SELECT', { nav: 'Overview' }); }}
            >
              📊 Overview
            </button>
            <button
              className={`${styles.sideBtn} ${activeNav === 'Bookings' ? styles.sideBtnActive : ''}`}
              onClick={() => { changeNav('Bookings'); logBehavior('FILTER_SELECT', { nav: 'Bookings' }); }}
            >
              🎟️ My Bookings
            </button>
            <button
              className={`${styles.sideBtn} ${activeNav === 'Saved' ? styles.sideBtnActive : ''}`}
              onClick={() => { changeNav('Saved'); logBehavior('FILTER_SELECT', { nav: 'Saved' }); }}
            >
              🔖 Saved Spots
            </button>
            <button
              className={`${styles.sideBtn} ${activeNav === 'Profile' ? styles.sideBtnActive : ''}`}
              onClick={() => { changeNav('Profile'); logBehavior('FILTER_SELECT', { nav: 'Profile' }); }}
            >
              ⚙️ Profile Settings
            </button>
            <button
              className={`${styles.sideBtn} ${activeNav === 'Feed' ? styles.sideBtnActive : ''}`}
              onClick={() => { changeNav('Feed'); logBehavior('FILTER_SELECT', { nav: 'Feed' }); }}
            >
              📡 Live Feed
            </button>
            <button
              className={`${styles.sideBtn} ${activeNav === 'Map' ? styles.sideBtnActive : ''}`}
              onClick={() => { changeNav('Map'); logBehavior('VENUE_VIEW', { nav: 'Map' }); }}
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
            <button
              className={styles.settingsBtn}
              onClick={() => changeNav('Profile')}
            >
              ⚙️ Settings
            </button>
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
                  <h1>{heroGreeting}</h1>
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
                  {activeTab === 'Passes' && (
                    <>
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
                      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 2H10V10H2V2ZM4 4V8H8V4H4ZM14 2H22V10H14V2ZM16 4V8H20V4H16ZM2 14H10V22H2V14ZM4 16V20H8V16H4ZM12 12H14V14H12V12ZM14 14H16V16H14V14ZM16 12H18V14H16V12ZM18 14H20V16H18V14ZM20 12H22V14H20V12ZM12 16H14V18H12V16ZM14 18H16V20H14V18ZM16 16H18V18H16V16ZM18 18H20V20H18V18ZM20 16H22V18H20V16ZM12 20H14V22H12V20ZM16 20H18V22H16V20ZM20 20H22V22H20V20Z" fill="#0f172a"/>
                      </svg>
                    </div>

                    <small className={styles.scanText}>SCAN AT ENTRANCE<br />Gate A • Turnstile #3</small>
                    <button className={styles.presentBtn}>Present Pass on Phone</button>
                  </div>
                    </>
                  )}

                  {activeTab === 'Flights' && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      {bookingsLoading ? (
                        <p className={styles.loadingText}>Loading flight reservations...</p>
                      ) : myBookings.filter(b => b.bookingType === 'Flight Reservation' || (b.provider || '').toLowerCase().includes('flight') || (b.destination || '').toLowerCase().includes('jos')).length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                          <p style={{ color: '#64748b', marginBottom: '1rem' }}>No flight reservations yet.</p>
                          <Link to="/flights" className={styles.primaryDarkBtn} style={{ display: 'inline-block', textDecoration: 'none', padding: '0.65rem 1.5rem' }}>
                            ✈️ Book a Flight to Jos
                          </Link>
                        </div>
                      ) : (
                        <div className={styles.bookingsList}>
                          {myBookings
                            .filter(b => b.bookingType === 'Flight Reservation' || (b.provider || '').toLowerCase().includes('flight') || (b.destination || '').toLowerCase().includes('jos'))
                            .map(booking => (
                              <div key={booking._id} className={styles.bookingItem}>
                                <div className={styles.bookingItemLeft}>
                                  <span className={styles.bookingIcon}>✈️</span>
                                  <div>
                                    <strong className={styles.bookingVenue}>{booking.provider || 'Flight'}</strong>
                                    <p className={styles.bookingMeta}>
                                      📅 {booking.startDate ? new Date(booking.startDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                      {booking.destination ? ` · ${booking.destination}` : ''}
                                    </p>
                                  </div>
                                </div>
                                <div className={styles.bookingItemRight}>
                                  <span className={`${styles.bookingStatus} ${booking.paymentStatus === 'paid' ? styles.bookingStatusPaid : styles.bookingStatusPending}`}>
                                    {booking.paymentStatus === 'paid' ? '✓ Confirmed' : '⏳ Pending'}
                                  </span>
                                  <strong className={styles.bookingAmount}>₦{(booking.amount || 0).toLocaleString()}</strong>
                                  {booking.bookingReference && <small className={styles.bookingRef}>#{booking.bookingReference}</small>}
                                </div>
                              </div>
                            ))
                          }
                          <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                            <Link to="/flights" className={styles.downloadBtn} style={{ textDecoration: 'none' }}>✈️ Book Another Flight</Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>

              {/* BOTTOM CURATIONS CARDS */}
              <section className={styles.trendingSection}>
                <div className={styles.trendingHeader}>
                  <div>
                    <small>PLATEAU CURATIONS</small>
                    <h3>Trending Nearby in Jos</h3>
                  </div>
                  <Link to="/explore" className={styles.viewCatalogLink}>View Full City Catalog ›</Link>
                </div>

                <div className={styles.cards3Grid}>
                  {/* Shere Hills Rock Climbing */}
                  <div
                    className={styles.curationCard}
                    onClick={() => { navigate('/place/shere-hills-rock-climbing'); logBehavior('VENUE_VIEW', { name: 'Shere Hills Rock Climbing' }); }}
                  >
                    <div className={styles.curationImgBox} style={{ backgroundImage: "url('/images/Shere hills hike.jpg')" }}>
                      <span className={styles.curTag}>HIKING & SCENIC</span>
                      <span className={styles.ratingBadge}>★ 4.9 (84)</span>
                    </div>
                    <h4>Shere Hills Rock Climbing & Trail Trek</h4>
                    <p>Plateau State's highest peak at ~6,000ft — granite formations, caves and challenging ridge trails.</p>
                    <div className={styles.cardFooter}>
                      <small>From ₦3,500 / guide</small>
                      <span>→</span>
                    </div>
                  </div>

                  {/* Jos Wildlife Park */}
                  <div
                    className={styles.curationCard}
                    onClick={() => { navigate('/place/jos-wildlife-park'); logBehavior('VENUE_VIEW', { name: 'Jos Wildlife Park' }); }}
                  >
                    <div className={styles.curationImgBox} style={{ backgroundImage: "url('/images/wildlife park.jpg')" }}>
                      <span className={styles.curTag}>NATURE RESERVE</span>
                      <span className={styles.ratingBadge}>★ 4.2 (310)</span>
                    </div>
                    <h4>Jos Wildlife Park</h4>
                    <p>Nigeria's premier nature reserve — vast pine forests, scenic wildlife viewing and habitat conservation.</p>
                    <div className={styles.cardFooter}>
                      <small>From ₦1,500 / entry</small>
                      <span>→</span>
                    </div>
                  </div>

                  {/* Solomon Lar Amusement Park */}
                  <div
                    className={styles.curationCard}
                    onClick={() => { navigate('/place/solomon-lar-amusement-park'); logBehavior('VENUE_VIEW', { name: 'Solomon Lar Amusement Park' }); }}
                  >
                    <div className={styles.curationImgBox} style={{ backgroundImage: "url('/images/solomon lar.jpg')" }}>
                      <span className={styles.curTag}>LEISURE & DINING</span>
                      <span className={styles.ratingBadge}>★ 4.4 (185)</span>
                    </div>
                    <h4>Solomon Lar Amusement Park</h4>
                    <p>Serene urban park with artificial lakes, picnic grounds and family entertainment in Jos South.</p>
                    <div className={styles.cardFooter}>
                      <small>Free Public Access</small>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* MY BOOKINGS PANEL */}
          {activeNav === 'Bookings' && (
            <section className={styles.panelSection}>
              <h2 className={styles.panelTitle}>🎟️ My Bookings</h2>
              {bookingsLoading ? (
                <p className={styles.loadingText}>Loading your bookings...</p>
              ) : myBookings.length === 0 ? (
                <p className={styles.emptyText}>No bookings yet. Reserve a pass from any spot's detail page.</p>
              ) : (
                <div className={styles.bookingsList}>
                  {myBookings.map((booking) => (
                    <div key={booking._id} className={styles.bookingItem}>
                      <div className={styles.bookingItemLeft}>
                        <span className={styles.bookingIcon}>🎫</span>
                        <div>
                          <strong className={styles.bookingVenue}>{booking.provider || booking.destination || 'Venue'}</strong>
                          <p className={styles.bookingMeta}>
                            📅 {booking.startDate ? new Date(booking.startDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                            {booking.bookingType ? ` · ${booking.bookingType}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className={styles.bookingItemRight}>
                        <span className={`${styles.bookingStatus} ${booking.paymentStatus === 'paid' ? styles.bookingStatusPaid : styles.bookingStatusPending}`}>
                          {booking.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Pending'}
                        </span>
                        <strong className={styles.bookingAmount}>
                          {booking.amount === 0 ? 'Free' : `₦${(booking.amount || 0).toLocaleString()}`}
                        </strong>
                        {booking.bookingReference && (
                          <small className={styles.bookingRef}>#{booking.bookingReference}</small>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
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

          {/* SAVED SPOTS PANEL */}
          {activeNav === 'Saved' && (
            <section className={styles.panelSection}>
              <h2 className={styles.panelTitle}>🔖 Saved Spots</h2>
              {savedLoading ? (
                <p className={styles.loadingText}>Loading your saved spots...</p>
              ) : savedSpots.length === 0 ? (
                <p className={styles.emptyText}>No saved spots yet. Tap the 🤍 on any place to save it here.</p>
              ) : (
                <div className={styles.savedGrid}>
                  {savedSpots.map((spot) => {
                    const spotId = spot._id || spot.id;
                    // Place model uses heroImage / coverImage / images[] — no plain "image" field
                    const imgSrc =
                      spot.heroImage ||
                      spot.coverImage ||
                      (Array.isArray(spot.images) && spot.images[0]) ||
                      (Array.isArray(spot.gallery) && spot.gallery[0]) ||
                      spot.image ||
                      null;
                    const displayTitle = spot.title || spot.name || 'Untitled Spot';
                    const displaySub = Array.isArray(spot.category)
                      ? spot.category[0]
                      : (spot.category || spot.location || '');
                    return (
                      <div key={spotId} className={styles.savedCard}>
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={displayTitle}
                            className={styles.savedCardImg}
                          />
                        ) : (
                          <div className={styles.savedCardImgPlaceholder}>📍</div>
                        )}
                        <div className={styles.savedCardOverlay} />
                        <div className={styles.savedCardBody}>
                          <span className={styles.savedCardTitle}>{displayTitle}</span>
                          {displaySub && (
                            <span className={styles.savedCardCategory}>{displaySub}</span>
                          )}
                        </div>
                        <button
                          type="button"
                          className={styles.savedCardRemoveBtn}
                          aria-label="Remove from saved"
                          title="Remove from saved"
                          onClick={() =>
                            toggleSaveSpot(spotId)
                              .then(() => setSavedSpots((prev) => prev.filter((s) => (s._id || s.id) !== spotId)))
                              .catch(() => {})
                          }
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* PROFILE SETTINGS PANEL */}
          {activeNav === 'Profile' && (
            <section className={styles.panelSection}>
              <h2 className={styles.panelTitle}>⚙️ Profile Settings</h2>
              {profileLoading ? (
                <p className={styles.loadingText}>Loading...</p>
              ) : (
                <form onSubmit={handleProfileSave} className={styles.profileForm}>

                  {/* Avatar upload */}
                  <div className={styles.profileAvatarRow}>
                    <div className={styles.profileAvatarWrap}>
                      {profileImagePreview ? (
                        <img src={profileImagePreview} alt="Profile" className={styles.profileAvatarImg} />
                      ) : (
                        <div className={styles.profileAvatarPlaceholder}>👤</div>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        ref={profileImageInputRef}
                        style={{ display: 'none' }}
                        onChange={handleProfileImageFile}
                      />
                      <button
                        type="button"
                        className={styles.uploadAvatarBtn}
                        onClick={() => profileImageInputRef.current?.click()}
                      >
                        📷 Upload Photo
                      </button>
                      <p className={styles.avatarHint}>JPG, PNG or WEBP · Max 5MB</p>
                    </div>
                  </div>

                  <div className={styles.profileField}>
                    <label className={styles.profileLabel}>First Name</label>
                    <input
                      type="text"
                      className={styles.profileInput}
                      value={profileData.firstName}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, firstName: e.target.value }))}
                      placeholder="First name"
                    />
                  </div>

                  <div className={styles.profileField}>
                    <label className={styles.profileLabel}>Last Name</label>
                    <input
                      type="text"
                      className={styles.profileInput}
                      value={profileData.lastName}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Last name"
                    />
                  </div>

                  <div className={styles.profileField}>
                    <label className={styles.profileLabel}>Email</label>
                    <input
                      type="email"
                      className={styles.profileInput}
                      value={profileData.email}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="Email address"
                    />
                  </div>

                  {profileMsg && (
                    <p className={profileMsg.toLowerCase().includes('success') ? styles.profileMsgSuccess : styles.profileMsgError}>
                      {profileMsg}
                    </p>
                  )}

                  <button type="submit" disabled={profileSaving} className={styles.primaryDarkBtn}>
                    {profileSaving ? 'Saving...' : 'Save Profile'}
                  </button>
                </form>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
