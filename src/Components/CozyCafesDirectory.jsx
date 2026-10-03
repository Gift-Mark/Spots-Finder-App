import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faMapMarkerAlt, 
  faSearch, 
  faFilter, 
  faArrowLeft,
  faMugHot
} from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/CozyCafes.module.css';

// Verified Real-World Cafes & Breakfast Spots in Jos, Plateau State
const REAL_JOS_CAFES = [
  {
    id: 'simm3r-cafe-jos',
    name: 'Simm3r Restaurant & Café',
    specialty: 'English Breakfast & Espresso Bar',
    neighborhood: 'Gold & Base',
    rating: 4.7,
    reviews: 320,
    price: '₦₦₦ (₦5,000 - ₦18,000)',
    address: '1B Beside Eliel Event Center, Gold & Base, Jos',
    tags: ['Full English Breakfast', 'Espresso', 'Outdoor Patio'],
    image: '/images/simm3r-cafe.jpg',
    popularDish: 'English Breakfast Platter & Sizzling Brownie'
  },
  {
    id: 'barcardi-cafe-jos',
    name: 'Barcardi Restaurant & Café',
    specialty: 'Highland Garden Brunch & Juices',
    neighborhood: 'GRA Jos',
    rating: 4.5,
    reviews: 232,
    price: '₦₦ (₦3,500 - ₦14,000)',
    address: '11 Dandaura Road, Off Wase Road, GRA, Jos',
    tags: ['Garden Seating', 'Breakfast Platters', 'Smoothies'],
    image: '/images/barcardi-cafe.jpg',
    popularDish: 'Loaded Omelette & Fresh Juice'
  },
  {
    id: 'tin-city-cafe-jos',
    name: 'Tin City Cafe',
    specialty: 'Specialty Coffee & Light Bites',
    neighborhood: 'GRA Jos',
    rating: 4.5,
    reviews: 322,
    price: '₦₦ (₦2,500 - ₦10,000)',
    address: '37A Apollo Crescent, GRA, Jos',
    tags: ['Work Friendly', 'Milkshakes', 'Sandwiches'],
    image: '/images/tincity-cafe.jpg',
    popularDish: 'Club Sandwich & Brewed Iced Coffee'
  },
  {
    id: 'tures-masa-jos',
    name: 'Ture’s Masa',
    specialty: 'Traditional Northern Breakfast',
    neighborhood: 'New Zaria Terrace',
    rating: 4.3,
    reviews: 85,
    price: '₦ (₦1,000 - ₦4,000)',
    address: 'No 10 New Zaria Terrace, Jos',
    tags: ['Hot Masa', 'Local Cuisine', 'Quick Morning Stop'],
    image: '/images/tures-masa.jpg',
    popularDish: 'Fresh Masa with Beef & Pepper Sauce'
  },
  {
    id: 'frentch-bakery-jos',
    name: 'Frentch Bakery',
    specialty: 'Fresh Pastries & Morning Roasts',
    neighborhood: 'Ahmadu Bello Way',
    rating: 4.2,
    reviews: 148,
    price: '₦ (₦1,500 - ₦6,000)',
    address: '16 Ahmadu Bello Way, Jos Central',
    tags: ['Fresh Bakery', 'Takeaway', 'Meat Pies & Tea'],
    image: '/images/frentch-bakery.jpg',
    popularDish: 'Meat Pie & Hot Milk Coffee'
  },
  {
    id: 'the-net-cafe-jos',
    name: 'The Net Café',
    specialty: 'Casual Breakfast & City Center Coffee',
    neighborhood: 'Ahmadu Bello Way',
    rating: 4.1,
    reviews: 736,
    price: '₦ (₦2,000 - ₦8,000)',
    address: '25 Ahmadu Bello Way, Jos Central',
    tags: ['Central Location', 'Quick Breakfast', 'Juices'],
    image: '/images/net-cafe.jpg',
    popularDish: 'Pancake Breakfast & Hot Tea'
  },
  {
    id: 'fuzion-cafe-jos',
    name: 'Fuzion Café',
    specialty: 'Modern Fusion Bites & Coffee',
    neighborhood: 'Rayfield',
    rating: 4.4,
    reviews: 95,
    price: '₦₦ (₦3,000 - ₦12,000)',
    address: 'Rayfield Axis, Jos',
    tags: ['Cozy Atmosphere', 'Mocktails', 'Light Meals'],
    image: '/images/fuzion-cafe.jpg',
    popularDish: 'Chicken Wrap & Latte'
  },
  {
    id: 'steam-fast-jos',
    name: 'Steam Fast',
    specialty: 'Fast-Service Breakfast & Drinks',
    neighborhood: 'Tudun Wada',
    rating: 4.0,
    reviews: 110,
    price: '₦ (₦1,500 - ₦5,000)',
    address: '6 Tudun Wada Road, Jos',
    tags: ['Quick Service', 'Breakfast Combos', 'Takeaway'],
    image: '/images/steam-fast.jpg',
    popularDish: 'Breakfast Egg Roll & Tea'
  }
];

export const CozyCafesDirectory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');

  const filteredCafes = useMemo(() => {
    return REAL_JOS_CAFES.filter((cafe) => {
      const matchesSearch = 
        cafe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cafe.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cafe.popularDish.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cafe.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesArea = 
        selectedArea === 'all' || cafe.neighborhood.includes(selectedArea);

      return matchesSearch && matchesArea;
    });
  }, [searchTerm, selectedArea]);

  return (
    <div className={styles.directoryWrapper}>
      <header className={styles.header}>
        <button type="button" onClick={() => navigate(-1)} className={styles.backBtn}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>
        <div className={styles.headerMeta}>
          <span className={styles.kicker}>REAL-WORLD JOS SPOTS</span>
          <h1>Cafes & Breakfast Places in Jos</h1>
          <p>
            Explore real spots across Jos—from artisanal espresso at Simm3r in Gold & Base to traditional morning masa at New Zaria Terrace.
          </p>
        </div>
      </header>

      <div className={styles.filterSection}>
        <div className={styles.searchBox}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search cafe name, dish (e.g., Masa, Pancakes, Espresso)..."
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
            <option value="Gold & Base">Gold & Base</option>
            <option value="GRA">GRA Jos</option>
            <option value="Ahmadu Bello Way">Ahmadu Bello Way / Central</option>
            <option value="Rayfield">Rayfield</option>
          </select>
        </div>
      </div>

      <main className={styles.grid}>
        {filteredCafes.map((cafe) => (
          <article key={cafe.id} className={styles.card}>
            <div className={styles.cardBody}>
              <div className={styles.cardHeader}>
                <span className={styles.specialtyTag}>
                  <FontAwesomeIcon icon={faMugHot} /> {cafe.specialty}
                </span>
                <div className={styles.rating}>
                  <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
                  <strong>{cafe.rating}</strong> ({cafe.reviews})
                </div>
              </div>

              <h3 className={styles.venueTitle}>{cafe.name}</h3>
              <p className={styles.address}>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> {cafe.address}
              </p>

              <div className={styles.popularHighlight}>
                <span><strong>Popular:</strong> {cafe.popularDish}</span>
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.priceInfo}>{cafe.price}</span>
                <button 
                  type="button" 
                  onClick={() => navigate(`/places/${cafe.id}`)}
                  className={styles.detailsBtn}
                >
                  View Details
                </button>
              </div>
            </div>
          </article>
        ))}
      </main>
    </div>
  );
};

export default CozyCafesDirectory;