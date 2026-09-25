import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling, faCarrot, faAppleWhole } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/HighlandFarmAdvantage.module.css';
const tevaImage = '/images/Teva.jpg';
const farmChefImage = '/images/image_386a62b7.jpg';

const features = [
  {
    icon: faSeedling,
    title: "Volcanic & High Altitude Soils",
    description: "Rich volcanic soil produces unique vegetables, apples, and herbs found nowhere else in Nigeria."
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
  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.sectionContainer}>
        {/* Left Side Content & Feature List */}
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
        </div>

        {/* Right Side Dual Image Display */}
        <div className={styles.imageGrid}>
          <div className={styles.imageCardLarge}>
            <img 
              src={tevaImage}
              alt="Jos-1 Greenhouse Farm Estate" 
              className={styles.image}
            />
          </div>
          <div className={styles.imageCardSmall}>
            <img 
              src={farmChefImage}
              alt="Chef preparing fresh Jos farm salad" 
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HighlandFarmAdvantage;