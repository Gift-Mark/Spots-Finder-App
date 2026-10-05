import { useState } from 'react';
import Header from './Components/headerNav';

// Real-world Plateau State Events & Landmarks Data
const FEATURED_EVENT = {
  id: "evt-hero-plateau-carnival",
  title: "Plateau Cultural & Christmas Carnival 2026",
  category: "MUSIC & ARTS",
  dateRange: "DEC 20 - 26",
  description: "Experience Plateau State's premier annual cultural extravaganza featuring over 50 ethnic troupe performances, live music concerts, artisanal street markets, and culinary showcases at the Jos Peace Haven.",
  location: "Jos Township Stadium & Crest Hotel Grounds, Jos",
  ticketPrice: "₦2,000",
  rawPrice: 2000,
  vipPrice: 15000,
  image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
  promoted: true
};

const INITIAL_EVENTS = [
  {
    id: "evt-rayfield-golf",
    title: "Rayfield Open Amateur Golf Championship",
    category: "Golf & Sports",
    tagColor: "#0284C7",
    dateText: "Sat, Nov 14 • 7:00 AM",
    location: "Rayfield Golf Club (1892), Jos",
    price: "₦10,000",
    rawPrice: 10000,
    vipPrice: 35000,
    image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "evt-heritage-dinner",
    title: "Grand Plateau Heritage & Culinary Festival",
    category: "Dining",
    tagColor: "#D97706",
    dateText: "Fri, Nov 27 • 6:30 PM",
    location: "Crispan Hotel & Event Center, Rayfield",
    price: "₦15,000",
    rawPrice: 15000,
    vipPrice: 40000,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "evt-shere-hills-trek",
    title: "Shere Hills Annual Peak Expedition & Campfire",
    category: "Outdoor & Adventure",
    tagColor: "#2563EB",
    dateText: "Sat, Dec 05 • 6:00 AM",
    location: "Shere Hills Basecamp, Liberty Dam Road",
    price: "₦5,000",
    rawPrice: 5000,
    vipPrice: 15000,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
  }
];

const MORE_EVENTS = [
  {
    id: "evt-jos-trade-fair",
    title: "Jos International Trade & Food Expo 2026",
    category: "Traditional",
    tagColor: "#059669",
    dateText: "Dec 10 - 18 • 9:00 AM",
    location: "Jos Polo Ground, Park Avenue",
    price: "Free Entry",
    rawPrice: 0,
    vipPrice: 5000,
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "evt-kruiseyard-jazz",
    title: "Kruiseyard VIP Acoustic & Jazz Night",
    category: "Music & Festivals",
    tagColor: "#7C3AED",
    dateText: "Fri, Dec 18 • 8:00 PM",
    location: "Kruiseyard Lounge, Rayfield, Jos",
    price: "₦5,000",
    rawPrice: 5000,
    vipPrice: 20000,
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80"
  }
];

export default function RealWorldEventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Events");
  const [timeFilter, setTimeFilter] = useState("Upcoming Month");
  const [eventsList, setEventsList] = useState(INITIAL_EVENTS);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);
  
  // Modal State
  const [activeModalEvent, setActiveModalEvent] = useState(null);
  const [ticketTier, setTicketTier] = useState('regular');
  const [ticketQty, setTicketQty] = useState(1);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });

  const categories = [
    "All Events",
    "🎵 Music & Festivals",
    "⛳ Golf & Sports",
    "🏛️ Traditional",
    "🍽️ Dining"
  ];

  const handleLoadMore = () => {
    setEventsList([...eventsList, ...MORE_EVENTS]);
    setHasLoadedMore(true);
  };

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
    ? (ticketTier === 'vip' ? activeModalEvent.vipPrice : activeModalEvent.rawPrice) 
    : 0;

  return (
    <div style={styles.pageWrapper}>
      {/* NAVIGATION HEADER */}
      <Header />

      {/* HERO SECTION */}
      <header style={styles.heroSection}>
        <div style={styles.heroContent}>
          <div>
            <h1 style={styles.heroTitle}>Discover the Pulse</h1>
            <p style={styles.heroSubtitle}>
              Explore upcoming festivals, premier golf tournaments at Rayfield, hiking challenges at Shere Hills, and vibrant dining events across Plateau State.
            </p>
          </div>

          <div style={styles.timeDropdownWrapper}>
            <select 
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value)} 
              style={styles.timeDropdown}
            >
              <option>Upcoming Month</option>
              <option>This Weekend</option>
              <option>Q4 2026 Festival Season</option>
            </select>
          </div>
        </div>

        {/* PILLS FILTER */}
        <div style={styles.filterPillsRow}>
          {categories.map((cat) => (
            <button
              key={cat}
              style={{
                ...styles.pillBtn,
                ...(selectedCategory === cat ? styles.activePillBtn : {})
              }}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main style={styles.mainContent}>
        {/* PROMOTED HERO CARD */}
        <section style={styles.promotedCard}>
          <div style={styles.promotedImageCol}>
            <img 
              src={FEATURED_EVENT.image} 
              alt={FEATURED_EVENT.title} 
              style={styles.promotedImg} 
            />
          </div>

          <div style={styles.promotedDetailsCol}>
            <span style={styles.promotedBadge}>⭐ Featured Festival</span>
            <div style={styles.promotedMetaHeader}>
              {FEATURED_EVENT.dateRange} • {FEATURED_EVENT.category}
            </div>

            <h2 style={styles.promotedTitle}>{FEATURED_EVENT.title}</h2>
            <p style={styles.promotedDescription}>{FEATURED_EVENT.description}</p>

            <div style={styles.promotedLocationRow}>
              <span>📍 {FEATURED_EVENT.location}</span>
              <span style={{ margin: '0 8px' }}>•</span>
              <span>🎫 Passes from {FEATURED_EVENT.ticketPrice}</span>
            </div>

            <button 
              style={styles.btnGetTickets} 
              onClick={() => handleOpenTicketModal(FEATURED_EVENT)}
            >
              Get Tickets →
            </button>
          </div>
        </section>

        {/* EVENTS GRID */}
        <section style={styles.eventsGrid}>
          {eventsList.map((evt) => (
            <div key={evt.id} style={styles.eventCard}>
              <div style={styles.cardImageContainer}>
                <img src={evt.image} alt={evt.title} style={styles.cardImg} />
                <span style={{ ...styles.cardCategoryTag, backgroundColor: evt.tagColor }}>
                  {evt.category}
                </span>
              </div>

              <div style={styles.cardContent}>
                <span style={styles.cardDate}>{evt.dateText}</span>
                <h3 style={styles.cardTitle}>{evt.title}</h3>
                <p style={styles.cardLocation}>📍 {evt.location}</p>

                <div style={styles.cardFooter}>
                  <span style={styles.cardPrice}>{evt.price}</span>
                  <button 
                    style={styles.cardBtn} 
                    onClick={() => handleOpenTicketModal(evt)}
                  >
                    Get Pass ↗
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* LOAD MORE BUTTON */}
        {!hasLoadedMore && (
          <div style={{ textAlign: 'center', margin: '40px 0 60px' }}>
            <button style={styles.btnLoadMore} onClick={handleLoadMore}>
              Load More Real Events ∨
            </button>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <div style={styles.footerBrandCol}>
            <h3 style={styles.footerBrand}>Jos Pulse</h3>
            <p style={styles.footerCopy}>
              © 2026 Jos Pulse. The Official Culture & Tourism Hub of Plateau State, Nigeria.
            </p>
          </div>

          <div style={styles.footerLinkCol}>
            <h4 style={styles.footerHeading}>Explore</h4>
            <a href="#guides" style={styles.footerLink}>Local Guides</a>
            <a href="#ticketing" style={styles.footerLink}>Event Ticketing</a>
          </div>

          <div style={styles.footerLinkCol}>
            <h4 style={styles.footerHeading}>Partners</h4>
            <a href="#claim" style={styles.footerLink}>Claim Your Venue</a>
          </div>

          <div style={styles.footerLinkCol}>
            <h4 style={styles.footerHeading}>Legal & Support</h4>
            <a href="#privacy" style={styles.footerLink}>Privacy Policy</a>
            <a href="#terms" style={styles.footerLink}>Terms of Service</a>
            <a href="#contact" style={styles.footerLink}>Contact Support</a>
          </div>
        </div>
      </footer>

      {/* CHECKOUT MODAL */}
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
                    <label style={styles.modalLabel}>Select Ticket Category</label>
                    <div style={styles.tierGrid}>
                      <div 
                        style={{ ...styles.tierBox, ...(ticketTier === 'regular' ? styles.tierBoxActive : {}) }}
                        onClick={() => setTicketTier('regular')}
                      >
                        <strong>Standard Access</strong>
                        <span style={{ color: '#F97316', fontWeight: 'bold' }}>
                          {activeModalEvent.rawPrice === 0 ? 'Free Entry' : `₦${activeModalEvent.rawPrice.toLocaleString()}`}
                        </span>
                      </div>

                      <div 
                        style={{ ...styles.tierBox, ...(ticketTier === 'vip' ? styles.tierBoxActive : {}) }}
                        onClick={() => setTicketTier('vip')}
                      >
                        <strong>VIP / Table Service</strong>
                        <span style={{ color: '#F97316', fontWeight: 'bold' }}>
                          ₦{activeModalEvent.vipPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div style={{ margin: '16px 0' }}>
                      <label style={styles.modalLabel}>Number of Tickets</label>
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
                      <label style={styles.modalLabel}>Email Address (For Electronic Pass)</label>
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
                      <label style={styles.modalLabel}>Phone Number (WhatsApp Voucher Backup)</label>
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
                      Pay & Get QR Voucher 🔒
                    </button>
                  </form>
                )}
              </div>
            ) : (
              /* REAL-WORLD QR VOUCHER GENERATION */
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '36px' }}>🎟️</div>
                <h3 style={{ color: '#16A34A', margin: '4px 0 8px' }}>E-Ticket Generated!</h3>
                <p style={{ fontSize: '12px', color: '#64748B' }}>
                  Confirmation sent to <strong>{userData.email}</strong>. Present this code at the gate.
                </p>

                <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', margin: '16px 0' }}>
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=JOS-PULSE-${activeModalEvent.id}-${userData.email}`} 
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

// INLINE STYLES MATCHING THE JOS PULSE DESIGN SYSTEM
const styles = {
  pageWrapper: {
    backgroundColor: '#FAFAFA',
    minHeight: '100vh',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    color: '#0F172A'
  },
  navbar: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E2E8F0',
    padding: '16px 24px',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: { fontSize: '22px', fontWeight: 'bold', color: '#0F172A' },
  navLinks: { display: 'flex', gap: '24px' },
  navLink: { textDecoration: 'none', color: '#64748B', fontSize: '14px', fontWeight: '500' },
  activeNavLink: { color: '#0F172A', fontWeight: 'bold', borderBottom: '2px solid #F97316', paddingBottom: '4px' },
  authButtons: { display: 'flex', gap: '12px' },
  btnSignIn: { background: 'none', border: '1px solid #CBD5E1', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  btnJoin: { backgroundColor: '#F97316', color: '#FFFFFF', border: 'none', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
  heroSection: { maxWidth: '1200px', margin: '40px auto 20px', padding: '0 24px' },
  heroContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '28px' },
  heroTitle: { fontSize: '36px', fontWeight: '800', margin: '0 0 10px', color: '#0F172A' },
  heroSubtitle: { color: '#64748B', maxWidth: '600px', margin: 0, lineHeight: '1.5', fontSize: '15px' },
  timeDropdownWrapper: { minWidth: '160px' },
  timeDropdown: { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', fontSize: '14px' },
  filterPillsRow: { display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' },
  pillBtn: { padding: '8px 18px', borderRadius: '20px', border: 'none', backgroundColor: '#E2E8F0', color: '#475569', cursor: 'pointer', fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap' },
  activePillBtn: { backgroundColor: '#0F172A', color: '#FFFFFF', fontWeight: 'bold' },
  mainContent: { maxWidth: '1200px', margin: '0 auto', padding: '0 24px' },
  promotedCard: { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', backgroundColor: '#FFFFFF', border: '2px solid #F97316', borderRadius: '16px', overflow: 'hidden', margin: '32px 0 48px', boxShadow: '0 10px 25px -5px rgba(249, 115, 22, 0.1)' },
  promotedImageCol: { minHeight: '320px' },
  promotedImg: { width: '100%', height: '100%', objectFit: 'cover' },
  promotedDetailsCol: { padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  promotedBadge: { display: 'inline-block', backgroundColor: '#FFF7ED', color: '#C2410C', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', width: 'fit-content', marginBottom: '12px' },
  promotedMetaHeader: { fontSize: '12px', fontWeight: 'bold', color: '#F97316', letterSpacing: '0.5px', marginBottom: '8px' },
  promotedTitle: { fontSize: '24px', fontWeight: 'bold', margin: '0 0 12px', color: '#0F172A' },
  promotedDescription: { color: '#64748B', fontSize: '14px', lineHeight: '1.6', margin: '0 0 20px' },
  promotedLocationRow: { fontSize: '13px', color: '#475569', marginBottom: '24px', display: 'flex', alignItems: 'center', flexWrap: 'wrap' },
  btnGetTickets: { backgroundColor: '#F97316', color: '#FFFFFF', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', width: 'fit-content' },
  eventsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' },
  eventCard: { backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  cardImageContainer: { position: 'relative', height: '200px' },
  cardImg: { width: '100%', height: '100%', objectFit: 'cover' },
  cardCategoryTag: { position: 'absolute', top: '12px', left: '12px', color: '#FFFFFF', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' },
  cardContent: { padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 },
  cardDate: { fontSize: '12px', color: '#F97316', fontWeight: 'bold', marginBottom: '6px' },
  cardTitle: { fontSize: '17px', fontWeight: 'bold', margin: '0 0 6px', color: '#0F172A' },
  cardLocation: { fontSize: '13px', color: '#64748B', margin: '0 0 20px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #F1F5F9' },
  cardPrice: { fontSize: '16px', fontWeight: 'bold', color: '#0F172A' },
  cardBtn: { backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', padding: '8px 14px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', color: '#0F172A' },
  btnLoadMore: { backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', padding: '12px 28px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', color: '#0F172A' },
  footer: { backgroundColor: '#0F172A', color: '#FFFFFF', padding: '60px 24px 40px', marginTop: '60px' },
  footerContainer: { maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px' },
  footerBrandCol: { paddingRight: '20px' },
  footerBrand: { fontSize: '22px', fontWeight: 'bold', color: '#F97316', margin: '0 0 12px' },
  footerCopy: { color: '#94A3B8', fontSize: '13px', lineHeight: '1.5' },
  footerLinkCol: { display: 'flex', flexDirection: 'column', gap: '10px' },
  footerHeading: { fontSize: '14px', fontWeight: 'bold', color: '#FFFFFF', margin: '0 0 6px' },
  footerLink: { color: '#94A3B8', textDecoration: 'none', fontSize: '13px' },
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