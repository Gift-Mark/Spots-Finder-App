import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faMapMarkerAlt, faPhone, faClock } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/SimmerDetailPage.module.css';

const REAL_MENU_DATA = [
  {
    id: 'lamb-chops',
    name: 'Grilled Lamb Chops',
    category: 'Beef & Meats',
    price: '₦28,400',
    description: 'Flame-grilled tender lamb chops served with seasonal sides and chef reduction sauce.',
    isChefChoice: true
  },
  {
    id: 'english-breakfast',
    name: 'English Breakfast',
    category: 'Breakfast',
    price: '₦17,500',
    description: 'Full breakfast plate featuring eggs, sausage, baked beans, grilled tomatoes, and toast.',
    isChefChoice: true
  },
  {
    id: 'margherita-pizza',
    name: 'Margherita Pizza',
    category: 'Pizza',
    price: '₦16,900',
    description: 'Classic pizza crust topped with rich tomato base, mozzarella cheese, and fresh herbs.',
    isChefChoice: true
  },
  {
    id: 'egusi-soup',
    name: 'Traditional Egusi Soup',
    category: 'African Heritage',
    price: '₦15,000',
    description: 'Slow-cooked melon seed soup with assorted meats, served with your choice of swallow.',
    isChefChoice: true
  },
  {
    id: 'sizzling-brownie',
    name: 'Sizzling Brownies & Cream',
    category: 'Desserts',
    price: '₦13,900',
    description: 'Signature hot chocolate brownie served sizzling on a cast-iron skillet with ice cream.',
    isChefChoice: true
  },
  {
    id: 'classic-burger',
    name: 'Classic Beef Burger',
    category: 'Burgers & Sandwiches',
    price: '₦12,800',
    description: 'Handcrafted juicy beef patty with fresh lettuce, tomatoes, cheese, and seasoned fries.',
    isChefChoice: true
  },
  {
    id: 'penne-arrabbiata',
    name: 'Fiery Penne Arrabbiata',
    category: 'Pasta & Asian',
    price: 'Market Price',
    description: 'Al dente penne tossed in a bold garlicky tomato sauce with a signature spicy kick.',
    isChefChoice: false
  },
  {
    id: 'apple-crumble',
    name: 'Apple Nutty Crumble',
    category: 'Desserts',
    price: 'Market Price',
    description: 'Warm spiced apples tucked under a golden, buttery, nutty crust.',
    isChefChoice: false
  }
];

const CATEGORIES = ['All', 'Beef & Meats', 'Breakfast', 'Pizza', 'African Heritage', 'Burgers & Sandwiches', 'Pasta & Asian', 'Desserts'];

export const SimmerDetailPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredItems = selectedCategory === 'All'
    ? REAL_MENU_DATA
    : REAL_MENU_DATA.filter(item => item.category === selectedCategory);

  return (
    <div className={styles.pageWrapper}>
      {/* Venue Banner */}
      <div className={styles.heroHeader}>
        <span className={styles.tag}>Exquisite & Serene Dining</span>
        <h1>Simmer Restaurant & Café</h1>
        <p className={styles.subtext}>Formerly Sweet November Bistro • Refined Continental & Afro-Fusion Cuisine</p>
        <div className={styles.ratingBadge}>
          <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
          <span><strong>4.6</strong> (248 Customer Reviews)</span>
        </div>
      </div>

      {/* Real Information Bar */}
      <div className={styles.infoBar}>
        <div className={styles.infoItem}>
          <FontAwesomeIcon icon={faMapMarkerAlt} />
          <span>No 1B, Beside Eliel Event Center, Gold & Base, Jos</span>
        </div>
        <div className={styles.infoItem}>
          <FontAwesomeIcon icon={faPhone} />
          <span>+234 916 389 1140</span>
        </div>
        <div className={styles.infoItem}>
          <FontAwesomeIcon icon={faClock} />
          <span>Open Daily (10:00 AM – 10:00 PM)</span>
        </div>
      </div>

      {/* Menu Navigation */}
      <section className={styles.menuContainer}>
        <h2>Signature Culinary Menu</h2>
        <div className={styles.categoryFilter}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={selectedCategory === cat ? styles.activeCategoryBtn : styles.categoryBtn}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className={styles.menuGrid}>
          {filteredItems.map(item => (
            <div key={item.id} className={styles.menuItemCard}>
              <div className={styles.cardTop}>
                <h3>{item.name}</h3>
                <span className={styles.price}>{item.price}</span>
              </div>
              <p className={styles.itemDesc}>{item.description}</p>
              {item.isChefChoice && <span className={styles.chefBadge}>Chef's Choice</span>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SimmerDetailPage;