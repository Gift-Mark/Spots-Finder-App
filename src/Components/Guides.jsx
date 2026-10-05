import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved,
  faMapMarkerAlt,
  faStar,
  faCompass,
  faClock,
  faXmark,
  faUsers
} from '@fortawesome/free-solid-svg-icons';

const LOCAL_GUIDES_DATA = [
  {
    id: "guide-01",
    name: "Dauda 'Sherpa' Dung",
    title: "Master High-Altitude Trekking Guide",
    badge: "Plateau Tourism Board Certified",
    rating: 4.95,
    reviewsCount: 124,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    specialties: ["Shere Hills Trekking", "Ropp Rock Climbing", "Wilderness Survival"],
    experienceYears: 9,
    languages: ["English", "Hausa", "Berom"],
    hourlyRate: 8500,
    phone: "+234 803 111 2233",
    bio: "Native of Shere Hills valley with over 9 years leading high-altitude summit treks and rock scrambling expeditions across Plateau State."
  },
  {
    id: "guide-02",
    name: "Dr. Ladi Pam",
    title: "Colonial History & Heritage Specialist",
    badge: "Plateau Heritage Foundation Lead",
    rating: 4.90,
    reviewsCount: 88,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    specialties: ["Mining History Tour", "Jos Museum Heritage", "Rayfield Colonial Architecture"],
    experienceYears: 12,
    languages: ["English", "Hausa"],
    hourlyRate: 10000,
    phone: "+234 802 999 4455",
    bio: "Former University lecturer passionate about tin mining heritage, colonial archaeology, and the cultural tapestry of ancient Plateau tribes."
  },
  {
    id: "guide-03",
    name: "Marcus Kazi",
    title: "Culinary & Nightlife Ambassador",
    badge: "Jos Pulse Vibe Verified",
    rating: 4.88,
    reviewsCount: 156,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    specialties: ["West of Mines Suya Crawl", "Bush Bar Tasting", "Live Acoustic Lounges"],
    experienceYears: 6,
    languages: ["English", "Pidgin", "Hausa"],
    hourlyRate: 7000,
    phone: "+234 814 555 6677",
    bio: "Connected local insider who knows every hidden suya stall, high-vibe garden, and live band lounge from Rayfield to Tudun Wada."
  },
  {
    id: "guide-04",
    name: "Blessing Solomon",
    title: "Ecotourism & Wildlife Guide",
    badge: "Certified Nature Specialist",
    rating: 4.92,
    reviewsCount: 94,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    specialties: ["Jos Wildlife Park", "Assop Falls Excursion", "Lamingo Dam Kayaking"],
    experienceYears: 7,
    languages: ["English", "Hausa", "Ngas"],
    hourlyRate: 8000,
    phone: "+234 805 444 3322",
    bio: "Wildlife biologist dedicated to eco-friendly tours, waterfall hikes, and birdwatching expeditions around Plateau water bodies."
  }
];

const CURATED_ITINERARIES = [
  {
    id: "itin-01",
    title: "1-Day Jos Cultural & Scenic Highlights",
    subtitle: "Ideal for first-time visitors seeking history, panoramic views, and classic local lunch spots.",
    duration: "Full Day (8 Hours)",
    vibe: "Cultural & Scenic",
    startingPoint: "Jos National Museum Gate",
    stopsCount: 5,
    stops: [
      { time: "08:30 AM", title: "Jos National Museum & Nok Terracotta Gallery", desc: "Explore ancient Nok art relics and early 20th-century tin mining transport trains." },
      { time: "11:00 AM", title: "Jos Wildlife Park Walkthrough", desc: "Observe lions, elephants, and primates in serene pine-forested valley enclosures." },
      { time: "01:30 PM", title: "Traditional Masa & Masa-Soup Lunch", desc: "Authentic Plateau culinary stop at a top-rated traditional spot in GRA." },
      { time: "03:30 PM", title: "Lamingo Dam Scenic Lookout", desc: "Panoramic photo session overlooking the artificial reservoir framed by granite hills." },
      { time: "05:30 PM", title: "Rayfield Resort Lakefront Sunset", desc: "Unwind by the lake with chilled zobo, fresh pepper soup, or palm wine." }
    ]
  },
  {
    id: "itin-02",
    title: "Weekend Outdoor & Shere Hills Adventure",
    subtitle: "High-energy itinerary featuring rock climbing, waterfall dips, and high-altitude hiking.",
    duration: "2 Days (Weekend)",
    vibe: "Adrenaline & Nature",
    startingPoint: "Shere Hills Base Camp",
    stopsCount: 6,
    stops: [
      { time: "Day 1 - 06:30 AM", title: "Shere Peak 1 Ascent & Summit Sunrise", desc: "Guided high-grade scramble to one of Nigeria's highest peaks with epic morning clouds." },
      { time: "Day 1 - 12:00 PM", title: "Ropp Rock Formations Exploration", desc: "Discover natural balancing boulders and ancient cave shelters used by indigenous tribes." },
      { time: "Day 1 - 04:00 PM", title: "Campfire & Open-Air Barbeque", desc: "Overnight rustic camping or stay at nearby mountain lodge with local storytelling." },
      { time: "Day 2 - 09:00 AM", title: "Assop Falls Cascades & Swimming", desc: "Trip down Hawan Kibo to the natural rock cascades and rainforest pool." },
      { time: "Day 2 - 02:00 PM", title: "Kurra Falls Power House Viewpoint", desc: "Scenic picnic spot near Plateau's historic hydro-electric station." }
    ]
  },
  {
    id: "itin-03",
    title: "The Ultimate Nightlife & Suya Crawl",
    subtitle: "Evening adventure through legendary open-air bush bars, live jazz, and West of Mines late-night eats.",
    duration: "Evening (5 Hours)",
    vibe: "Nightlife & Foodie",
    startingPoint: "Tudun Wada Central Junction",
    stopsCount: 4,
    stops: [
      { time: "06:30 PM", title: "St. Ejix Bush Bar Warm-Up", desc: "Fresh goat head (Isi Ewu), chilled local beverages, and acoustic highlife acoustic music." },
      { time: "08:30 PM", title: "West of Mines Suya Belt", desc: "Sampling premium Masa, Kilishi, and spicy Ram Suya from master vendors." },
      { time: "10:30 PM", title: "Kruiseyard Lounge & Garden", desc: "High-energy DJ beats, VIP lounge seating, and signature Jos Pulse cocktail mixes." },
      { time: "12:30 AM", title: "Late Night Street Food Finale", desc: "Grabbing hot Indomie & fried egg, roasted corn, or fresh suya to wrap up the night." }
    ]
  }
];

export default function LocalGuidesPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [activeItinerary, setActiveItinerary] = useState('itin-01');
  const [bookingModalGuide, setBookingModalGuide] = useState(null);

  // Form State inside Modal
  const [bookingDetails, setBookingDetails] = useState({
    touristName: '',
    phone: '',
    date: '2026-10-15',
    groupSize: '2',
    tourType: 'Custom City Tour'
  });

  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  // Filter Guides Logic
  const filteredGuides = selectedSpecialty === 'All' 
    ? LOCAL_GUIDES_DATA 
    : LOCAL_GUIDES_DATA.filter(g => g.specialties.some(s => s.toLowerCase().includes(selectedSpecialty.toLowerCase())));

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSubmitted(true);
    setTimeout(() => {
      setBookingSubmitted(false);
      setBookingModalGuide(null);
      alert(`Booking Request Sent to ${bookingModalGuide.name}! They will contact you via WhatsApp/Phone shortly.`);
    }, 1200);
  };

  return (
    <div style={styles.pageContainer}>
      {}
      <section style={styles.heroSection}>
        <div style={styles.heroOverlay}>
          <div style={styles.heroBadge}>
            <FontAwesomeIcon icon={faShieldHalved} style={{ fontSize: 16, color: '#F97316' }} />
            <span>100% Certified Plateau Tourism Partners</span>
          </div>
          <h1 style={styles.heroTitle}>Discover Plateau State with Verified Local Guides</h1>
          <p style={styles.heroSub}>
            Trek Shere Hills safely, unearth colonial tin mining history, or explore the legendary West of Mines nightlife with certified local experts.
          </p>

          {/* Quick Stats Bar */}
          <div style={styles.statsBar}>
            <div style={styles.statItem}>
              <FontAwesomeIcon icon={faUsers} style={{ fontSize: 22, color: '#F97316' }} />
              <div>
                <strong style={styles.statNumber}>40+</strong>
                <span style={styles.statLabel}>Certified Guides</span>
              </div>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <FontAwesomeIcon icon={faStar} style={{ fontSize: 22, color: '#F97316' }} />
              <div>
                <strong style={styles.statNumber}>4.9 / 5.0</strong>
                <span style={styles.statLabel}>Tourist Rating</span>
              </div>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <FontAwesomeIcon icon={faCompass} style={{ fontSize: 22, color: '#F97316' }} />
              <div>
                <strong style={styles.statNumber}>15+</strong>
                <span style={styles.statLabel}>Curated Routes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section style={styles.sectionContainer}>
        <div style={styles.sectionHeader}>
          <div>
            <span style={styles.categoryTag}>EXPERT DIRECTORY</span>
            <h2 style={styles.sectionTitle}>Meet Our Local Guides & Expedition Leaders</h2>
          </div>

          {/* Category Filters */}
          <div style={styles.filterGroup}>
            {['All', 'Trekking', 'Mining', 'Suya', 'Wildlife'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedSpecialty(category)}
                style={{
                  ...styles.filterBtn,
                  ...(selectedSpecialty === category ? styles.filterBtnActive : {})
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Guides Grid */}
        <div style={styles.guidesGrid}>
          {filteredGuides.map((guide) => (
            <div key={guide.id} style={styles.guideCard}>
              <div style={styles.cardTop}>
                <img src={guide.avatar} alt={guide.name} style={styles.avatar} />
                <div style={styles.verifiedTag}>
                  <FontAwesomeIcon icon={faShieldHalved} style={{ fontSize: 14, color: '#16A34A' }} />
                  <span>{guide.badge}</span>
                </div>
              </div>

              <div style={styles.cardBody}>
                <div style={styles.ratingRow}>
                  <FontAwesomeIcon icon={faStar} style={{ fontSize: 16, color: '#F59E0B' }} />
                  <strong style={{ fontSize: '14px' }}>{guide.rating}</strong>
                  <span style={styles.reviewsText}>({guide.reviewsCount} reviews)</span>
                </div>

                <h3 style={styles.guideName}>{guide.name}</h3>
                <p style={styles.guideTitle}>{guide.title}</p>
                <p style={styles.guideBio}>{guide.bio}</p>

                {/* Specialties Tags */}
                <div style={styles.tagsRow}>
                  {guide.specialties.map((spec, idx) => (
                    <span key={idx} style={styles.specTag}>
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Info Footer */}
                <div style={styles.cardFooter}>
                  <div>
                    <span style={styles.priceLabel}>Daily / Hourly Rate</span>
                    <strong style={styles.priceValue}>₦{guide.hourlyRate.toLocaleString()} <span style={{ fontSize: '12px', color: '#64748B' }}>/ hr</span></strong>
                  </div>

                  <button 
                    style={styles.bookBtn} 
                    onClick={() => setBookingModalGuide(guide)}
                  >
                    Hire Guide ↗
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {}
      <section style={{ ...styles.sectionContainer, backgroundColor: '#0B132B', borderRadius: '16px', padding: '40px 24px', margin: '40px auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={styles.categoryTag}>SELF-GUIDED OR MATCHED</span>
          <h2 style={{ ...styles.sectionTitle, color: '#FFFFFF' }}>Curated Plateau City Itineraries</h2>
          <p style={{ color: '#94A3B8', maxWidth: '600px', margin: '8px auto 0' }}>
            Follow these pre-planned routes at your own pace or request a certified guide to walk you through step-by-step.
          </p>
        </div>

        {/* Itinerary Selection Tabs */}
        <div style={styles.itinTabsRow}>
          {CURATED_ITINERARIES.map((itin) => (
            <button
              key={itin.id}
              onClick={() => setActiveItinerary(itin.id)}
              style={{
                ...styles.itinTabBtn,
                ...(activeItinerary === itin.id ? styles.itinTabActive : {})
              }}
            >
              <FontAwesomeIcon icon={faCompass} />
              <span>{itin.title}</span>
            </button>
          ))}
        </div>

        {/* Selected Itinerary Breakdown Card */}
        {(() => {
          const current = CURATED_ITINERARIES.find(i => i.id === activeItinerary);
          return (
            <div style={styles.itinDetailsCard}>
              <div style={styles.itinHeader}>
                <div>
                  <div style={styles.vibeBadge}>{current.vibe}</div>
                  <h3 style={{ fontSize: '22px', color: '#FFFFFF', margin: '8px 0 4px' }}>{current.title}</h3>
                  <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>{current.subtitle}</p>
                </div>

                <div style={styles.itinMetaRight}>
                  <div style={styles.metaBadge}>
                    <FontAwesomeIcon icon={faClock} style={{ fontSize: 16, color: '#F97316' }} />
                    <span>{current.duration}</span>
                  </div>
                  <div style={styles.metaBadge}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} style={{ fontSize: 16, color: '#F97316' }} />
                    <span>Starts: {current.startingPoint}</span>
                  </div>
                </div>
              </div>

              {/* Timeline Steps */}
              <div style={styles.timelineContainer}>
                {current.stops.map((stop, index) => (
                  <div key={index} style={styles.timelineItem}>
                    <div style={styles.timelineLeft}>
                      <span style={styles.timeLabel}>{stop.time}</span>
                      <div style={styles.timelineDot} />
                      {index !== current.stops.length - 1 && <div style={styles.timelineLine} />}
                    </div>

                    <div style={styles.timelineRight}>
                      <h4 style={styles.stopTitle}>Stop {index + 1}: {stop.title}</h4>
                      <p style={styles.stopDesc}>{stop.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.itinCardFooter}>
                <span style={{ color: '#94A3B8', fontSize: '14px' }}>
                  💡 Want a guide for this route? Select any certified guide above to request this itinerary.
                </span>
                <button 
                  style={styles.bookBtn}
                  onClick={() => setBookingModalGuide(LOCAL_GUIDES_DATA[0])}
                >
                  Book Guide for This Route ↗
                </button>
              </div>
            </div>
          );
        })()}
      </section>

      {}
      {bookingModalGuide && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', color: '#0F172A' }}>Request Guide Reservation</h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748B' }}>
                  Directly match with <strong>{bookingModalGuide.name}</strong>
                </p>
              </div>
              <button 
                style={styles.closeBtn} 
                onClick={() => setBookingModalGuide(null)}
              >
                <FontAwesomeIcon icon={faXmark} style={{ fontSize: 20 }} />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} style={styles.modalForm}>
              <div style={styles.guideSummaryBox}>
                <img src={bookingModalGuide.avatar} alt={bookingModalGuide.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '14px', color: '#0F172A' }}>{bookingModalGuide.name}</strong>
                  <span style={{ fontSize: '12px', color: '#16A34A', fontWeight: 'bold' }}>● {bookingModalGuide.badge}</span>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Your Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Musa Ibrahim"
                  style={styles.input}
                  value={bookingDetails.touristName}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, touristName: e.target.value })}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>WhatsApp / Phone Number</label>
                <input 
                  type="tel" 
                  required
                  placeholder="+234 800 000 0000"
                  style={styles.input}
                  value={bookingDetails.phone}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, phone: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Preferred Date</label>
                  <input 
                    type="date" 
                    required
                    style={styles.input}
                    value={bookingDetails.date}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Group Size</label>
                  <select 
                    style={styles.input}
                    value={bookingDetails.groupSize}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, groupSize: e.target.value })}
                  >
                    <option value="1">Solo (1 Person)</option>
                    <option value="2">Couple (2 People)</option>
                    <option value="4">Small Group (3-5)</option>
                    <option value="10">Large Group (6+)</option>
                  </select>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Tour Focus / Itinerary</label>
                <select 
                  style={styles.input}
                  value={bookingDetails.tourType}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, tourType: e.target.value })}
                >
                  <option value="Shere Hills Trekking">Shere Hills Summit Trek</option>
                  <option value="Colonial History & Museum">Colonial History & Museum Tour</option>
                  <option value="Nightlife & Suya Crawl">Nightlife & West of Mines Crawl</option>
                  <option value="Custom Itinerary">Custom Itinerary (Flexible)</option>
                </select>
              </div>

              {/* Price Estimate */}
              <div style={styles.priceEstimateBox}>
                <span style={{ fontSize: '13px', color: '#64748B' }}>Estimated Half-Day Fee:</span>
                <strong style={{ fontSize: '18px', color: '#F97316' }}>
                  ₦{(bookingModalGuide.hourlyRate * 4).toLocaleString()}
                </strong>
              </div>

              <button 
                type="submit" 
                style={styles.submitBtn}
                disabled={bookingSubmitted}
              >
                {bookingSubmitted ? 'Transmitting Request...' : 'Confirm Guide Request ↗'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  pageContainer: {
    backgroundColor: '#0F172A',
    minHeight: '100vh',
    color: '#F8FAFC',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    paddingBottom: '60px'
  },
  heroSection: {
    background: 'linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95)), url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '80px 24px 60px',
    textAlign: 'center'
  },
  heroOverlay: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(249, 115, 22, 0.15)',
    border: '1px solid #F97316',
    color: '#F97316',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 'bold',
    marginBottom: '20px'
  },
  heroTitle: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#FFFFFF',
    margin: '0 0 16px 0',
    lineHeight: '1.2'
  },
  heroSub: {
    fontSize: '16px',
    color: '#94A3B8',
    lineHeight: '1.6',
    margin: '0 0 32px 0'
  },
  statsBar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '24px',
    background: '#1E293B',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #334155',
    flexWrap: 'wrap'
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  statNumber: {
    display: 'block',
    fontSize: '18px',
    color: '#FFFFFF',
    textAlign: 'left'
  },
  statLabel: {
    fontSize: '12px',
    color: '#94A3B8'
  },
  statDivider: {
    width: '1px',
    height: '30px',
    backgroundColor: '#334155'
  },
  sectionContainer: {
    maxWidth: '1200px',
    margin: '40px auto 0',
    padding: '0 24px'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '28px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  categoryTag: {
    fontSize: '12px',
    color: '#F97316',
    fontWeight: 'bold',
    letterSpacing: '1px'
  },
  sectionTitle: {
    fontSize: '26px',
    fontWeight: 'bold',
    margin: '4px 0 0 0',
    color: '#FFFFFF'
  },
  filterGroup: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  filterBtn: {
    background: '#1E293B',
    border: '1px solid #334155',
    color: '#94A3B8',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  filterBtnActive: {
    backgroundColor: '#F97316',
    color: '#FFFFFF',
    borderColor: '#F97316'
  },
  guidesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px'
  },
  guideCard: {
    backgroundColor: '#1E293B',
    borderRadius: '12px',
    border: '1px solid #334155',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  cardTop: {
    position: 'relative',
    padding: '20px 20px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #F97316'
  },
  verifiedTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: 'rgba(22, 163, 74, 0.15)',
    color: '#4ADE80',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 'bold'
  },
  cardBody: {
    padding: '16px 20px 20px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '8px'
  },
  reviewsText: {
    fontSize: '12px',
    color: '#94A3B8'
  },
  guideName: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 2px 0',
    color: '#FFFFFF'
  },
  guideTitle: {
    fontSize: '13px',
    color: '#F97316',
    margin: '0 0 10px 0',
    fontWeight: '500'
  },
  guideBio: {
    fontSize: '13px',
    color: '#94A3B8',
    lineHeight: '1.5',
    margin: '0 0 16px 0'
  },
  tagsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '20px'
  },
  specTag: {
    background: '#0F172A',
    color: '#CBD5E1',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '11px',
    border: '1px solid #334155'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: '16px',
    borderTop: '1px solid #334155'
  },
  priceLabel: {
    display: 'block',
    fontSize: '11px',
    color: '#94A3B8'
  },
  priceValue: {
    fontSize: '16px',
    color: '#FFFFFF'
  },
  bookBtn: {
    backgroundColor: '#F97316',
    color: '#FFFFFF',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '13px'
  },
  itinTabsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  itinTabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#1E293B',
    border: '1px solid #334155',
    color: '#94A3B8',
    padding: '12px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  itinTabActive: {
    backgroundColor: '#F97316',
    color: '#FFFFFF',
    borderColor: '#F97316'
  },
  itinDetailsCard: {
    background: '#1E293B',
    borderRadius: '12px',
    padding: '28px',
    border: '1px solid #334155'
  },
  itinHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '28px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  vibeBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    background: 'rgba(249, 115, 22, 0.2)',
    color: '#F97316',
    fontSize: '11px',
    fontWeight: 'bold',
    borderRadius: '4px'
  },
  itinMetaRight: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  metaBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: '#0F172A',
    padding: '8px 14px',
    borderRadius: '6px',
    fontSize: '13px',
    border: '1px solid #334155'
  },
  timelineContainer: {
    margin: '20px 0 28px'
  },
  timelineItem: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px'
  },
  timelineLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '100px'
  },
  timeLabel: {
    fontSize: '12px',
    color: '#F97316',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  timelineDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#F97316'
  },
  timelineLine: {
    width: '2px',
    flex: 1,
    backgroundColor: '#334155',
    marginTop: '4px'
  },
  timelineRight: {
    background: '#0F172A',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #334155',
    flex: 1
  },
  stopTitle: {
    fontSize: '15px',
    fontWeight: 'bold',
    margin: '0 0 4px 0',
    color: '#FFFFFF'
  },
  stopDesc: {
    fontSize: '13px',
    color: '#94A3B8',
    margin: 0,
    lineHeight: '1.4'
  },
  itinCardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '20px',
    borderTop: '1px solid #334155',
    flexWrap: 'wrap',
    gap: '16px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '460px',
    padding: '24px',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#64748B'
  },
  guideSummaryBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#F1F5F9',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px'
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#0F172A'
  },
  input: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #CBD5E1',
    fontSize: '14px',
    outline: 'none'
  },
  priceEstimateBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#FFF7ED',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #FFEDD5'
  },
  submitBtn: {
    backgroundColor: '#F97316',
    color: '#FFFFFF',
    border: 'none',
    padding: '12px',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '8px'
  }
};