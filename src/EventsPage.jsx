import { useState, useEffect, useCallback } from 'react';
import Header from './Components/headerNav';
import Footer from './Components/Footer';

// Fallback Plateau State Events (used if database is empty)
const REAL_WORLD_FALLBACKS = [
  {
    _id: "evt-rayfield-golf",
    title: "Rayfield Annual Classic Tournament",
    category: "Golf & Sports",
    tagColor: "#0284C7",
    dateText: "This Saturday, 7:00 AM",
    location: "Rayfield Golf Club",
    ticketPrice: 10000,
    vipPrice: 35000,
    image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80",
    description: "Annual regional amateur golf championship hosted at Africa's oldest golf club in Rayfield.",
    scoutCityUrl: "https://chat.whatsapp.com/scoutcity-rayfield-golf"
  },
  {
    _id: "evt-heritage-dinner",
    title: "Plateau Culinary Heritage Dinner",
    category: "Dining",
    tagColor: "#D97706",
    dateText: "Next Friday, 6:30 PM",
    location: "The View Restaurant",
    ticketPrice: 15000,
    vipPrice: 40000,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    description: "An extraordinary multi-course culinary showcase celebrating authentic Plateau food traditions.",
    scoutCityUrl: ""
  },
  {
    _id: "evt-wase-rock-trek",
    title: "Wase Rock Expedition Challenge",
    category: "Adventure",
    tagColor: "#2563EB",
    dateText: "Dec 5, 8:00 AM",
    location: "Wase Town Basecamp",
    ticketPrice: 5000,
    vipPrice: 15000,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    description: "Guided eco-adventure mountain hike to the famous volcanic dome monolith in Wase.",
    scoutCityUrl: "https://chat.whatsapp.com/scoutcity-wase-trek"
  }
];

const PROMOTED_FALLBACK = {
  _id: "evt-hero-plateau-rhythm",
  title: "Plateau Rhythm & Roots Festival 2026",
  category: "MUSIC & ARTS",
  dateRange: "NOV 12 - 14",
  description: "Experience three days of electrifying performances, local artisanal markets, and traditional culinary showcases set against the breathtaking backdrop of Plateau State.",
  location: "Shere Hills Arena, Jos",
  ticketPrice: 5000,
  vipPrice: 25000,
  image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
  scoutCityUrl: "https://chat.whatsapp.com/scoutcity-plateau-rhythm-2026"
};

export default function RealWorldEventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Events");
  const [timeFilter, setTimeFilter] = useState("Upcoming Week");
  
  const [promotedEvent, setPromotedEvent] = useState(PROMOTED_FALLBACK);
  const [eventsList, setEventsList] = useState(REAL_WORLD_FALLBACKS);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [activeModalEvent, setActiveModalEvent] = useState(null);
  const [ticketTier, setTicketTier] = useState('regular');
  const [ticketQty, setTicketQty] = useState(1);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });

  const categories = [
    { name: "All Events", icon: "" },
    { name: "Music & Festivals", icon: "🎵" },
    { name: "Golf & Sports", icon: "⛳" },
    { name: "Traditional", icon: "🏛️" },
    { name: "Dining", icon: "🍽️" }
  ];

  // Helper to format DB dates to UI strings
  const formatEventDate = (dateStr) => {
    if (!dateStr) return "Upcoming";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // --- FETCH REAL EVENTS FROM BACKEND ---
  const loadEventsFromAPI = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams();
      if (selectedCategory !== "All Events") {
        queryParams.append("category", selectedCategory);
      }
      
      const res = await fetch(`http://localhost:5000/api/v1/events?${queryParams.toString()}`);
      const result = await res.json();

      if (result?.success && Array.isArray(result.data) && result.data.length > 0) {
        const mapped = result.data.map(item => ({
          _id: item._id,
          title: item.title,
          category: item.category || "General",
          dateText: `${formatEventDate(item.eventDate)} • ${item.startTime || ''}`,
          location: item.placeId?.name || item.organizer || "Jos, Plateau",
          ticketPrice: item.ticketPrice || 0,
          vipPrice: (item.ticketPrice || 0) * 2.5 || 15000,
          image: item.image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
          description: item.description,
          scoutCityUrl: item.scoutCityUrl || "",
          isPromoted: item.status === 'upcoming'
        }));

        const hero = mapped.find(e => e.isPromoted) || mapped[0];
        const gridItems = mapped.filter(e => e._id !== hero._id);

        setPromotedEvent({
          ...hero,
          dateRange: "UPCOMING SEASON",
          location: hero.location
        });

        if (gridItems.length > 0) {
          setEventsList(gridItems);
        }
      }
    } catch (err) {
      console.error("Failed to load live events, displaying Plateau fallbacks:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    let isMounted = true;

    const initFetch = async () => {
      setLoading(true);
      await loadEventsFromAPI();
      if (!isMounted) return;
    };

    initFetch();

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, loadEventsFromAPI]);

  const handleOpenTicketModal = (evt) => {
    setActiveModalEvent(evt);
    setTicketTier('regular');
    setTicketQty(1);
    setCheckoutStep(1);
  };

  const handleCompleteBooking = (e) => {
    e.preventDefault();
    if (!userData.email || !userData.name) return;
    setCheckoutStep(3);
  };

  const currentUnitPrice = activeModalEvent 
    ? (ticketTier === 'vip' ? activeModalEvent.vipPrice : activeModalEvent.ticketPrice) 
    : 0;

  return (
    <div style={styles.pageWrapper}>
      {/* HEADER NAV */}
      <Header />

      {/* HERO SECTION */}
      <header style={styles.heroSection}>
        <div style={styles.heroContent}>
          <div>
            <h1 style={styles.heroTitle}>Discover the Pulse</h1>
            <p style={styles.heroSubtitle}>
              Explore upcoming festivals, premier golf tournaments, and vibrant dining events across the rugged beauty of Plateau State.
            </p>
          </div>

          <div style={styles.timeDropdownWrapper}>
            <select 
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value)} 
              style={styles.timeDropdown}
            >
              <option>Upcoming Week</option>
              <option>This Weekend</option>
              <option>This Month</option>
            </select>
          </div>
        </div>

        {/* CATEGORY PILLS */}
        <div style={styles.filterPillsRow}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                style={{
                  ...styles.pillBtn,
                  ...(isSelected ? styles.activePillBtn : styles.inactivePillBtn)
                }}
                onClick={() => setSelectedCategory(cat.name)}
              >
                {cat.icon && <span style={{ marginRight: '6px' }}>{cat.icon}</span>}
                {cat.name}
              </button>
            );
          })}
        </div>
      </header>

      <main style={styles.mainContent}>
        {/* PROMOTED HERO CARD */}
        {promotedEvent && (
          <section style={styles.promotedCard}>
            <div style={styles.promotedImageCol}>
              <img 
                src={promotedEvent.image} 
                alt={promotedEvent.title} 
                style={styles.promotedImg} 
              />
            </div>

            <div style={styles.promotedDetailsCol}>
              <span style={styles.promotedBadge}>☆ Promoted</span>
              <div style={styles.promotedMetaHeader}>
                {promotedEvent.dateRange || "NOV 12 - 14"} • {promotedEvent.category?.toUpperCase()}
              </div>

              <h2 style={styles.promotedTitle}>{promotedEvent.title}</h2>
              <p style={styles.promotedDescription}>{promotedEvent.description}</p>

              <div style={styles.promotedLocationRow}>
                <span>📍 {promotedEvent.location}</span>
                <span style={{ margin: '0 8px' }}>•</span>
                <span>🎫 Tickets from {promotedEvent.ticketPrice === 0 ? "Free" : `₦${promotedEvent.ticketPrice?.toLocaleString()}`}</span>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button 
                  style={styles.btnGetTickets} 
                  onClick={() => handleOpenTicketModal(promotedEvent)}
                >
                  Get Tickets →
                </button>

                {promotedEvent.scoutCityUrl && (
                  <a 
                    href={promotedEvent.scoutCityUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={styles.scoutCityBadge}
                  >
                    💬 View on ScoutCity (WhatsApp)
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        {/* EVENTS GRID */}
        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>Loading upcoming Plateau events...</p>
        ) : (
          <section style={styles.eventsGrid}>
            {eventsList.map((evt) => (
              <div key={evt._id} style={styles.eventCard}>
                <div style={styles.cardImageContainer}>
                  <img src={evt.image} alt={evt.title} style={styles.cardImg} />
                  <span style={styles.cardCategoryTag}>
                    {evt.category}
                  </span>
                </div>

                <div style={styles.cardContent}>
                  <span style={styles.cardDate}>{evt.dateText}</span>
                  <h3 style={styles.cardTitle}>{evt.title}</h3>
                  <p style={styles.cardLocation}>📍 {evt.location}</p>

                  {/* ScoutCity WhatsApp Community Button for Grid Cards */}
                  {evt.scoutCityUrl && (
                    <a 
                      href={evt.scoutCityUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ ...styles.scoutCityBadge, marginTop: '12px', width: 'fit-content' }}
                    >
                      💬 ScoutCity WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* LOAD MORE BUTTON */}
        <div style={{ textAlign: 'center', margin: '40px 0 60px' }}>
          <button style={styles.btnLoadMore} onClick={loadEventsFromAPI}>
            Load More Events ∨
          </button>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />

      {/* TICKETING / CHECKOUT MODAL */}
      {activeModalEvent && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <button style={styles.btnClose} onClick={() => setActiveModalEvent(null)}>✕</button>

            {checkoutStep !== 3 ? (
              <div>
                <span style={{ fontSize: '12px', color: '#F97316', fontWeight: 'bold' }}>Step {checkoutStep} of 2</span>
                <h3 style={{ margin: '8px 0 4px', fontSize: '18px' }}>{activeModalEvent.title}</h3>
                <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#64748B' }}>📍 {activeModalEvent.location}</p>

                {checkoutStep === 1 && (
                  <div>
                    <label style={styles.modalLabel}>Select Ticket Tier</label>
                    <div style={styles.tierGrid}>
                      <div 
                        style={{ ...styles.tierBox, ...(ticketTier === 'regular' ? styles.tierBoxActive : {}) }}
                        onClick={() => setTicketTier('regular')}
                      >
                        <strong>Standard Access</strong>
                        <span style={{ color: '#F97316', fontWeight: 'bold' }}>
                          {activeModalEvent.ticketPrice === 0 ? 'Free Entry' : `₦${activeModalEvent.ticketPrice?.toLocaleString()}`}
                        </span>
                      </div>

                      <div 
                        style={{ ...styles.tierBox, ...(ticketTier === 'vip' ? styles.tierBoxActive : {}) }}
                        onClick={() => setTicketTier('vip')}
                      >
                        <strong>VIP / Table Service</strong>
                        <span style={{ color: '#F97316', fontWeight: 'bold' }}>
                          ₦{activeModalEvent.vipPrice?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div style={{ margin: '16px 0' }}>
                      <label style={styles.modalLabel}>Quantity</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button style={styles.qtyBtn} onClick={() => setTicketQty(Math.max(1, ticketQty - 1))}>-</button>
                        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{ticketQty}</span>
                        <button style={styles.qtyBtn} onClick={() => setTicketQty(ticketQty + 1)}>+</button>
                      </div>
                    </div>

                    <div style={styles.modalTotalRow}>
                      <span>Total Amount:</span>
                      <strong style={{ fontSize: '20px', color: '#F97316' }}>
                        ₦{(currentUnitPrice * ticketQty).toLocaleString()}
                      </strong>
                    </div>

                    <button style={{ ...styles.btnGetTickets, width: '100%', marginTop: '16px' }} onClick={() => setCheckoutStep(2)}>
                      Proceed to Attendee Info ↗
                    </button>
                  </div>
                )}

                {checkoutStep === 2 && (
                  <form onSubmit={handleCompleteBooking}>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={styles.modalLabel}>Full Name</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. Musa Yakubu" 
                        style={styles.modalInput}
                        value={userData.name}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={styles.modalLabel}>Email Address</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="musa@example.com" 
                        style={styles.modalInput}
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={styles.modalLabel}>Phone Number</label>
                      <input 
                        type="tel" 
                        required 
                        placeholder="+234 803 000 0000" 
                        style={styles.modalInput}
                        value={userData.phone}
                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                      />
                    </div>

                    <button type="submit" style={{ ...styles.btnGetTickets, width: '100%' }}>
                      Generate QR Voucher 🔒
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '36px' }}>🎟️</div>
                <h3 style={{ color: '#16A34A', margin: '4px 0 8px' }}>E-Ticket Generated!</h3>
                <p style={{ fontSize: '12px', color: '#64748B' }}>
                  Confirmation sent to <strong>{userData.email}</strong>. Present this code at entry.
                </p>

                <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', margin: '16px 0' }}>
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=JOS-PULSE-${activeModalEvent._id}-${userData.email}`} 
                    alt="Official Event Pass QR Code" 
                    style={{ width: '140px', height: '140px' }}
                  />
                  <h4 style={{ margin: '8px 0 2px', fontSize: '15px' }}>{activeModalEvent.title}</h4>
                  <span style={{ fontSize: '12px', color: '#F97316', fontWeight: 'bold' }}>
                    {ticketTier.toUpperCase()} TIER ({ticketQty} Pass)
                  </span>
                </div>

                <button style={{ ...styles.btnGetTickets, width: '100%' }} onClick={() => setActiveModalEvent(null)}>
                  Close Pass Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// INLINE STYLES MATCHING THE EXACT MOCKUP
const styles = {
  pageWrapper: {
    backgroundColor: '#F9FAFB',
    minHeight: '100vh',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    color: '#0F172A'
  },
  heroSection: { maxWidth: '1200px', margin: '40px auto 20px', padding: '0 24px' },
  heroContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '28px' },
  heroTitle: { fontSize: '42px', fontWeight: '800', margin: '0 0 10px', color: '#0F172A', letterSpacing: '-0.5px' },
  heroSubtitle: { color: '#64748B', maxWidth: '580px', margin: 0, lineHeight: '1.5', fontSize: '15px' },
  timeDropdownWrapper: { minWidth: '160px' },
  timeDropdown: { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', fontSize: '14px', color: '#374151', cursor: 'pointer' },
  
  filterPillsRow: { display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' },
  pillBtn: { padding: '8px 18px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', transition: 'all 0.2s ease' },
  activePillBtn: { backgroundColor: '#111827', color: '#FFFFFF' },
  inactivePillBtn: { backgroundColor: '#F3F4F6', color: '#4B5563' },
  
  mainContent: { maxWidth: '1200px', margin: '0 auto', padding: '0 24px' },
  
  // HERO PROMOTED CARD
  promotedCard: { display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '32px', backgroundColor: '#FFFFFF', border: '1.5px solid #F97316', borderRadius: '16px', overflow: 'hidden', margin: '24px 0 40px', boxShadow: '0 4px 12px rgba(249, 115, 22, 0.08)' },
  promotedImageCol: { minHeight: '340px' },
  promotedImg: { width: '100%', height: '100%', objectFit: 'cover' },
  promotedDetailsCol: { padding: '32px 32px 32px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  promotedBadge: { display: 'inline-block', backgroundColor: '#F97316', color: '#FFFFFF', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', width: 'fit-content', marginBottom: '16px' },
  promotedMetaHeader: { fontSize: '12px', fontWeight: 'bold', color: '#C2410C', letterSpacing: '0.5px', marginBottom: '8px', textTransform: 'uppercase' },
  promotedTitle: { fontSize: '26px', fontWeight: '800', margin: '0 0 12px', color: '#0F172A', lineHeight: '1.2' },
  promotedDescription: { color: '#64748B', fontSize: '14px', lineHeight: '1.6', margin: '0 0 20px' },
  promotedLocationRow: { fontSize: '13px', color: '#475569', marginBottom: '24px', display: 'flex', alignItems: 'center', flexWrap: 'wrap' },
  btnGetTickets: { backgroundColor: '#F97316', color: '#FFFFFF', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', width: 'fit-content' },
  scoutCityBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#25D366', color: '#FFFFFF', padding: '11px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none' },
  
  // GRID CARDS
  eventsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' },
  eventCard: { backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  cardImageContainer: { position: 'relative', height: '210px' },
  cardImg: { width: '100%', height: '100%', objectFit: 'cover' },
  cardCategoryTag: { position: 'absolute', top: '12px', left: '12px', backgroundColor: '#1D4ED8', color: '#FFFFFF', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' },
  cardContent: { padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 },
  cardDate: { fontSize: '12px', color: '#DC2626', fontWeight: 'bold', marginBottom: '6px' },
  cardTitle: { fontSize: '18px', fontWeight: '700', margin: '0 0 8px', color: '#0F172A', lineHeight: '1.3' },
  cardLocation: { fontSize: '13px', color: '#64748B', margin: 0 },
  
  btnLoadMore: { backgroundColor: '#FFFFFF', border: '1px solid #111827', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', color: '#111827' },
  
  
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '28px', width: '100%', maxWidth: '420px', position: 'relative' },
  btnClose: { position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' },
  modalLabel: { display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' },
  tierGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' },
  tierBox: { border: '1px solid #CBD5E1', borderRadius: '8px', padding: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' },
  tierBoxActive: { borderColor: '#F97316', backgroundColor: '#FFF7ED' },
  qtyBtn: { width: '32px', height: '32px', border: '1px solid #CBD5E1', borderRadius: '6px', backgroundColor: '#F1F5F9', cursor: 'pointer', fontWeight: 'bold' },
  modalTotalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', marginTop: '16px' },
  modalInput: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }
};