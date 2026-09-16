import Header from './Components/headerNav';
import Footer from './Components/Footer';
import styles from './CSS/Golf.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLocationDot, 
  faStar, 
  faImages, 
  faGlassWater, 
  faUtensils, 
  faGolfBallTee, 
  faShieldHalved, 
  faUsers, 
  faWifi, 
  faClock, 
  faTicket, 
  faPhone, 
  faMapLocationDot, 
  faArrowRight, 
  faRoute 
} from '@fortawesome/free-solid-svg-icons';

export const GolfAndSports = () => {
  return (
    <div className={styles.pageWrapper}>
      <Header />

      <main className={styles.mainContainer}>
        {/* Header Metadata Section */}
        <div className={styles.headerMeta}>
          <div className={styles.badgeGroup}>
            <span className={`${styles.badge} ${styles.blueBadge}`}>
              <FontAwesomeIcon icon={faGolfBallTee} className={styles.badgeIcon} /> Golf & Sports
            </span>
            <span className={`${styles.badge} ${styles.orangeBadge}`}>
              Africa's Oldest Golf Course
            </span>
          </div>

          <h1 className={styles.title}>Rayfield Golf Club</h1>

          <div className={styles.ratingsLocation}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon key={i} icon={faStar} className={styles.starIcon} />
              ))}
              <span className={styles.reviewCount}>(124 Reviews)</span>
            </div>
            <span className={styles.locationText}>
              <FontAwesomeIcon icon={faLocationDot} className={styles.locIcon} /> Rayfield, Jos South
            </span>
          </div>
        </div>

        {/* Media Gallery Grid */}
        <div className={styles.galleryGrid}>
          <div className={styles.largePic}>
            <img src="./assets/images/golf-course-main.jpg" alt="Rayfield Golf Course Main View" />
          </div>
          <div className={styles.rightSideGallery}>
            <div className={styles.smallPic}>
              <img src="./assets/images/golf-ball.jpg" alt="Golf Ball on Tee" />
            </div>
            <div className={styles.smallPicOverlayContainer}>
              <img src="./assets/images/clubhouse.jpg" alt="Clubhouse Interior" />
              <div className={styles.imageMetaBar}>
                <span>Golf Club - Est 1923</span>
                <button className={styles.viewAllBtn}>
                  <FontAwesomeIcon icon={faImages} /> View All (12)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Body Section */}
        <div className={styles.contentLayout}>
          {/* Main Left Content */}
          <div className={styles.primaryContent}>
            <section className={styles.sectionBlock}>
              <h3>About This Venue</h3>
              <p>
                Established in 1913, Rayfield Golf Club is recognized as the oldest golf course in Nigeria and West Africa. Nestled in the serene and picturesque landscape of Jos, it offers an 18-hole course that challenges seasoned golfers while remaining accessible to enthusiastic beginners.
              </p>
              <p>
                The club is not just a sporting venue; it's a piece of living history. The rugged terrain of the Plateau provides a unique backdrop, making every round a scenic adventure. The clubhouse offers a glimpse into colonial-era architecture and serves as a gathering place for both locals and tourists seeking relaxation and heritage.
              </p>
            </section>

            <section className={styles.sectionBlock}>
              <h3>Amenities</h3>
              <div className={styles.amenitiesGrid}>
                <div className={styles.amenityItem}>
                  <FontAwesomeIcon icon={faGlassWater} /> <span>Clubhouse Bar</span>
                </div>
                <div className={styles.amenityItem}>
                  <FontAwesomeIcon icon={faUtensils} /> <span>Restaurant</span>
                </div>
                <div className={styles.amenityItem}>
                  <FontAwesomeIcon icon={faGolfBallTee} /> <span>Equipment Rental</span>
                </div>
                <div className={styles.amenityItem}>
                  <FontAwesomeIcon icon={faShieldHalved} /> <span>Secure Parking</span>
                </div>
                <div className={styles.amenityItem}>
                  <FontAwesomeIcon icon={faUsers} /> <span>Locker Rooms</span>
                </div>
                <div className={styles.amenityItem}>
                  <FontAwesomeIcon icon={faWifi} /> <span>Free Wi-Fi</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Sidebar: Plan Your Visit */}
          <aside className={styles.sidebar}>
            <div className={styles.visitCard}>
              <h3>Plan Your Visit</h3>
              
              <div className={styles.infoRow}>
                <FontAwesomeIcon icon={faClock} className={styles.infoIcon} />
                <div>
                  <strong>Operating Hours</strong>
                  <p>Mon - Sun: 6:00 AM - 6:30 PM</p>
                </div>
              </div>

              <div className={styles.infoRow}>
                <FontAwesomeIcon icon={faTicket} className={styles.infoIcon} />
                <div>
                  <strong>Entry / Green Fee</strong>
                  <p>From ₦5,000 (Members)</p>
                  <p>From ₦15,000 (Guests)</p>
                </div>
              </div>

              <div className={styles.infoRow}>
                <FontAwesomeIcon icon={faPhone} className={styles.infoIcon} />
                <div>
                  <strong>Contact</strong>
                  <p>+234 (0) 800 123 4567</p>
                </div>
              </div>

              <button className={styles.bookBtn}>
                Book a Tee Time <FontAwesomeIcon icon={faArrowRight} />
              </button>
              <button className={styles.directionsBtn}>
                <FontAwesomeIcon icon={faRoute} /> Get Directions
              </button>
            </div>
          </aside>
        </div>

        {/* Location / Map Section */}
        <section className={styles.sectionBlock}>
          <h3>Location</h3>
          <div className={styles.mapContainer}>
            <FontAwesomeIcon icon={faMapLocationDot} className={styles.mapIcon} />
            <p>Map view centering on Rayfield, Jos</p>
          </div>
        </section>

        {/* Nearby Attractions */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h3>Nearby Attractions</h3>
            <a href="#view-all" className={styles.viewAllLink}>
              View all <FontAwesomeIcon icon={faArrowRight} />
            </a>
          </div>

          <div className={styles.attractionsGrid}>
            <div className={styles.attractionCard}>
              <div className={styles.cardImageWrapper}>
                <img src="./assets/images/alpine-cafe.jpg" alt="The Alpine Cafe" />
                <span className={styles.attractionBadge}>Dining</span>
              </div>
              <h4>The Alpine Cafe</h4>
              <p><FontAwesomeIcon icon={faLocationDot} /> 2.3km away</p>
            </div>

            <div className={styles.attractionCard}>
              <div className={styles.cardImageWrapper}>
                <img src="./assets/images/rayfield-resort.jpg" alt="Rayfield Resort" />
                <span className={styles.attractionBadge}>Nature</span>
              </div>
              <h4>Rayfield Resort</h4>
              <p><FontAwesomeIcon icon={faLocationDot} /> 0.8km away</p>
            </div>

            <div className={styles.attractionCard}>
              <div className={styles.cardImageWrapper}>
                <img src="./assets/images/jos-museum.jpg" alt="Jos Museum" />
                <span className={styles.attractionBadge}>Culture</span>
              </div>
              <h4>Jos Museum</h4>
              <p><FontAwesomeIcon icon={faLocationDot} /> 5.2km away</p>
            </div>

            <div className={styles.attractionCard}>
              <div className={styles.cardImageWrapper}>
                <img src="./assets/images/plateau-grill.jpg" alt="Plateau Grill" />
                <span className={styles.attractionBadge}>Dining</span>
              </div>
              <h4>Plateau Grill</h4>
              <p><FontAwesomeIcon icon={faLocationDot} /> 3.1km away</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default GolfAndSports;