import { useState } from 'react';
import styles from '../src/CSS/Nightlife.module.css';

const VENUES_DATA = [
  {
    id: 'venue-01',
    title: 'The Net Club & Lounge',
    rating: 4.8,
    reviewsCount: 214,
    priceRange: '$$$',
    description: 'The premier destination for luxury nightlife in Rayfield. Featuring international DJs, expertly crafted cocktails, and exclusive VIP experiences.',
    category: 'Clubs',
    tag: 'Premium Club',
    neighborhood: 'Rayfield',
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'venue-02',
    title: 'Evergreen Garden',
    rating: 4.5,
    reviewsCount: 182,
    priceRange: '$$',
    description: 'Open-air lounge with live acoustic bands, cold drinks, and a relaxed garden vibe in the heart of GRA.',
    category: 'Live Music',
    tag: 'live-music',
    neighborhood: 'GRA, Jos',
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'venue-03',
    title: 'Pulse Lounge',
    rating: 4.7,
    reviewsCount: 306,
    priceRange: '$$$',
    description: 'Contemporary rooftop lounge offering premium cocktails, shisha, and energetic DJ sets till early morning.',
    category: 'Lounges',
    additionalCategories: ['Bars'],
    tag: 'lounges',
    neighborhood: 'Secretariat Junction',
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'venue-04',
    title: 'Hills View Club',
    rating: 4.2,
    reviewsCount: 94,
    priceRange: '$$',
    description: 'Energetic dance club popular for weekend party nights, local Afrobeat hits, and VIP bottle service.',
    category: 'Clubs',
    tag: 'clubs',
    neighborhood: 'Laminga Route',
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'venue-05',
    title: 'Suya & Bites Late Grill',
    rating: 4.6,
    reviewsCount: 120,
    priceRange: '$',
    description: 'Famous late-night spot serving hot spicy suya, grilled fish, and cold refreshments past midnight.',
    category: 'Late Night Eats',
    tag: 'late-night-eats',
    neighborhood: 'Ahmadu Bello Way',
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
  }
];

const CATEGORIES = ['All', 'Clubs', 'Lounges', 'Live Music', 'Late Night Eats', 'Bars'];

export const NightlifePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modals state
  const [bookingVenue, setBookingVenue] = useState(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Form inputs
  const [reservation, setReservation] = useState({ date: '', time: '21:00', guests: '2', name: '', phone: '' });
  const [claimData, setClaimData] = useState({ venueName: '', ownerName: '', email: '', phone: '' });

  // Filter Logic
  const filteredVenues = VENUES_DATA.filter((venue) => {
    const matchesCategory = selectedCategory === 'All' ||
      venue.category === selectedCategory ||
      venue.additionalCategories?.includes(selectedCategory);
    const matchesSearch = 
      venue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const featuredVenue = VENUES_DATA.find(v => v.isFeatured);

  const handleBookTable = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
  };

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    alert('Thank you! Our local Jos team will verify your details and contact you within 24 hours.');
    setShowClaimModal(false);
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Experience the Pulse of Jos After Dark</h1>
        <p className={styles.heroSubtitle}>
          Discover the best clubs, lounges, and late-night spots the city has to offer.
        </p>

        {/* Search & Dynamic Filters Box */}
        <div className={styles.searchCard}>
          <div className={styles.searchBar}>
            <span className={styles.searchIcon}>🔍</span>
            <input 
              type="text" 
              placeholder="Search venues, cuisines, or neighborhoods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.pillsRow}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={selectedCategory === cat ? styles.activePill : styles.pill}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Venue Card */}
      {featuredVenue && selectedCategory === 'All' && !searchQuery && (
        <section className={styles.featuredSection}>
          <h2 className={styles.sectionHeader}>Featured Venue</h2>
          <div className={styles.featuredCard}>
            <div className={styles.imageWrapper}>
              <img src={featuredVenue.image} alt={featuredVenue.title} className={styles.cardImage} />
              <span className={styles.promotedBadge}>★ PROMOTED</span>
            </div>

            <div className={styles.featuredContent}>
              <h3 className={styles.venueTitle}>{featuredVenue.title}</h3>
              <div className={styles.ratingRow}>
                <span className={styles.stars}>★ {featuredVenue.rating}</span>
                <span className={styles.reviews}>({featuredVenue.reviewsCount} reviews)</span>
                <span className={styles.price}>{featuredVenue.priceRange}</span>
              </div>

              <p className={styles.venueDesc}>{featuredVenue.description}</p>

              <div className={styles.tagsRow}>
                <span className={styles.tagBadge}>{featuredVenue.tag}</span>
                <span className={styles.locationBadge}>📍 {featuredVenue.neighborhood}</span>
              </div>

              <button 
                type="button" 
                className={styles.primaryBtn}
                onClick={() => { setBookingVenue(featuredVenue); setBookingSuccess(false); }}
              >
                Book a Table
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Trending Spots Grid */}
      <section className={styles.trendingSection}>
        <h2 className={styles.sectionHeader}>
          {searchQuery || selectedCategory !== 'All' ? 'Search Results' : 'Trending Spots'}
        </h2>

        <div className={styles.spotsGrid}>
          {filteredVenues.filter(v => searchQuery || selectedCategory !== 'All' ? true : !v.isFeatured).map((venue) => (
            <div key={venue.id} className={styles.spotCard}>
              <div className={styles.spotImageWrapper}>
                <img src={venue.image} alt={venue.title} className={styles.cardImage} />
                <span className={styles.categoryBadge}>🎵 {venue.tag}</span>
              </div>

              <div className={styles.spotContent}>
                <div className={styles.titlePriceRow}>
                  <h4 className={styles.spotTitle}>{venue.title}</h4>
                  <span className={styles.price}>{venue.priceRange}</span>
                </div>

                <div className={styles.ratingRow}>
                  <span className={styles.stars}>★ {venue.rating}</span>
                  <span className={styles.reviews}>({venue.reviewsCount})</span>
                </div>

                <div className={styles.locationRow}>
                  📍 {venue.neighborhood}
                </div>

                <button 
                  type="button" 
                  className={styles.secondaryBtn}
                  onClick={() => { setBookingVenue(venue); setBookingSuccess(false); }}
                >
                  Book Table
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Claim Venue Banner */}
      <section className={styles.claimBanner}>
        <h3>Own a Venue in Jos?</h3>
        <p>Claim your listing to manage details, respond to reviews, and attract more patrons.</p>
        <button 
          type="button" 
          className={styles.claimBtn}
          onClick={() => setShowClaimModal(true)}
        >
          Claim Your Venue
        </button>
      </section>

      {/* Book Table Modal */}
      {bookingVenue && (
        <div className={styles.modalOverlay} onClick={() => setBookingVenue(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setBookingVenue(null)}>✕</button>

            {bookingSuccess ? (
              <div className={styles.successState}>
                <h2>🎉 Reservation Requested!</h2>
                <p>Your table request at <strong>{bookingVenue.title}</strong> has been received.</p>
                <p className={styles.subNote}>Confirmation SMS will be sent to {reservation.phone}.</p>
                <button type="button" className={styles.primaryBtn} onClick={() => setBookingVenue(null)}>Done</button>
              </div>
            ) : (
              <form onSubmit={handleBookTable} className={styles.form}>
                <h3>Book a Table at {bookingVenue.title}</h3>
                <p className={styles.locationSub}>📍 {bookingVenue.neighborhood}</p>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Date</label>
                    <input type="date" required onChange={(e) => setReservation({...reservation, date: e.target.value})} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Time</label>
                    <select value={reservation.time} onChange={(e) => setReservation({...reservation, time: e.target.value})}>
                      <option value="20:00">8:00 PM</option>
                      <option value="21:00">9:00 PM</option>
                      <option value="22:00">10:00 PM</option>
                      <option value="23:00">11:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Guests</label>
                  <select value={reservation.guests} onChange={(e) => setReservation({...reservation, guests: e.target.value})}>
                    <option value="2">2 People (Regular Table)</option>
                    <option value="4">4 People (Regular Table)</option>
                    <option value="6">6 People (VIP Lounge Booth)</option>
                    <option value="10">10+ People (VVIP Section)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input type="text" placeholder="e.g. John Pam" required onChange={(e) => setReservation({...reservation, name: e.target.value})} />
                </div>

                <div className={styles.formGroup}>
                  <label>Phone Number (for SMS confirmation)</label>
                  <input type="tel" placeholder="08012345678" required onChange={(e) => setReservation({...reservation, phone: e.target.value})} />
                </div>

                <button type="submit" className={styles.primaryBtn}>Confirm Table Reservation</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Claim Venue Modal */}
      {showClaimModal && (
        <div className={styles.modalOverlay} onClick={() => setShowClaimModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowClaimModal(false)}>✕</button>
            <form onSubmit={handleClaimSubmit} className={styles.form}>
              <h3>Claim Your Venue in Jos</h3>
              <p className={styles.locationSub}>Join Jos Pulse to manage your business page and receive direct bookings.</p>

              <div className={styles.formGroup}>
                <label>Venue Name</label>
                <input type="text" placeholder="e.g. Rayfield Garden Lounge" required onChange={(e) => setClaimData({...claimData, venueName: e.target.value})} />
              </div>

              <div className={styles.formGroup}>
                <label>Manager / Owner Name</label>
                <input type="text" placeholder="e.g. Sarah Gyang" required onChange={(e) => setClaimData({...claimData, ownerName: e.target.value})} />
              </div>

              <div className={styles.formGroup}>
                <label>Business Email</label>
                <input type="email" placeholder="owner@venue.com" required onChange={(e) => setClaimData({...claimData, email: e.target.value})} />
              </div>

              <div className={styles.formGroup}>
                <label>Phone Number</label>
                <input type="tel" placeholder="08012345678" required onChange={(e) => setClaimData({...claimData, phone: e.target.value})} />
              </div>

              <button type="submit" className={styles.primaryBtn}>Submit Listing Claim</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NightlifePage;