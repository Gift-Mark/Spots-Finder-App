import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faMapMarkerAlt, 
  faArrowRight, 
  faCalendarPlus, 
  faTicketAlt, 
  faCheckCircle,
  faUserGroup,
  faCamera,
  faBookmark as faBookmarkSolid
} from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import { AudioProvider } from './AudioPlayerContent';
import { useItinerary } from './itineraryContext';
import { FestivalCountdown } from "./FestivalCountdown";
import { GuideBookingModal } from "./GuideBookingModal";
import { UserReviewModal } from "./UserReviewModal";
import { VirtualTourModal } from "./VirtualTourModal";
import { getGoogleCalendarUrl, downloadIcsFile } from "../utils/calendarHelpers";
import { calculateDistance } from '../utils/haversine';
import styles from '../CSS/HeritageGrid.module.css';

const baseCategories = [
  { id: 'all', label: 'All Sites' },
  { id: 'Historical Site', label: 'Historical Sites' },
  { id: 'Museum', label: 'Museums' },
  { id: 'Traditional Festival', label: 'Traditional Festivals' },
  { id: 'Architecture', label: 'Architecture' },
  { id: 'Artifacts', label: 'Artifacts' }
];

const heritageData = [
  {
    id: "jos-museum",
    title: "Jos National Museum",
    category: "Museum",
    rating: 4.9,
    location: "Jos Central",
    description: "One of the oldest and most important museums in Nigeria, housing significant Nok terracotta artifacts and a vast collection of traditional pottery.",
    image: "/images/Jos Museum.jpg",
    coordinates: { lat: 9.9167, lng: 8.8833 },
    audioUrl: "/audio/jos-museum-guide.mp3",
    audioDuration: "2:45",
    isFeatured: true
  },
  {
    id: "nok-terracottas",
    title: "The Nok Terracottas",
    category: "Artifacts",
    rating: 4.8,
    location: "Museum Gallery",
    description: "Discover the enigmatic clay figures that date back to 500 BC, representing one of the earliest known sculptural traditions in West Africa.",
    image: "/images/Nok.jpg",
    coordinates: { lat: 9.9175, lng: 8.8840 },
    audioUrl: "/audio/nok-terracottas-guide.mp3",
    audioDuration: "2:15",
    isSideArtifact: true
  },
  {
    id: "riyom-rock",
    title: "Riyom Rock",
    category: "Historical Site",
    rating: 4.8,
    location: "Riyom Local Govt",
    description: "A natural wonder and historical landmark that perfectly resembles the map of Plateau state, standing as a testament to geologic beauty.",
    image: "/images/Riyom Rock.jpg",
    coordinates: { lat: 9.6382, lng: 8.7569 },
    audioUrl: "/audio/riyom-rock-guide.mp3",
    audioDuration: "1:45"
  },
  {
    id: "nzem-berom",
    title: "Nzem Berom",
    category: "Traditional Festival",
    rating: 4.9,
    location: "Rwang Pam Stadium",
    description: "Experience the vibrant colors, music, and dance of the Berom people's annual cultural festival, celebrating harvest and heritage.",
    image: "/images/nzem berom.jpg",
    coordinates: { lat: 9.9231, lng: 8.8911 },
    audioUrl: "/audio/nzem-berom-guide.mp3",
    audioDuration: "2:50",
    isFestival: true,
    startDate: "2027-04-16T09:00:00",
    endDate: "2027-04-18T18:00:00",
    dateString: "April 16–18, 2027",
    isFree: true
  },
  {
    id: "motna",
    title: "MOTNA",
    category: "Architecture",
    rating: 4.7,
    location: "Museum Complex",
    description: "Wander through full-scale replicas of major Nigerian architectural styles, from the Katsina Palace to traditional Mbari houses.",
    image: "/images/MOTNA.jpg",
    coordinates: { lat: 9.9150, lng: 8.8820 },
    audioUrl: "/audio/motna-guide.mp3",
    audioDuration: "3:10",
    has360Tour: true,
    panoramaUrl: "https://pannellum.org/images/alma.jpg"
  }
];
const MORE_SITES = [
  {
    id: "mazah-waterfall",
    title: "Mazah Waterfall",
    category: "Nature & Hiking",
    rating: 4.8,
    location: "Mazah, Jos North",
    description: "Scenic highland streams and waterfall trail tucked inside the Jarawa hills.",
    coordinates: { lat: 9.9550, lng: 8.9000 },
    image: "/images/Mazah waterfall.webp"
  },
  {
    id: "jos-wildlife-park",
    title: "Jos Wildlife Park",
    category: "Wildlife Sanctuary",
    rating: 4.6,
    location: "Tudun Wada / Dong",
    description: "Sprawling pine forest sanctuary housing lions, primates, and picnic grounds.",
    coordinates: { lat: 9.8460, lng: 8.8910 },
    image: "/images/wildlife park.jpg"
  },
  {
    id: "assop-falls",
    title: "Assop Waterfalls",
    category: "Nature & Waterfalls",
    rating: 4.8,
    location: "Hawan Kibo, Riyom",
    description: "Cascading waters tumbling over rugged granite rocks along Hawan Kibo escarpment.",
    coordinates: { lat: 9.5900, lng: 8.7200 },
    image: "/images/assop falls.webp"
  },
  {
    id: "shere-hills",
    title: "Shere Hills Peak",
    category: "Mountain Hiking",
    rating: 4.9,
    location: "Jos East Axis",
    description: "Highland peaks offering panoramic views, rock climbing, and adventure trails.",
    coordinates: { lat: 9.9700, lng: 9.0100 },
    image: "/images/Shere hills hike.jpg"
  },
  {
    id: "solomon-lar-park",
    title: "Solomon Lar Park",
    category: "Parks & Recreation",
    rating: 4.6,
    location: "State Lowcost, Jos",
    description: "Serene tree-lined park ideal for family relaxation and outdoor photography.",
    coordinates: { lat: 9.9270, lng: 8.8900 },
    image: "/images/solomon lar.jpg"
  }
];

function FestivalCardActions({ spot }) {
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  const handleRsvp = (e) => {
    e.stopPropagation();
    setRsvpSuccess(true);
    setTimeout(() => setRsvpSuccess(false), 4000);
  };

  const handleCalendarClick = (e) => {
    e.stopPropagation();
    setShowCalendarMenu((prev) => !prev);
  };

  return (
    <div className={styles.festivalActionsWrapper} onClick={(e) => e.stopPropagation()}>
      {rsvpSuccess && (
        <div className={styles.rsvpSuccessBanner}>
          <FontAwesomeIcon icon={faCheckCircle} /> Pass Reserved! Ticket sent to your device.
        </div>
      )}

      <div className={styles.actionButtonGroup}>
        <button type="button" className={styles.rsvpBtn} onClick={handleRsvp}>
          <FontAwesomeIcon icon={faTicketAlt} />
          <span>{spot.isFree ? "Reserve Pass" : "Buy Ticket"}</span>
        </button>

        <div className={styles.calendarDropdownWrapper}>
          <button type="button" className={styles.calendarBtn} onClick={handleCalendarClick}>
            <FontAwesomeIcon icon={faCalendarPlus} />
            <span>Calendar</span>
          </button>

          {showCalendarMenu && (
            <div className={styles.calendarMenu}>
              <a
                href={getGoogleCalendarUrl(spot)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowCalendarMenu(false)}
              >
                📅 Google Calendar
              </a>
              <button
                type="button"
                onClick={() => {
                  downloadIcsFile(spot);
                  setShowCalendarMenu(false);
                }}
              >
                🍏 Apple / Outlook (.ics)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HeritageGridContent({ 
  searchQuery, 
  selectedCategory: externalCategory, 
  onCategorySelect, 
  userLocation,
  onLoadMore 
}) {
  const navigate = useNavigate();
  const { isBookmarked, toggleBookmark } = useItinerary();

  const [internalCategory, setInternalCategory] = useState('all');
  const [loadedMoreSites, setLoadedMoreSites] = useState([]);
  const [activeGuideSpot, setActiveGuideSpot] = useState(null);
  const [activeReviewSpot, setActiveReviewSpot] = useState(null);
  const [activeTourSpot, setActiveTourSpot] = useState(null);

  const allSites = useMemo(() => [...heritageData, ...loadedMoreSites], [loadedMoreSites]);

  const activeCategory = externalCategory !== undefined ? externalCategory : internalCategory;

  const handlePillClick = (catId) => {
    if (onCategorySelect) {
      onCategorySelect(catId);
    } else {
      setInternalCategory(catId);
    }
  };

  const categoryCounts = useMemo(() => {
    const counts = { all: allSites.length };
    allSites.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [allSites]);

  const visibleCategories = useMemo(() => {
    const additionalCategories = [...new Set(
      loadedMoreSites.map((site) => site.category)
    )].map((category) => ({ id: category, label: category }));

    return [...baseCategories, ...additionalCategories];
  }, [loadedMoreSites]);

  const filteredData = useMemo(() => {
    return allSites.filter((spot) => {
      const matchesCat =
        !activeCategory ||
        activeCategory === 'all' ||
        spot.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        spot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, allSites, searchQuery]);

  const hasMoreSites = loadedMoreSites.length < MORE_SITES.length;

  const handleLoadMore = () => {
    if (hasMoreSites) {
      onLoadMore?.();
      setLoadedMoreSites(MORE_SITES);
    }
  };

  const featuredSpot = filteredData.find((item) => item.isFeatured) || filteredData[0];
  const sideSpot = filteredData.find((item) => item.isSideArtifact && item.id !== featuredSpot?.id) || 
    filteredData.find((item) => item.id !== featuredSpot?.id);
  const bottomSpots = filteredData.filter(
    (item) => item.id !== featuredSpot?.id && item.id !== sideSpot?.id
  );

  const renderBookmarkBtn = (spotId) => {
    const saved = isBookmarked(spotId);
    return (
      <button
        type="button"
        className={`${styles.bookmarkBtn} ${saved ? styles.bookmarked : ''}`}
        onClick={(e) => toggleBookmark(spotId, e)}
        title={saved ? "Remove from My Plateau Itinerary" : "Add to My Plateau Itinerary"}
      >
        <FontAwesomeIcon icon={saved ? faBookmarkSolid : faBookmarkRegular} />
      </button>
    );
  };

  const renderRatingBadge = (rating) => (
    <span className={styles.subCardRatingBadge}>
      <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
      {rating || 4.8}
    </span>
  );

  const renderReviewTipBtn = (spot) => (
    <button
      type="button"
      className={styles.reviewTipBtn}
      onClick={(e) => {
        e.stopPropagation();
        setActiveReviewSpot(spot);
      }}
      title="Upload Photo or Leave Visitor Tip"
    >
      <FontAwesomeIcon icon={faCamera} />
      <span>Tip & Photo</span>
    </button>
  );

  const renderGuideButton = (spot) => (
    <button
      type="button"
      className={styles.hireGuideBtn}
      onClick={(e) => {
        e.stopPropagation();
        setActiveGuideSpot(spot);
      }}
      title="Book a local cultural guide"
    >
      <FontAwesomeIcon icon={faUserGroup} />
      <span>Hire Guide</span>
    </button>
  );

  const renderTourButton = (spot) => {
    if (!spot?.has360Tour) return null;

    return (
      <button
        type="button"
        className={styles.virtualTourBtn}
        onClick={(e) => {
          e.stopPropagation();
          setActiveTourSpot(spot);
        }}
        title="Explore 360° Virtual Tour"
      >
        <span>◉</span>
        <span>360°</span>
      </button>
    );
  };

  return (
    <section className={styles.gridSection}>
      {/* Category Pills */}
      <div className={styles.pillsContainer}>
        {visibleCategories.map((cat) => {
          const isActive = activeCategory.toLowerCase() === cat.id.toLowerCase();
          const count = categoryCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              type="button"
              className={`${styles.pillBtn} ${isActive ? styles.activePill : ''}`}
              onClick={() => handlePillClick(cat.id)}
            >
              <span>{cat.label}</span>
              <span className={styles.pillBadge}>{count}</span>
            </button>
          );
        })}
      </div>

      {filteredData.length > 0 ? (
        <>
          <div className={styles.topRow}>
            {/* Featured Hero Card */}
            {featuredSpot && (
              <div
                className={styles.featuredCard}
                onClick={() => navigate(`/place/${featuredSpot.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <img src={featuredSpot.image} alt={featuredSpot.title} />
                {renderBookmarkBtn(featuredSpot.id)}
                {renderTourButton(featuredSpot)}

                <div className={styles.featuredOverlay}>
                  <div className={styles.badgeRow}>
                    <span className={styles.badge}>{featuredSpot.category}</span>
                    <span className={styles.ratingBadge}>
                      <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
                      {featuredSpot.rating} Heritage Rating
                    </span>
                  </div>

                  <h3>{featuredSpot.title}</h3>
                  <p>{featuredSpot.description}</p>

                  <div className={styles.actionRow}>
                    <Link to={`/place/${featuredSpot.id}`} className={styles.exploreBtn}>
                      Explore Details <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                    {renderReviewTipBtn(featuredSpot)}
                    {renderGuideButton(featuredSpot)}
                  </div>
                </div>
              </div>
            )}

            {/* Side Artifact Card */}
            {sideSpot && (
              <div
                className={styles.sideArtifactCard}
                onClick={() => navigate(`/place/${sideSpot.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.artifactImageWrapper} style={{ position: 'relative' }}>
                  <img src={sideSpot.image} alt={sideSpot.title} />
                  {renderBookmarkBtn(sideSpot.id)}
                  {renderTourButton(sideSpot)}
                </div>

                <div className={styles.artifactContent}>
                  <div className={styles.categoryRatingRow}>
                    <span className={styles.badgeLight}>{sideSpot.category}</span>
                    {renderRatingBadge(sideSpot.rating)}
                  </div>
                  <h3>{sideSpot.title}</h3>
                  <p>{sideSpot.description}</p>

                  <div className={styles.cardFooter}>
                    <div className={styles.metaText}>
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      <span>{sideSpot.location}</span>
                    </div>
                    <div className={styles.cardButtonGroup}>
                      {renderReviewTipBtn(sideSpot)}
                      {renderGuideButton(sideSpot)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Grid Cards */}
          <div className={styles.bottomGrid}>
            {bottomSpots.map((spot) => (
              <div
                key={spot.id}
                className={styles.standardCard}
                onClick={() => navigate(`/place/${spot.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.cardImageWrapper} style={{ position: 'relative' }}>
                  <img src={spot.image} alt={spot.title} />
                  {renderBookmarkBtn(spot.id)}
                  {renderTourButton(spot)}

                  {spot.isFestival && spot.startDate && (
                    <FestivalCountdown targetDate={spot.startDate} />
                  )}
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.categoryRatingRow}>
                    <span className={styles.badgeLight}>{spot.category}</span>
                    {renderRatingBadge(spot.rating)}
                  </div>
                  <h3>{spot.title}</h3>
                  <p>{spot.description}</p>

                  {spot.isFestival && <FestivalCardActions spot={spot} />}

                  <div className={styles.cardFooter}>
                    <div className={styles.metaTextHighlight}>
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      <span>{spot.location}</span>
                      {userLocation && spot.coordinates && (
                        <span>
                          • {Number(calculateDistance(
                            userLocation.lat,
                            userLocation.lng,
                            spot.coordinates.lat,
                            spot.coordinates.lng
                          )).toFixed(1)} km away
                        </span>
                      )}
                    </div>
                    <div className={styles.cardButtonGroup}>
                      {renderReviewTipBtn(spot)}
                      {renderGuideButton(spot)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className={styles.noResultsContainer}>
          <p>No heritage locations match your selected filter.</p>
        </div>
      )}

      {/* LOAD MORE BUTTON */}
      {filteredData.length > 0 && hasMoreSites && (
        <div className={styles.loadMoreContainer}>
          <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
            Load More Heritage Sites
          </button>
        </div>
      )}

      {/* MODALS */}
      {activeGuideSpot && (
        <GuideBookingModal spot={activeGuideSpot} onClose={() => setActiveGuideSpot(null)} />
      )}
      {activeReviewSpot && (
        <UserReviewModal spot={activeReviewSpot} onClose={() => setActiveReviewSpot(null)} />
      )}
      {activeTourSpot && (
        <VirtualTourModal spot={activeTourSpot} onClose={() => setActiveTourSpot(null)} />
      )}
    </section>
  );
}

export function HeritageGrid(props) {
  return (
    <AudioProvider>
      <HeritageGridContent {...props} />
    </AudioProvider>
  );
}

export default HeritageGrid;