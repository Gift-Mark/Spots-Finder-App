import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/HeroSection.module.css';

export const HeroSection = ({
  badgeText,
  title = "Discover the Vibe, Culture, and Beauty of Jos.",
  subtitle = "Your premier guide to the Plateau's vibrant nightlife, lounges, historic landmarks, and breathtaking landscapes.",
  placeholder = "What are you looking for?",
  filterPills = [],
  videoSrc, // Pass video path for Discover page
  heroImage, // Pass image path for Culture page
  onSearch,
  onCategorySelect,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [activePill, setActivePill] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoSrc || !videoRef.current) return undefined;

    const video = videoRef.current;
    const startVideo = () => {
      video.play().catch(() => {});
    };

    video.addEventListener('loadeddata', startVideo);
    video.addEventListener('canplay', startVideo);
    startVideo();

    return () => {
      video.removeEventListener('loadeddata', startVideo);
      video.removeEventListener('canplay', startVideo);
    };
  }, [videoSrc]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchValue, activePill);
  };

  const handlePillClick = (pillId) => {
    const nextActive = activePill === pillId ? null : pillId;
    setActivePill(nextActive);
    if (onCategorySelect) onCategorySelect(nextActive);
  };

  return (
    <section 
      className={styles.heroWrapper}
      style={!videoSrc && heroImage ? { backgroundImage: `url(${heroImage})` } : {}}
    >
      {/* Conditionally render Video element if videoSrc prop exists */}
      {videoSrc && (
        <video 
          ref={videoRef}
          className={styles.videoBackground} 
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Dark Overlay for Text Legibility */}
      <div className={styles.overlay} />

      <div className={styles.heroContainer}>
        {badgeText && <span className={styles.heroBadge}>{badgeText}</span>}

        <h1 className={styles.heroTitle}>{title}</h1>
        <p className={styles.heroSubtitle}>{subtitle}</p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <div className={styles.searchInputGroup}>
            <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
            <input
              type="text"
              placeholder={placeholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              Search
            </button>
          </div>
        </form>

        {/* Dynamic Category Pills */}
        {filterPills.length > 0 && (
          <div className={styles.pillContainer}>
            {filterPills.map((pill) => (
              <button
                key={pill.id}
                type="button"
                className={`${styles.pill} ${activePill === pill.id ? styles.pillActive : ''}`}
                onClick={() => handlePillClick(pill.id)}
              >
                {pill.icon && <FontAwesomeIcon icon={pill.icon} className={styles.pillIcon} />}
                <span>{pill.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;