import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faMapMarkerAlt, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/HeritageGrid.module.css';
import josMuseumImage from '../assets/images/Jos Museum.jpg';
import nokImage from '../assets/images/Nok.jpg';
import riyomRockImage from '../assets/images/Riyom-Rock-2-768x513.jpg';
import nzemBeromImage from '../assets/images/nzem berom.jpg';
import motnaImage from '../assets/images/MOTNA.jpg';

// Mock/Default data matching the design screenshot
const defaultItems = [
  {
    id: 'jos-museum',
    title: 'Jos National Museum',
    type: 'featured',
    category: 'Museum',
    rating: '4.9',
    ratingLabel: 'Heritage Rating',
    description:
      'One of the oldest and most important museums in Nigeria, housing significant Nok terracotta artifacts and a vast collection of traditional...',
    image: josMuseumImage,
    link: '/culture/jos-museum',
  },
  {
    id: 'nok-terracottas',
    title: 'The Nok Terracottas',
    type: 'artifact',
    category: 'Artifacts',
    description:
      'Discover the enigmatic clay figures that date back to 500 BC, representing one of the earliest known sculptural traditions in...',
    subtext: 'Museum Gallery',
    image: nokImage,
    link: '/culture/nok-terracottas',
  },
  {
    id: 'riyom-rock',
    title: 'Riyom Rock',
    type: 'card',
    category: 'Historical Site',
    description:
      'A natural wonder and historical landmark that perfectly resembles the map of Plateau state, standing as a testament to geologic...',
    location: 'Riyom Local Govt',
    image: riyomRockImage,
    link: '/culture/riyom-rock',
  },
  {
    id: 'nzem-berom',
    title: 'Nzem Berom',
    type: 'card',
    category: 'Traditional Festival',
    description:
      "Experience the vibrant colors, music, and dance of the Berom people's annual cultural festival, celebrating harvest and heritage.",
    date: 'Coming in May',
    image: nzemBeromImage,
    link: '/culture/nzem-berom',
  },
  {
    id: 'motna',
    title: 'MOTNA',
    type: 'card',
    category: 'Architecture',
    description:
      'Wander through full-scale replicas of major Nigerian architectural styles, from the Katsina Palace to traditional Mbari houses.',
    location: 'Museum Complex',
    image: motnaImage,
    link: '/culture/motna',
  },
];

export const HeritageGrid = ({ items = defaultItems, onLoadMore }) => {
  const featuredItem = items.find((i) => i.type === 'featured') || items[0];
  const artifactItem = items.find((i) => i.type === 'artifact') || items[1];
  const standardItems = items.filter(
    (i) => i.id !== featuredItem?.id && i.id !== artifactItem?.id
  );

  return (
    <section className={styles.gridSection}>
      {/* Top Row: Featured Main Hero Card + Artifact Card */}
      <div className={styles.topRow}>
        {/* Featured Big Card */}
        {featuredItem && (
          <div className={styles.featuredCard}>
            <img src={featuredItem.image} alt={featuredItem.title} />
            <div className={styles.featuredOverlay}>
              <div className={styles.badgeRow}>
                <span className={styles.badge}>{featuredItem.category}</span>
                {featuredItem.rating && (
                  <span className={styles.ratingBadge}>
                    <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
                    {featuredItem.rating} {featuredItem.ratingLabel}
                  </span>
                )}
              </div>
              <h3>{featuredItem.title}</h3>
              <p>{featuredItem.description}</p>
              <Link to={featuredItem.link} className={styles.exploreBtn}>
                Explore Details &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* Side Artifact Card */}
        {artifactItem && (
          <div className={styles.sideArtifactCard}>
            <div className={styles.artifactImageWrapper}>
              <img src={artifactItem.image} alt={artifactItem.title} />
            </div>
            <div className={styles.artifactContent}>
              <span className={styles.badgeLight}>{artifactItem.category}</span>
              <h3>{artifactItem.title}</h3>
              <p>{artifactItem.description}</p>
              {artifactItem.subtext && (
                <span className={styles.metaSubtext}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} /> {artifactItem.subtext}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Row: 3-Column Standard Cards */}
      <div className={styles.bottomGrid}>
        {standardItems.map((item) => (
          <div key={item.id} className={styles.standardCard}>
            <div className={styles.cardImageWrapper}>
              <img src={item.image} alt={item.title} />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.badgeLight}>{item.category}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>

              <div className={styles.cardFooter}>
                {item.location && (
                  <span className={styles.metaText}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> {item.location}
                  </span>
                )}
                {item.date && (
                  <span className={styles.metaTextHighlight}>
                    <FontAwesomeIcon icon={faCalendarAlt} /> {item.date}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button Action */}
      <div className={styles.loadMoreContainer}>
        <button type="button" className={styles.loadMoreBtn} onClick={onLoadMore}>
          Load More Heritage Sites
        </button>
      </div>
    </section>
  );
};

export default HeritageGrid;