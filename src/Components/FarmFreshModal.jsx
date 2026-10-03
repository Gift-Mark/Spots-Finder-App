import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faStar, 
  faMapMarkerAlt, 
  faUtensils, 
  faSeedling,
  faArrowRight 
} from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/FarmFreshModal.module.css';

// Featured farm-to-table venues in Jos
const FARM_FRESH_SPOTS = [
  {
    id: 'valada-jos',
    name: 'Valada Restaurant',
    tagline: '100% Traditional Plateau Cuisine',
    rating: '4.0',
    reviews: '1,160+',
    address: 'Bukuru Express, Opposite NASCO, Jos',
    farmHighlights: ['Fresh Gwete (Vegetable-grain soup)', 'Fresh local Masa with hot pepper sauce', 'Plateau highland herbal tea blends'],
    specialty: 'Traditional Gwete made with daily harvested indigenous greens',
    image: '/images/Valada.jpg'
  },
  {
    id: 'simm3r-bistro-jos',
    name: 'Simm3r Restaurant & Café',
    tagline: 'Highland Garden & Artisan Bistro',
    rating: '4.7',
    reviews: '320+',
    address: 'Beside Eliel Event Center, Gold & Base, Jos',
    farmHighlights: ['Crisp Jos-grown organic salads', 'House-made strawberry preserves & glazes', 'Fresh highland rosemary & thyme infused dishes'],
    specialty: 'Highland Garden Salad with Jos organic carrots & beetroot',
    image: '/images/Simm3r.jpg'
  },
  {
    id: 'barcardi-jos',
    name: 'Barcardi Garden Grill',
    tagline: 'Fresh Garden Dining & BBQ',
    rating: '4.6',
    reviews: '290+',
    address: '11 Dandaura Road, GRA, Jos',
    farmHighlights: ['Grass-fed Plateau cattle & goat cuts', 'Farm-fresh bell pepper & onion skewers', 'Fresh squeezed local fruit juices'],
    specialty: 'Charcoal Smoked Asun served with crisp farm vegetables',
    image: '/images/Barcardi.jpg'
  }
];

export const FarmFreshModal = ({ isOpen, onClose, onSelectSpot }) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className={styles.modalHeader}>
          <div>
            <span className={styles.kicker}>
              <FontAwesomeIcon icon={faSeedling} /> HIGHLAND HARVEST
            </span>
            <h2 className={styles.title}>Farm-Fresh Spots in Jos</h2>
            <p className={styles.subtitle}>
              Venues serving daily harvests directly from Plateau State farms.
            </p>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </header>

        {/* Modal Body - Spot Cards */}
        <div className={styles.modalBody}>
          {FARM_FRESH_SPOTS.map((spot) => (
            <div key={spot.id} className={styles.spotCard}>
              <div className={styles.imageWrapper}>
                <img src={spot.image} alt={spot.name} className={styles.spotImage} />
                <div className={styles.ratingBadge}>
                  <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
                  <span>{spot.rating}</span>
                  <small>({spot.reviews})</small>
                </div>
              </div>

              <div className={styles.cardContent}>
                <div className={styles.titleRow}>
                  <h3 className={styles.spotName}>{spot.name}</h3>
                  <span className={styles.tagline}>{spot.tagline}</span>
                </div>

                <p className={styles.address}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.mapIcon} /> {spot.address}
                </p>

                <div className={styles.specialtyBox}>
                  <FontAwesomeIcon icon={faUtensils} className={styles.utensilsIcon} />
                  <span><strong>Signature Dish:</strong> {spot.specialty}</span>
                </div>

                <div className={styles.farmHighlights}>
                  <span className={styles.highlightTitle}>Farm-to-Table Features:</span>
                  <ul>
                    {spot.farmHighlights.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <button 
                  type="button" 
                  className={styles.viewBtn}
                  onClick={() => {
                    if (onSelectSpot) onSelectSpot(spot.id);
                    onClose();
                  }}
                >
                  View Details & Menu <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FarmFreshModal;