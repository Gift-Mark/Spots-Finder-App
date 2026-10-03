import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faMapMarkerAlt, 
  faSearch, 
  faFilter, 
  faArrowLeft,
  faBowlRice,
  faFire
} from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/PlateauBitesDirectory.module.css';

// 15 Authentic Plateau Bites Spots in Jos
const JOS_15_PLATEAU_BITES = [
  {
    id: 'mama-acha-kitchen-rayfield',
    name: 'Mama Acha & Gwote Kitchen',
    specialty: 'Acha Jollof & Herbal Gwote',
    neighborhood: 'Rayfield',
    rating: 4.8,
    reviews: 312,
    price: '₦ (₦1,500 - ₦4,500)',
    address: 'Opposite Rayfield Resort Gate, Rayfield, Jos',
    tags: ['Acha Jollof', 'Gwote Porridge', 'Tuwon Acha'],
    image: '/images/mama-acha.jpg',
    popularDish: 'Thick Gwote with Garden Eggs & Assorted Meat'
  },
  {
    id: 'eliel-garden-local-grills',
    name: 'Eliel Garden & Local Kitchen',
    specialty: 'Highland Peppersoups & Masa',
    neighborhood: 'Gold & Base',
    rating: 4.6,
    reviews: 280,
    price: '₦₦ (₦3,000 - ₦9,000)',
    address: 'Eliel Center Axis, Gold & Base, Jos',
    tags: ['Hot Masa', 'Paya Soup', 'Peppered Goat'],
    image: '/images/eliel-bites.jpg',
    popularDish: 'Masa with Spicy Groundnut Dip & Goat Pepper Soup'
  },
  {
    id: 'millionaires-potato-grid',
    name: 'Millionaires Quarter Irish Potato Grid',
    specialty: 'Grilled Jos Irish Potatoes & Suya',
    neighborhood: 'GRA Jos',
    rating: 4.7,
    reviews: 420,
    price: '₦ (₦1,000 - ₦3,500)',
    address: 'Millionaires Quarter Road, GRA, Jos',
    tags: ['Jos Potatoes', 'Beef Suya', 'Grilled Fish'],
    image: '/images/potato-grid.jpg',
    popularDish: 'Spiced Charcoal-Grilled Irish Potatoes with Kilishi'
  },
  {
    id: 'barcardi-indigenous-corner',
    name: 'Barcardi Afro-Heritage Spot',
    specialty: 'Gourmet Plateau Delicacies',
    neighborhood: 'GRA Jos',
    rating: 4.5,
    reviews: 195,
    price: '₦₦₦ (₦6,000 - ₦15,000)',
    address: '11 Dandaura Road, Off Wase Road, GRA, Jos',
    tags: ['Paya (Cow Foot)', 'Acha Swallow', 'Miyan Taushe'],
    image: '/images/barcardi-heritage.jpg',
    popularDish: 'Acha Swallow with Miyan Zogale (Moringa Soup)'
  },
  {
    id: 'tudun-wada-masa-hub',
    name: 'Tudun Wada Heritage Masa Spot',
    specialty: 'Traditional Rice & Corn Masa',
    neighborhood: 'Tudun Wada / Central',
    rating: 4.7,
    reviews: 510,
    price: '₦ (₦800 - ₦2,500)',
    address: 'Tudun Wada Main Junction, Jos Central',
    tags: ['Fresh Masa', 'Vegetable Soup', 'Kilishi'],
    image: '/images/tudun-masa.jpg',
    popularDish: 'Golden Fluffy Masa with Miyan Taushe'
  },
  {
    id: 'rayfield-golf-club-suya-lounge',
    name: 'Rayfield Golf Club Suya & Potato Joint',
    specialty: 'Plateau Grills & Highland Soups',
    neighborhood: 'Rayfield',
    rating: 4.6,
    reviews: 230,
    price: '₦₦ (₦3,500 - ₦10,000)',
    address: 'Rayfield Golf Course Grounds, Rayfield, Jos',
    tags: ['Kilishi', 'Peppered Potatoes', 'Goat Head (Isi Ewu)'],
    image: '/images/golf-suya.jpg',
    popularDish: 'Plateau Fresh Potato Fries with Spicy Suya Kraut'
  },
  {
    id: 'buka-de-plateau',
    name: 'Buka De Plateau',
    specialty: 'Swallows & Native Soups',
    neighborhood: 'Old Airport Road',
    rating: 4.4,
    reviews: 185,
    price: '₦ (₦2,000 - ₦5,000)',
    address: 'Near Crest Hotel Junction, Old Airport Road, Jos',
    tags: ['Tuwon Masara', 'Miyan Kuka', 'Bush Meat'],
    image: '/images/buka-plateau.jpg',
    popularDish: 'Tuwon Shinkafa with Spicy Miyan Zogale'
  },
  {
    id: 'yosef-gwote-spot',
    name: 'Yosef Gwote & Local Delicacies',
    specialty: 'Traditional Grain Porridges',
    neighborhood: 'Anglo Jos',
    rating: 4.5,
    reviews: 160,
    price: '₦ (₦1,200 - ₦3,000)',
    address: 'Anglo Jos Industrial Layout, Jos',
    tags: ['Gwote', 'Kunun Acha', 'Boiled Yams'],
    image: '/images/gwote-spot.jpg',
    popularDish: 'Rich Vegetable Gwote with Sliced Smoked Fish'
  },
  {
    id: 'kabong-potato-market-buka',
    name: 'Kabong Potato Market Buka',
    specialty: 'Farm-Fresh Potato Specials',
    neighborhood: 'Kabong / Rukuba Rd',
    rating: 4.6,
    reviews: 340,
    price: '₦ (₦1,000 - ₦3,000)',
    address: 'Kabong Market Axis, Rukuba Road, Jos',
    tags: ['Peppered Potato', 'Fried Plantain', 'Beef Kebab'],
    image: '/images/kabong-buka.jpg',
    popularDish: 'Spicy Potato Mash with Fish Pepper Soup'
  },
  {
    id: 'zias-local-kitchen',
    name: 'Zia’s Indigenous Kitchen',
    specialty: 'Comfort Plateau Meals',
    neighborhood: 'GRA Jos',
    rating: 4.4,
    reviews: 145,
    price: '₦₦ (₦2,500 - ₦7,000)',
    address: 'Apollo Crescent, GRA, Jos',
    tags: ['Acha Pudding', 'Fresh Juices', 'Spicy Fish'],
    image: '/images/zias-kitchen.jpg',
    popularDish: 'Acha Jollof with Grilled Croaker Fish'
  },
  {
    id: 'terminus-suya-kilishi-bazaar',
    name: 'Terminus Kilishi & Grills Bazaar',
    specialty: 'Dry Cured Meats & Kilishi',
    neighborhood: 'Jos Central',
    rating: 4.8,
    reviews: 620,
    price: '₦ (₦1,500 - ₦6,000)',
    address: 'Terminus Commercial Center, Jos Central',
    tags: ['Plateau Kilishi', 'Beef Suya', 'Spiced Offals'],
    image: '/images/terminus-kilishi.jpg',
    popularDish: 'Authentic Honey-Glazed Beef Kilishi'
  },
  {
    id: 'lamonde-native-buka',
    name: 'Lamonde Native Buka',
    specialty: 'Traditional Soups & Swallows',
    neighborhood: 'Apollo Crescent / GRA',
    rating: 4.3,
    reviews: 110,
    price: '₦₦ (₦2,500 - ₦6,500)',
    address: 'Near Lamonde Hotel, Apollo Crescent, GRA, Jos',
    tags: ['Pounded Yam', 'Acha Swallow', 'Miyan Taushe'],
    image: '/images/lamonde-buka.jpg',
    popularDish: 'Pounded Yam with Pumpkin Seed (Taushe) Soup'
  },
  {
    id: 'chollom-masa-garden',
    name: 'Chollom’s Masa & Pepper Soup Garden',
    specialty: 'Evening Masa & Paya',
    neighborhood: 'Gold & Base',
    rating: 4.5,
    reviews: 215,
    price: '₦ (₦1,500 - ₦4,000)',
    address: 'Gold & Base Express Way, Jos',
    tags: ['Rice Masa', 'Cow Leg Soup', 'Chilled Drinks'],
    image: '/images/chollom-masa.jpg',
    popularDish: 'Crispy Pan-Fried Masa with Cow Leg Peppersoup'
  },
  {
    id: 'bukuru-highland-grills',
    name: 'Bukuru Highland Potato & Fish Spot',
    specialty: 'Open-Air Potato Grills',
    neighborhood: 'Bukuru Axis',
    rating: 4.4,
    reviews: 190,
    price: '₦ (₦1,200 - ₦3,800)',
    address: 'Bukuru Express Junction, Jos South',
    tags: ['Grilled Potato', 'Catfish BBQ', 'Spicy Dip'],
    image: '/images/bukuru-grills.jpg',
    popularDish: 'Charcoal-Baked Jos Irish Potatoes with Grilled Catfish'
  },
  {
    id: 'plateau-hotel-heritage-buka',
    name: 'Plateau Hotel Heritage Kitchen',
    specialty: 'Classic Middle-Belt Cuisine',
    neighborhood: 'Jos Central',
    rating: 4.2,
    reviews: 105,
    price: '₦₦ (₦2,000 - ₦6,000)',
    address: 'Tudun Wada Road, Jos Metropolis',
    tags: ['Tuwon Masara', 'Pepper Soup', 'Local Grills'],
    image: '/images/plateau-heritage.jpg',
    popularDish: 'Tuwon Masara with Fresh Spinach & Fish Soup'
  }
];

export const PlateauBitesDirectory = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');

  const filteredPlaces = useMemo(() => {
    return JOS_15_PLATEAU_BITES.filter((place) => {
      const matchesSearch = 
        place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.popularDish.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesArea = 
        selectedArea === 'all' || place.neighborhood.includes(selectedArea);

      return matchesSearch && matchesArea;
    });
  }, [searchTerm, selectedArea]);

  return (
    <div className={styles.directoryWrapper}>
      {/* Header Banner */}
      <header className={styles.header}>
        <button type="button" onClick={() => navigate(-1)} className={styles.backBtn}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Dining Styles
        </button>
        <div className={styles.headerMeta}>
          <span className={styles.kicker}>LOCAL CULINARY HERITAGE</span>
          <h1>15 Authentic Plateau Bites Spots in Jos</h1>
          <p>
            Experience true Jos flavor—from hot Masa, spicy herbal Gwote, and Acha Jollof to charcoal-grilled Jos Irish potatoes and Kilishi.
          </p>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <div className={styles.filterSection}>
        <div className={styles.searchBox}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search dish (e.g. Gwote, Masa, Potato), area, or spot name..."
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
            <option value="Tudun Wada">Tudun Wada / Central</option>
            <option value="Old Airport">Old Airport Road</option>
            <option value="Bukuru">Bukuru Axis</option>
          </select>
        </div>
      </div>

      {/* Directory Count */}
      <div className={styles.resultMeta}>
        <span>Showing <strong>{filteredPlaces.length}</strong> of 15 Plateau Bites Spots</span>
      </div>

      {/* Directory Grid */}
      <main className={styles.grid}>
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map((place) => (
            <article key={place.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img src={place.image} alt={place.name} className={styles.cardImg} />
                <span className={styles.neighborhoodTag}>{place.neighborhood}</span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardHeader}>
                  <span className={styles.specialtyTag}>
                    <FontAwesomeIcon icon={faBowlRice} /> {place.specialty}
                  </span>
                  <div className={styles.rating}>
                    <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
                    <strong>{place.rating}</strong> ({place.reviews})
                  </div>
                </div>

                <h3 className={styles.venueTitle}>{place.name}</h3>
                
                <div className={styles.popularHighlight}>
                  <FontAwesomeIcon icon={faFire} className={styles.fireIcon} />
                  <span><strong>Must Try:</strong> {place.popularDish}</span>
                </div>

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
                    <small>Average Price</small>
                    <strong>{place.price}</strong>
                  </div>

                  <button 
                    type="button" 
                    onClick={() => navigate(`/places/${place.id}`)}
                    className={styles.detailsBtn}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className={styles.noResults}>
            <h3>No local spots found matching your search</h3>
            <p>Try searching for dish names like "Acha", "Masa", or "Gwote".</p>
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

export default PlateauBitesDirectory;