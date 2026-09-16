import Header from "./Components/headerNav";
import styles from "../src/CSS/Golf.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImage, faGolfBallTee, faLocationPin, faMartiniGlass, faUtensils,
  faCar, faPeople, faWifi,
  faMap
 } from "@fortawesome/free-solid-svg-icons";
import Footer from "./Components/Footer";

export const GolfAndSports = () => {
  return (
    <div className={styles.container}>
      <Header />
      <button className={styles.GolfBlue}>
        Golf and Sports
      </button>
      <button className={styles.AfricaOrange}>
        Africa's Oldest Golf Course
      </button>
      <h1>Rayfield Golf Club</h1>
      <span>(124 Reviews)</span>
      <span>
        <FontAwesomeIcon icon={faLocationPin} />
        Rayfield, Jos South
      </span>
      <div className={styles.midGrid}>
        <div className={styles.largePic}>
          <img src="./assets/images/shere hills 2.jpg" alt="Golf course" />
        </div>
        <div className={styles.leftSide}>
          <div className={styles.smallPic}>
            <img src="./assets/images/shere hills 2.jpg" alt="Golf course" />
          </div>
          <div className={styles.smallPic}>
            <img src="./assets/images/shere hills 2.jpg" alt="Golf course" />
          </div>
          <div className={styles.bottomText}>
            <p>Golf Club- Est 1923</p>
            <button>
              <FontAwesomeIcon icon={faFileImage} />
              View All(12)
            </button>
          </div>
        </div>
      </div>

      <h3>About This Venue</h3>
      <p>Established in 1923, Rayfield Golf Club is recognized as the oldest golf course in Nigeria and West Africa Nestled in the serene and picturesque landscape of Jos. It offers an 18-hole course that challenge seasoned golfers while remaining accessibke to enthusiastic beginners.


        The club is not just a sporting venue; it's a piece of living history. The rugged terrain of the Palteau provides a unique backdrop, making every round a scenic adventure. The clubhouse offers a glimpse into colonial-era architecture and serves as a gathering place for both locals and tourists seeking relation and heritage.
      </p>

      <div className={styles.amenities}>
        <h3>Amenities</h3>
        <ul>
          <li><FontAwesomeIcon icon={faMartiniGlass} /> Clubhouse Bar</li>
          <li><FontAwesomeIcon icon={faUtensils} /> Restaurant</li>
          <li><FontAwesomeIcon icon={faGolfBallTee} />Equipment Rental</li>
          <li><FontAwesomeIcon icon={faCar} />Secure Parking</li>
          <li><FontAwesomeIcon icon={faPeople}/>
            Locker Rooms</li>
          <li>
            <FontAwesomeIcon icon={faWifi} /> Free Wi-fi</li>
        </ul>
      </div>

      <div className={location}>
        <h3>Location</h3>
        <p>
          <FontAwesomeIcon icon={faMap} />
          Map view catering on Rayfield, Jos
        </p>
      </div>

      <div className={styles.attractions}>
        <div className={styles.attractionCard}>
        <h3>Nearby Attractions</h3>
        <button>View All &gt;</button>
        </div>

        <div className={styles.attractionCard}>
          <img src="./assets/images/shere hills 2.jpg" alt="Alpine Cafe" />
          <span className={styles.attractionBadge}>Dining</span>
          <h4>The Alpine Cafe</h4>
          <p>
            <FontAwesomeIcon icon={faLocationPin} />
            2.3km away
          </p>
        </div>
        <div className={styles.attractionCard}>
          <img src="./assets/images/shere hills 2.jpg" alt="Rayfield Resort" />
          <span className={styles.attractionBadge}>Nature</span>
          <h4>Rayfield Resort</h4>
          <p>
            <FontAwesomeIcon icon={faLocationPin} />
            0.8km away
          </p>
        </div>
        <div className={styles.attractionCard}>
          <img src="./assets/images/shere hills 2.jpg" alt="Museum" />
          <span className={styles.attractionBadge}>Culture</span>
          <h4>Jos Museum</h4>
          <p>
            <FontAwesomeIcon icon={faLocationPin} />
            5.2km away
          </p>
        </div>
        <div className={styles.attractionCard}>
          <img src="./assets/images/shere hills 2.jpg" alt="grill" />
          <span className={styles.attractionBadge}>Dining</span>
          <h4>Plateau Grill</h4>
          <p>
            <FontAwesomeIcon icon={faLocationPin} />
            3.1km away
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}