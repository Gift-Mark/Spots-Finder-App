import { useState, useMemo } from 'react';
import Header from './Components/headerNav';
import EventsHeader from './Components/EventsHeader';
import PromotedEvent from './Components/PromotedEvent';
import EventsGrid from './Components/EventsGrid';
import Footer from './Components/Footer';
import styles from './CSS/EventsPage.module.css';

const ALL_EVENTS = [
  {
    id: 1,
    category: 'sports',
    categoryLabel: 'Golf & Sports',
    timeframe: 'Upcoming Week',
    image: '/images/Ball on Tee.webp',
    dateText: 'This Saturday, 7:00 AM',
    title: 'Rayfield Annual Classic Tournament',
    location: 'Rayfield Golf Club',
  },
  {
    id: 2,
    category: 'dining',
    categoryLabel: 'Dining',
    timeframe: 'Upcoming Week',
    image: '/images/Southern fried.jpg',
    dateText: 'Next Friday, 6:30 PM',
    title: 'Plateau Culinary Heritage Dinner',
    location: 'The View Restaurant',
  },
  {
    id: 3,
    category: 'adventure',
    categoryLabel: 'Adventure',
    timeframe: 'This Month',
    image: '/images/Shere hills hike.jpg',
    dateText: 'Dec 5, 8:00 AM',
    title: 'Wase Rock Expedition Challenge',
    location: 'Wase Town Basecamp',
  },
  {
    id: 4,
    category: 'music',
    categoryLabel: 'Music & Festivals',
    timeframe: 'This Weekend',
    image: '/images/Pusdung festival.jpg',
    dateText: 'This Sunday, 4:00 PM',
    title: 'Jos Unplugged Acoustic Night',
    location: 'Mees Palace, Jos',
  },
  {
    id: 5,
    category: 'traditional',
    categoryLabel: 'Traditional',
    timeframe: 'This Month',
    image: '/images/Tarok day.jpg',
    dateText: 'Nov 28, 10:00 AM',
    title: 'Plateau Cultural Costume Exhibition',
    location: 'Jos Museum Grounds',
  }
];

export const EventsPage = () => {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [timeframe, setTimeframe] = useState('Upcoming Week');
  const [visibleCount, setVisibleCount] = useState(3);

  // Safe useMemo with optional chaining to prevent undefined reading errors
  const filteredEvents = useMemo(() => {
    return ALL_EVENTS.filter((event) => {
      if (!event) return false;

      const matchesCategory =
        categoryFilter === 'all' || 
        (event.category && event.category.toLowerCase() === categoryFilter.toLowerCase());

      const matchesTimeframe =
        !timeframe || 
        (event.timeframe && event.timeframe.toLowerCase() === timeframe.toLowerCase());

      return matchesCategory && matchesTimeframe;
    });
  }, [categoryFilter, timeframe]);

  const handleFilterChange = (categoryId) => {
    setCategoryFilter(categoryId || 'all');
    setVisibleCount(3);
  };

  const handleTimeframeChange = (selectedTimeframe) => {
    setTimeframe(selectedTimeframe || '');
    setVisibleCount(3);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />

      <EventsHeader 
        onFilterChange={handleFilterChange}
        onTimeframeChange={handleTimeframeChange}
      />

      <PromotedEvent />

      <main className={styles.mainContent}>
        {filteredEvents.length > 0 ? (
          <EventsGrid 
            events={filteredEvents.slice(0, visibleCount)} 
            onLoadMore={handleLoadMore} 
            hasMore={visibleCount < filteredEvents.length}
          />
        ) : (
          <div className={styles.noResults}>
            <h3>No events found</h3>
            <p>Try switching categories or selecting a different timeframe.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default EventsPage;