import { useNavigate } from 'react-router-dom';
import { calculateDistance } from '../utils/haversine';
import styles from '../CSS/culture.module.css';

export function HeritageMapView({ spots = [], userLocation, onSpotSelect, selectedSpot }) {
  const navigate = useNavigate();

  return (
    <div className={styles.mapContainer}>
      {/* Map Control Overlay */}
      <div className={styles.mapSidebar}>
        <div className={styles.sidebarHeader}>
          <h3>Landmarks ({spots.length})</h3>
          {userLocation ? (
            <span className={styles.gpsActive}>📍 GPS Active (Jos Center)</span>
          ) : (
            <span className={styles.gpsDisabled}>⚠️️ Location Off</span>
          )}
        </div>

        <div className={styles.spotsList}>
          {spots.map((spot) => {
            const distance = userLocation && spot.coordinates
              ? calculateDistance(
                  userLocation.lat,
                  userLocation.lng,
                  spot.coordinates.lat,
                  spot.coordinates.lng
                )
              : null;

            const isSelected = selectedSpot?.id === spot.id;

            return (
              <div
                key={spot.id}
                className={`${styles.spotListItem} ${isSelected ? styles.activeListItem : ''}`}
                onClick={() => onSpotSelect?.(spot)}
              >
                <img src={spot.image} alt={spot.title} className={styles.listThumb} />
                <div className={styles.listInfo}>
                  <h4>{spot.title}</h4>
                  <span className={styles.listCategory}>{spot.category}</span>
                  <div className={styles.listMeta}>
                    <span className={styles.rating}>⭐ {spot.rating}</span>
                    {distance && (
                      <span className={styles.distanceBadge}>🚗 {distance} km away</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Interactive Map Wrapper */}
      <div className={styles.mapVisualArea}>
        <div className={styles.mockMapBackground}>
          {/* User Location Marker */}
          {userLocation && (
            <div
              className={styles.userMarker}
              style={{ top: '52%', left: '48%' }} // Center of Jos
              title="Your Location"
            >
              <div className={styles.userPulse}></div>
              📍 You
            </div>
          )}

          {/* Heritage Pins Across Plateau State */}
          {spots.map((spot) => {
            const distance = userLocation && spot.coordinates
              ? calculateDistance(
                  userLocation.lat,
                  userLocation.lng,
                  spot.coordinates.lat,
                  spot.coordinates.lng
                )
              : null;

            return (
              <div
                key={spot.id}
                className={`${styles.mapPin} ${
                  selectedSpot?.id === spot.id ? styles.selectedPin : ''
                }`}
                style={{ top: spot.mapCoords.top, left: spot.mapCoords.left }}
                onClick={() => onSpotSelect?.(spot)}
              >
                <div className={styles.pinBubble}>
                  <span className={styles.pinIcon}>{spot.icon}</span>
                  <span className={styles.pinTitle}>{spot.title}</span>
                </div>

                {/* Popup Card on Pin Selection */}
                {selectedSpot?.id === spot.id && (
                  <div className={styles.pinPopup}>
                    <img src={spot.image} alt={spot.title} />
                    <div className={styles.popupBody}>
                      <h4>{spot.title}</h4>
                      <p>{spot.subtitle}</p>
                      {distance && (
                        <div className={styles.distanceTag}>
                          📍 <strong>{distance} km</strong> from your location
                        </div>
                      )}
                      <button
                        className={styles.popupNavBtn}
                        onClick={() => navigate(`/place/${spot.id}`)}
                      >
                        Explore Spot Details &gt;
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HeritageMapView;