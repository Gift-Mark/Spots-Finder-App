import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTemperatureLow, faLeaf, faUsers } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/JosNightVibe.module.css';

const vibePoints = [
  {
    icon: faTemperatureLow,
    title: 'Crisp 18°C Nights',
    description: 'Cool mountain breezes make evening outdoor lounge fires and terrace seating cozy year-round.',
  },
  {
    icon: faLeaf,
    title: 'Plateau Botanicals',
    description: 'Cocktails infused with local ingredients: fresh Plateau strawberries, wild mint, and artisan syrups.',
  },
  {
    icon: faUsers,
    title: 'Warm Highland Welcome',
    description: 'Relaxed, hospitable crowds, gentle rhythms, and a vibrant community night scene.',
  },
];

export const JosNightVibe = () => {
  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.sectionCard}>
        <span className={styles.badge}>HIGHLAND NIGHTLIFE CULTURE</span>

        <h2 className={styles.title}>
          The Jos Night Vibe: Why Cool Highland Evenings Hit Different
        </h2>

        <p className={styles.subtitle}>
          Unlike any other nightlife scene in Nigeria, evenings on the Plateau bring crisp temperatures down to 18°C, calling for outdoor stone fire pits and handcrafted botanicals made with sweet Jos strawberries, fresh mint, and local spirits.
        </p>

        <div className={styles.vibeGrid}>
          {vibePoints.map((point, idx) => (
            <div key={idx} className={styles.vibeCard}>
              <div className={styles.iconBox}>
                <FontAwesomeIcon icon={point.icon} />
              </div>
              <h4 className={styles.vibeTitle}>{point.title}</h4>
              <p className={styles.vibeDesc}>{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JosNightVibe;