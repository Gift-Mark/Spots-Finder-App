import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faMapMarkerAlt, 
  faSearch, 
  faFilter, 
  faArrowLeft 
} from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/RestaurantsDirectory.module.css';

// 14 Real-world Restaurants & Lounges in Jos
const JOS_14_RESTAURANTS = [
  {
    id: 'simmer-restaurant',
    name: 'Simmer Restaurant & Café',
    category: 'Pan-Asian & Continental',
    neighborhood: 'Gold & Base / Rayfield',
    rating: 4.6,
    reviews: 248,
    price: '₦₦₦ (₦12,000 - ₦28,000)',
    address: 'No 1B Beside Eliel Event Center, Gold & Base, Jos',
    tags: ['Pan-Asian', 'Gourmet Sizzlers', 'Outdoor Terrace'],
    image: '/images/simmer.jpg',
    featured: true
  },
  {
    id: 'barcardi-restaurant-cafe',
    name: 'Barcardi Restaurant & Café',
    category: 'Afro-Fusion & Lounge',
    neighborhood: 'GRA Jos',
    rating: 4.5,
    reviews: 201,
    price: '₦₦₦ (₦8,000 - ₦22,000)',
    address: '11 Dandaura Road, Off Wase Road, GRA, Jos',
    tags: ['Grills', 'Private Dining', 'Cocktails'],
    image: '/images/barcardi.jpg',
    featured: true
  },
  {
    id: 'sweet-november-bistro',
    name: 'Sweet November Bistro',
    category: 'Bistro & Fine Dining',
    neighborhood: 'Gold & Base / GRA',
    rating: 4.6,
    reviews: 454,
    price: '₦₦₦ (₦7,000 - ₦20,000)',
    address: 'No 1B Totus Tuus Close, Gold & Base, Jos',
    tags: ['Steaks', 'Pastas', 'Romantic Ambience'],
    image: '/images/sweet-november.jpg',
    featured: true
  },
  {
    id: 'crest-view-lounge',
    name: 'The Crest View Lounge',
    category: 'Panoramic Fine Dining',
    neighborhood: 'Old Airport Road',
    rating: 4.8,
    reviews: 310,
    price: '₦₦₦₦ (₦10,000 - ₦25,000)',
    address: 'Crest Hotel Axis, Old Airport Road, Jos South',
    tags: ['Skyline View', 'Live Saxophone', 'Wine Pairing'],
    image: '/images/crest-view.jpg',
    featured: true
  },
  {
    id: 'aura-sky-lounge',
    name: 'Aura Sky Lounge',
    category: 'Rooftop Lounge & Bar',
    neighborhood: 'Rayfield',
    rating: 4.5,
    reviews: 189,
    price: '₦₦₦ (₦6,000 - ₦18,000)',
    address: 'Rayfield Axis, Near Golf Club, Jos',
    tags: ['Rooftop View', 'Mixology', 'DJ Nights'],
    image: '/images/aura-sky.jpg',
    featured: false
  },
  {
    id: 'mezzanine-lounge',
    name: 'Mezzanine Lounge & Restaurant',
    category: 'Executive Lounge',
    neighborhood: 'Rayfield',
    rating: 4.4,
    reviews: 165,
    price: '₦₦₦ (₦8,000 - ₦20,000)',
    address: 'Rayfield Resort Road, Jos',
    tags: ['VIP Booths', 'Grills', 'Late Night'],
    image: '/images/mezzanine.jpg',
    featured: false
  },
  {
    id: 'crispan-dining-lounge',
    name: 'The Crispan Dining & Lounge',
    category: 'Hotel Dining & Poolside',
    neighborhood: 'Yingi / Jonah Jang Expressway',
    rating: 4.5,
    reviews: 1536,
    price: '₦₦₦ (₦9,000 - ₦24,000)',
    address: 'Jonah Jang Expressway, Yingi District, Jos',
    tags: ['Poolside Dining', 'Intercontinental', 'Bar'],
    image: '/images/crispan.jpg',
    featured: false
  },
  {
    id: 'point-hotel-lounge',
    name: 'Point Hotel & Suites Lounge',
    category: 'Upscale Hotel Bar & Dining',
    neighborhood: 'Rayfield',
    rating: 4.3,
    reviews: 142,
    price: '₦₦₦ (₦7,000 - ₦18,000)',
    address: 'Opp. Rayfield Golf Course, Rayfield, Jos',
    tags: ['Seafood', 'Cocktails', 'Quiet Dining'],
    image: '/images/point-hotel.jpg',
    featured: false
  },
  {
    id: 'minesfield-lounge',
    name: 'Minesfield Hotel & Lounge',
    category: 'Continental & Lounge',
    neighborhood: 'GRA Jos',
    rating: 4.4,
    reviews: 118,
    price: '₦₦ (₦5,000 - ₦15,000)',
    address: 'GRA Housing Estate, GRA, Jos',
    tags: ['Serene Garden', 'Afro-Fusion', 'Suya Grid'],
    image: '/images/minesfield.jpg',
    featured: false
  },
  {
    id: 'trophy-lounge-grill',
    name: 'Trophy Lounge & Grill',
    category: 'Nightlife & Sports Lounge',
    neighborhood: 'Jos Metropolis',
    rating: 4.2,
    reviews: 215,
    price: '₦₦ (₦4,000 - ₦12,000)',
    address: 'Ahmadu Bello Way Axis, Jos Central',
    tags: ['Live Sports', 'BBQ Grills', 'Chilled Drinks'],
    image: '/images/trophy.jpg',
    featured: false
  },
  {
    id: 'eliel-lounge-garden',
    name: 'Eliel Lounge & Event Garden',
    category: 'Open-Air Garden Lounge',
    neighborhood: 'Gold & Base',
    rating: 4.5,
    reviews: 290,
    price: '₦₦ (₦5,000 - ₦16,000)',
    address: 'Eliel Center Axis, Gold & Base, Jos',
    tags: ['Outdoor Garden', 'Live Band', 'Pepper Soup'],
    image: '/images/eliel.jpg',
    featured: false
  },
  {
    id: 'rayfield-golf-lounge',
    name: 'Rayfield Golf Club Lounge',
    category: 'Heritage Executive Lounge',
    neighborhood: 'Rayfield',
    rating: 4.6,
    reviews: 175,
    price: '₦₦₦ (₦6,000 - ₦20,000)',
    address: 'Rayfield Golf Course Grounds, Rayfield, Jos',
    tags: ['Golf Course View', 'Members & Guests', 'Traditional Grills'],
    image: '/images/rayfield-golf.jpg',
    featured: false
  },
  {
    id: 'zias-kitchen-lounge',
    name: 'Zia\'s Kitchen & Lounge',
    category: 'Modern Casual Dining',
    neighborhood: 'GRA Jos',
    rating: 4.4,
    reviews: 160,
    price: '₦₦ (₦4,500 - ₦14,000)',
    address: 'Apollo Crescent, GRA, Jos',
    tags: ['Comfort Food', 'Mocktails', 'Cozy Ambiance'],
    image: '/images/zias.jpg',
    featured: false
  },
  {
    id: 'plateau-hotel-lounge',
    name: 'Plateau Hotel Executive Lounge',
    category: 'Heritage Dining & Bar',
    neighborhood: 'Jos Central',
    rating: 4.1,
    reviews: 98,
    price: '₦₦ (₦4,000 - ₦12,000)',
    address: 'Tudun Wada Road, Jos Metropolis',
    tags: ['Classic Bar', 'Local Delicacies', 'Spacious'],
    image: '/images/plateau-hotel.jpg',
    featured: false
  }
];

export const RestaurantsDirectory = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'all';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');

  const filteredPlaces = useMemo(() => {
    return JOS_14_RESTAURANTS.filter((place) => {
      const matchesSearch = 
        place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' || selectedCategory === 'restaurants-lounges';

      const matchesArea = 
        selectedArea === 'all' || place.neighborhood.includes(selectedArea);

      return matchesCategory && matchesSearch && matchesArea;
    });
  }, [searchTerm, selectedArea, selectedCategory]);

  return (
    <div className={styles.directoryWrapper}>
      {/* Header Banner */}
      <header className={styles.header}>
        <button type="button" onClick={() => navigate(-1)} className={styles.backBtn}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Overview
        </button>
        <div className={styles.headerMeta}>
          <span className={styles.kicker}>CURATED HIGHLAND GUIDE</span>
          <h1>14 Premier Restaurants & Lounges in Jos</h1>
          <p>
            Explore top-tier culinary dining, executive lounges, garden spots, and vibrant evening nightlife across Plateau State.
          </p>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <div className={styles.filterSection}>
        <div className={styles.searchBox}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by restaurant name, food type, or tags (e.g. Steaks, Rooftop)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.areaFilter}>
          <FontAwesomeIcon icon={faFilter} className={styles.filterIcon} />
          <select 
            value={selectedArea} 
            onChange={(e) => setSelectedArea(e.target.value)}
            className={styles.areaSelect}
          >
            <option value="all">All Neighborhoods in Jos</option>
            <option value="Rayfield">Rayfield Axis</option>
            <option value="GRA">GRA Jos</option>
            <option value="Gold & Base">Gold & Base</option>
            <option value="Old Airport">Old Airport Road</option>
            <option value="Yingi">Yingi / Expressway</option>
            <option value="Central">Jos Central</option>
          </select>
        </div>
      </div>

      {/* Directory Count */}
      <div className={styles.resultMeta}>
        <span>Showing <strong>{filteredPlaces.length}</strong> of 14 Restaurants & Lounges</span>
      </div>

      {/* Directory Grid */}
      <main className={styles.grid}>
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map((place) => (
            <article key={place.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img src={place.image} alt={place.name} className={styles.cardImg} />
                {place.featured && <span className={styles.topBadge}>Featured Spot</span>}
                <span className={styles.neighborhoodTag}>{place.neighborhood}</span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardHeader}>
                  <span className={styles.category}>{place.category}</span>
                  <div className={styles.rating}>
                    <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
                    <strong>{place.rating}</strong> ({place.reviews})
                  </div>
                </div>

                <h3 className={styles.venueTitle}>{place.name}</h3>
                <p className={styles.address}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.mapIcon} /> {place.address}
                </p>

                <div className={styles.tagGroup}>
                  {place.tags.map((tag, idx) => (
                    <span key={idx} className={styles.tagPill}>{tag}</span>
                  ))}
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.priceInfo}>
                    <small>Average Meal</small>
                    <strong>{place.price}</strong>
                  </div>

                  <button 
                    type="button" 
                    onClick={() => navigate(`/places/${place.id}`)}
                    className={styles.detailsBtn}
                  >
                    View & Reserve
                  </button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className={styles.noResults}>
            <h3>No restaurants found matching your criteria</h3>
            <p>Try searching for a different neighborhood or resetting your filters.</p>
            <button 
              type="button" 
              onClick={() => { setSearchTerm(''); setSelectedArea('all'); }} 
              className={styles.resetBtn}
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default RestaurantsDirectory;