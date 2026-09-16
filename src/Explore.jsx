import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Header from './Components/headerNav';
import { HeroSection } from './Components/HeroSection';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import styles from '../src/CSS/Explore.module.css'
import { TopTouristSpots } from './Components/TopTouristSpots';
import { Footer } from './Components/Footer';
import { GolfSpotlight } from './Components/GolfSpotlight';
const Explore = () => {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.jpMainContent}>
        <HeroSection />

        <div className={styles.spots}>
          <h3>Top Tourist Spots</h3>
          <button>See all
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
        <TopTouristSpots />
        <GolfSpotlight />
      </main>

      <Footer />
    </div>
  )
}
export default Explore;