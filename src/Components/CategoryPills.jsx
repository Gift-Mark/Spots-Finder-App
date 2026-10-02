import styles from '../CSS/CategoryPills.module.css';

const categories = [
  { id: 'all', label: 'All Sites' },
  { id: 'Museum', label: 'Museums' },
  { id: 'Artifacts', label: 'Artifacts' },
  { id: 'Historical Site', label: 'Historical Sites' },
  { id: 'Traditional Festival', label: 'Traditional Festivals' },
  { id: 'Architecture', label: 'Architecture' }
];

export function CategoryPills({ selectedCategory, onSelectCategory, counts }) {
  return (
    <div className={styles.pillsContainer}>
      {categories.map((cat) => {
        const isActive =
          (!selectedCategory && cat.id === 'all') ||
          selectedCategory?.toLowerCase() === cat.id.toLowerCase();

        const count = counts ? counts[cat.id] : null;

        return (
          <button
            key={cat.id}
            type="button"
            className={`${styles.pillBtn} ${isActive ? styles.activePill : ''}`}
            onClick={() => onSelectCategory(cat.id === 'all' ? '' : cat.id)}
          >
            <span>{cat.label}</span>
            {count !== undefined && count !== null && (
              <span className={styles.pillBadge}>{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}