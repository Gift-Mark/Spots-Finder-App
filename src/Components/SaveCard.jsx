import styles from "../Profile.module.css";

// Saved-place tile used by the profile saves tab.
export const SaveCard = ({ image,title}) => {
  return (
    <div className={styles['save-card']}>
      <img 
      src={image}
      alt={title}
      style= {{
        display: 'block',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
      />
      <span style={{color: 'white'}}>{title}</span>
    </div>
  );
};