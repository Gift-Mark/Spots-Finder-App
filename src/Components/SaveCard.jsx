import styles from "../Profile.module.css";

// Saved-place tile used by the profile saves tab.
// Accepts an optional onToggleSave callback to remove the bookmark.
export const SaveCard = ({ image, title, placeId = null, onToggleSave = null }) => {
  const isAuthenticated = !!(localStorage.getItem('token') || localStorage.getItem('jos_pulse_token'));

  return (
    <div className={styles['save-card']} style={{ position: 'relative' }}>
      <img
        src={image}
        alt={title}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      {isAuthenticated && onToggleSave && placeId && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(placeId);
          }}
          style={{
            position: 'absolute',
            top: 6,
            right: 6,
            background: 'rgba(0,0,0,0.55)',
            border: 'none',
            borderRadius: '50%',
            width: 28,
            height: 28,
            cursor: 'pointer',
            color: 'white',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
          aria-label="Remove bookmark"
          title="Remove from saved"
        >
          🔖
        </button>
      )}
      <span style={{ color: 'white' }}>{title}</span>
    </div>
  );
};
