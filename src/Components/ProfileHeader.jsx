import styles from './ProfileHeader.module.css';

// Profile identity block shared above the profile tabs.
const ProfileHeader = ({ avatarUrl, level, name, subtext }) => {
  return (
    <div className={styles['profile-header']}>
      <div className={styles['avatar-container']}>
        <div className={styles['avatar-ring']}>
          <img 
            className={styles['avatar-img']} 
            src={avatarUrl} 
            alt={`${name}'s profile avatar`} 
          />
        </div>
        <div className={styles['level-badge']}>LVL {level}</div>
      </div>
      <h2 className={styles['profile-name']}>{name}</h2>
      <p className={styles['profile-subtext']}>{subtext}</p>
    </div>
  );
};

export default ProfileHeader;