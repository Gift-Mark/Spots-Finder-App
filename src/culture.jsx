import Header from './Components/headerNav';
import HeroSection from './Components/HeroSection';
import HeritageGrid from './Components/HeritageGrid';
import styles from './CSS/culture.module.css';
import { 
  faLandmark, 
  faBuildingColumns, 
  faMasksTheater 
} from '@fortawesome/free-solid-svg-icons';
import { Footer } from './Components/Footer';
import heroImage from './assets/images/shere hills.jpg';

export const CulturePage = () => {
  const culturePills = [
    { id: 'historical', label: 'Historical Sites', icon: faLandmark },
    { id: 'museums', label: 'Museums', icon: faBuildingColumns },
    { id: 'festivals', label: 'Traditional Festivals', icon: faMasksTheater },
  ];

  const handleSearch = (query, category) => {
    console.log('Searching culture for:', query, 'in category:', category);
  };

  const handleLoadMore = () => {
    console.log('Loading additional heritage sites...');
  };

  return (
    <div className={styles.pageContainer}>
      <Header />

      <HeroSection
        badgeText="Destination Plateau"
        title="Culture & Heritage of the Plateau"
        subtitle="Discover the rugged beauty, ancient historical sites, and vibrant traditions that define the heart of Nigeria."
        placeholder="Search landmarks, museums..."
        heroImage={heroImage}
        filterPills={culturePills}
        onSearch={handleSearch}
      />
      
      {/* Heritage Grid Component */}
      <main className={styles.mainContent}>
        <HeritageGrid onLoadMore={handleLoadMore} />
      </main>

      <Footer />
    </div>
  );
}
export default CulturePage;