import { useNavigate } from 'react-router-dom';
import { useAudio } from './AudioPlayerContext';
import styles from '../CSS/HeritageGrid.module.css';

export function HeritageCard({ spot, distance }) {
  const navigate = useNavigate();
  const { currentTrack, isPlaying, playTrack } = useAudio();

  const isCurrentAudio = currentTrack?.id === spot.id;
  const isThisPlaying = isCurrentAudio && isPlaying;

  const handleAudioClick = (e) => {
    e.stopPropagation(); // Prevents navigating to details page when clicking audio button
    if (spot.audioUrl) {
      playTrack({
        id: spot.id,
        title: spot.title,
        audioUrl: spot.audioUrl
      });
    }
  };

  return (
    <div 
      className={styles.cardContainer} 
      onClick={() => navigate(`/place/${spot.id}`)}
    >
      <div className={styles.imageWrapper}>
        <img src={spot.image} alt={spot.title} className={styles.cardImage} />
        <span className={styles.categoryBadge}>{spot.category}</span>
        
        {distance && (
          <span className={styles.distanceBadge}>📍 {distance} km</span>
        )}

        {/* Self-Guided Audio Trigger Button */}
        {spot.audioUrl && (
          <button 
            className={`${styles.audioBtn} ${isThisPlaying ? styles.audioPlaying : ''}`}
            onClick={handleAudioClick}
            title={isThisPlaying ? "Pause Audio Guide" : "Listen to Audio Commentary"}
          >
            <span className={styles.audioIcon}>{isThisPlaying ? '⏸️' : '🔊'}</span>
            <span className={styles.audioDuration}>{spot.audioDuration || '2:30'}</span>
            
            {/* Animated Audio Equalizer Waveform when active */}
            {isThisPlaying && (
              <div className={styles.waveform}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </button>
        )}
      </div>

      <div className={styles.cardBody}>
        <div className={styles.metaRow}>
          <span className={styles.rating}>⭐ {spot.rating}</span>
          <span className={styles.locationTag}>{spot.location}</span>
        </div>
        <h3 className={styles.cardTitle}>{spot.title}</h3>
        <p className={styles.cardDescription}>{spot.description}</p>
        
        <div className={styles.cardFooter}>
          <span className={styles.exploreBtn}>Explore Details &gt;</span>
        </div>
      </div>
    </div>
  );
}