import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faMapMarkerAlt, 
  faSearch, 
  faFilter, 
  faArrowLeft,
  faFire,
  faClock,
  faUtensils
} from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/FamousSuyaDirectory.module.css';

// Real & Iconic Suya Joints & Grills across Jos, Plateau State
const JOS_SUYA_SPOTS = [
  {
    id: 'sharubutu-suya-king-jos',
    name: 'Sharubutu Suya / Suya King',
    category: 'Traditional Beef & Kilishi',
    neighborhood: 'Ahmadu Bello Way',
    rating: 4.8,
    reviews: 412,
    price: '₦ (₦1,000 - ₦5,000)',
    address: 'Ahmadu Bello Way, Central Axis, Jos',
    hours: '4:00 PM - 11:30 PM',
    tags: ['Beef Suya', 'Kilishi', 'Tozo (Fatty Hump)', 'Mai Shai Tea'],
    image: '/images/sharubutu-suya.jpg',
    specialtyDish: 'Signature Peppered Tozo & Hot Spiced Tea'
  },
  {
    id: 'barcardi-grill-lounge-jos',
    name: 'Barcardi Garden Grill & Lounge',
    category: 'Gourmet Grill & Asun',
    neighborhood: 'GRA Jos',
    rating: 4.6,
    reviews: 290,
    price: '₦₦ (₦4,000 - ₦16,000)',
    address: '11 Dandaura Road, Off Wase Road, GRA, Jos',
    hours: '3:00 PM - 12:00 AM',
    tags: ['Spiced Asun', 'Grilled Fish', 'Chicken Suya', 'Outdoor Garden'],
    image: '/images/barcardi-grill.jpg',
    specialtyDish: 'Charcoal Grilled Tilapia & Smoked Asun'
  },
  {
    id: 'simm3r-night-grill-jos',
    name: 'Simm3r Night Grill',
    category: 'Premium BBQ & Suya Platter',
    neighborhood: 'Gold & Base',
    rating: 4.7,
    reviews: 350,
    price: '₦₦₦ (₦5,000 - ₦22,000)',
    address: '1B Beside Eliel Event Center, Gold & Base, Jos',
    hours: '4:00 PM - 11:00 PM',
    tags: ['Smoked BBQ Ribs', 'Chicken Suya Platter', 'Cocktails'],
    image: '/images/simm3r-grill.jpg',
    specialtyDish: 'Grand Highland BBQ & Suya Combination Platter'
  },
  {
    id: 'rayfield-resort-grill-jos',
    name: 'Rayfield Waterfront BBQ & Suya',
    category: 'Waterfront Fish & Chicken Grill',
    neighborhood: 'Rayfield',
    rating: 4.5,
    reviews: 520,
    price: '₦₦ (₦3,000 - ₦15,000)',
    address: 'Rayfield Resort Road, Rayfield Axis, Jos',
    hours: '2:00 PM - 10:30 PM',
    tags: ['Waterfront View', 'Barbecue Croaker', 'Beef Skewers'],
    image: '/images/rayfield-grill.jpg',
    specialtyDish: 'Whole Grilled Catfish with Yam Chips & Pepper Sauce'
  },
  {
    id: 'bauchi-road-kabonkiri-jos',
    name: 'Bauchi Road Kabonkiri & Suya Spot',
    category: 'Authentic Northern Suya Hub',
    neighborhood: 'Bauchi Road',
    rating: 4.6,
    reviews: 185,
    price: '₦ (₦800 - ₦4,000)',
    address: 'Opposite Unijos Main Campus, Bauchi Road, Jos',
    hours: '5:00 PM - 12:00 AM',
    tags: ['Chicken Kabonkiri', 'Kidney/Liver Skewers', 'Extra Yaji'],
    image: '/images/bauchi-road-suya.jpg',
    specialtyDish: 'Kabonkiri (Whole Spiced Chicken) & Extra Yaji Blend'
  },
  {
    id: 'tin-city-suya-express-jos',
    name: 'Tin City Suya & Shawarma Grill',
    category: 'Modern Grill & Wraps',
    neighborhood: 'GRA Jos',
    rating: 4.4,
    reviews: 210,
    price: '₦₦ (₦2,500 - ₦9,000)',
    address: 'Apollo Crescent Axis, GRA, Jos',
    hours: '3:30 PM - 11:00 PM',
    tags: ['Suya Shawarma', 'Beef Skewers', 'Fast Service'],
    image: '/images/tincity-suya.jpg',
    specialtyDish: 'Double Beef Suya Shawarma with Cheese'
  },
  {
    id: 'crest-hotel-evening-grill-jos',
    name: 'Crest Hotel Garden Suya Deck',
    category: 'Lounge BBQ & Suya',
    neighborhood: 'Old Airport Road',
    rating: 4.5,
    reviews: 175,
    price: '₦₦ (₦3,500 - ₦14,000)',
    address: 'Old Airport Road Axis, Jos',
    hours: '4:00 PM - 11:00 PM',
    tags: ['Hotel Lounge', 'Spiced Goat Meat', 'Live Grill'],
    image: '/images/crest-grill.jpg',
    specialtyDish: 'Slow-Smoked Peppered Goat Suya'
  },
  {
    id: 'tudun-wada-mai-suya-jos',
    name: 'Tudun Wada Junction Suya Spot',
    category: 'Late-Night Neighborhood Suya',
    neighborhood: 'Tudun Wada',
    rating: 4.3,
    reviews: 140,
    price: '₦ (₦500 - ₦3,500)',
    address: 'Tudun Wada Main Junction, Jos',
    hours: '5:00 PM - 1:00 AM',
    tags: ['Late Night', 'Traditional Beef', 'Gizzard Skewers'],
    image: '/images/tudunwada-suya.jpg',
    specialtyDish: 'Hot Beef Hump Suya with Chopped Onions & Cucumber'
  }
];

export const FamousSuyaDirectory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');

  const filteredSpots = useMemo(() => {
    return JOS_SUYA_SPOTS.filter((spot) => {
      const matchesSearch = 
        spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spot.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spot.specialtyDish.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spot.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesArea = 
        selectedArea === 'all' || spot.neighborhood.includes(selectedArea);

      return matchesSearch && matchesArea;
    });
  }, [searchTerm, selectedArea]);

  return (
    <div className={styles.directoryWrapper}>
      {/* Header Banner */}
      <header className={styles.header}>
        <button type="button" onClick={() => navigate(-1)} className={styles.backBtn}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>
        <div className={styles.headerMeta}>
          <span className={styles.kicker}><FontAwesomeIcon icon={faFire} /> EVENING GRILL CULTURE</span>
          <h1>Famous Suya Spots & Grills in Jos</h1>
          <p>
            Experience Jos's legendary evening suya scenes—from iconic street-side *Mai Suya* joints serving hot *Tozo* and *Kabonkiri* to waterfront grills in Rayfield.
          </p>
        </div>
      </header>

      {/* Filter Section */}
      <div className={styles.filterSection}>
        <div className={styles.searchBox}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search suya, dish, or meat type (e.g., Tozo, Asun, Catfish, Shawarma)..."
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
            <option value="Ahmadu Bello Way">Ahmadu Bello Way / Central</option>
            <option value="GRA">GRA Jos</option>
            <option value="Gold & Base">Gold & Base</option>
            <option value="Rayfield">Rayfield Axis</option>
            <option value="Bauchi Road">Bauchi Road</option>
            <option value="Tudun Wada">Tudun Wada</option>
          </select>
        </div>
      </div>

      {/* Results Meta */}
      <div className={styles.resultMeta}>
        <span>Showing <strong>{filteredSpots.length}</strong> Famous Suya & Grill Spots</span>
      </div>

      {/* Grid */}
      <main className={styles.grid}>
        {filteredSpots.length > 0 ? (
          filteredSpots.map((spot) => (
            <article key={spot.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img src={spot.image} alt={spot.name} className={styles.cardImg} />
                <span className={styles.neighborhoodTag}>{spot.neighborhood}</span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardHeader}>
                  <span className={styles.categoryTag}>
                    <FontAwesomeIcon icon={faFire} /> {spot.category}
                  </span>
                  <div className={styles.rating}>
                    <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
                    <strong>{spot.rating}</strong> ({spot.reviews})
                  </div>
                </div>

                <h3 className={styles.venueTitle}>{spot.name}</h3>

                <div className={styles.specialtyHighlight}>
                  <FontAwesomeIcon icon={faUtensils} className={styles.utensilsIcon} />
                  <span><strong>Signature:</strong> {spot.specialtyDish}</span>
                </div>

                <p className={styles.hours}>
                  <FontAwesomeIcon icon={faClock} className={styles.clockIcon} /> {spot.hours}
                </p>

                <p className={styles.address}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.mapIcon} /> {spot.address}
                </p>

                <div className={styles.tagGroup}>
                  {spot.tags.map((tag, idx) => (
                    <span key={idx} className={styles.tagPill}>{tag}</span>
                  ))}
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.priceInfo}>
                    <small>Average Spend</small>
                    <strong>{spot.price}</strong>
                  </div>

                  <button 
                    type="button" 
                    onClick={() => navigate(`/places/${spot.id}`)}
                    className={styles.detailsBtn}
                  >
                    View Grill
                  </button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className={styles.noResults}>
            <h3>No suya spots found matching your search</h3>
            <p>Try searching for "Tozo", "Asun", "Chicken", or resetting your filters.</p>
            <button 
              type="button" 
              onClick={() => { setSearchTerm(''); setSelectedArea('all'); }} 
              className={styles.resetBtn}
            >
              Reset Search
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default FamousSuyaDirectory;