import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling, faCarrot, faAppleWhole, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FarmFreshModal } from './FarmFreshModal';
import styles from '../CSS/HighlandFarmAdvantage.module.css';

const tevaImage = '/images/Teva.jpg';
const farmChefImage = '/images/image_386a62b7.jpg';

const features = [
  {
    icon: faSeedling,
    title: "Volcanic & High Altitude Soils",
    description: "Rich volcanic soil produces unique vegetables, strawberries, and herbs found nowhere else in Nigeria."
  },
  {
    icon: faCarrot,
    title: "Plateau Root Crops & Vegetables",
    description: "Daily harvest of Irish potatoes, carrots, beetroot, and crisp leafy greens direct to local kitchens."
  },
  {
    icon: faAppleWhole,
    title: "Ethical Highland Livestock",
    description: "Grass-fed beef and dairy sourced directly from local Plateau cattle farms for unmatched freshness."
  }
];

export const HighlandFarmAdvantage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSpotSelect = (spotId) => {
    setIsModalOpen(false);
    navigate(`/place/${spotId}`);
  };

  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.sectionContainer}>
        <div className={styles.textContent}>
          <span className={styles.badge}>HIGHLAND FARM-TO-TABLE</span>
          
          <h2 className={styles.title}>
            The Highland Advantage: Jos Farm-to-Table Freshness
          </h2>
          
          <p className={styles.subtitle}>
            The unique temperate climate and altitude of Plateau State allow local farms to cultivate produce rarely found elsewhere in West Africa. Local restaurants leverage this daily, serving ingredients harvested hours before reaching your plate.
          </p>

          <div className={styles.featureList}>
            {features.map((item, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.iconBox}>
                  <FontAwesomeIcon icon={item.icon} />
                </div>
                <div>
                  <h4 className={styles.featureTitle}>{item.title}</h4>
                  <p className={styles.featureDesc}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.actionRow}>
            {/* Triggers Option 3 Modal */}
            <button 
              type="button" 
              className={styles.ctaButton}
              onClick={() => setIsModalOpen(true)}
            >
              Explore Farm-Fresh Places <FontAwesomeIcon icon={faArrowRight} />
            </button>
            
            <div className={styles.stats}>
              <div>
                <strong>1,200m+</strong>
                <span>Plateau Altitude</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>Fresh Local Produce</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.imageGrid}>
          <div className={styles.imageCardLarge}>
            <img src={tevaImage} alt="Jos Greenhouse Farm Estate" className={styles.image} />
          </div>
          <div className={styles.imageCardSmall}>
            <img src={farmChefImage} alt="Chef preparing fresh Jos farm salad" className={styles.image} />
          </div>
        </div>
      </div>

      {/* Render Option 3 Modal */}
      <FarmFreshModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSelectSpot={handleSpotSelect}
      />
    </section>
  );
};

export default HighlandFarmAdvantage;