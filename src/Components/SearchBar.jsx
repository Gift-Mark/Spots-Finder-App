import styles from '../discover.module.css';

// Controlled search input; filtering remains in the parent page.
export const SearchBar = ({ 
  placeholder = "Search...", 
  value, 
  onChange, 
  iconClass = "fa fa-magnifying-glass",
  className = "" 
}) => {
  return (
    <div className={`${styles['search-container']} ${className}`}>
      <div className={styles['search']}>
        {/* Render the icon if iconClass is provided */}
        {iconClass && <i className={iconClass}></i>}
        
        <input 
          type="text"
          placeholder={placeholder} 
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};