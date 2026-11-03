import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import Navbar from "./Components/NavBar";
import BottomNav from "./Components/BottomNav";
import MapPlaceMarker, {
  FitAllMapMarkers,
} from "./Components/MapPlaceMarker";
import { fetchAllMapPlaces, groupMapPlaces } from "./services/mapPlaces";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import styles from "./map.module.css";

// Fix Leaflet marker icon pathing in React builds
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function Map() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const josCenter = [9.9285, 8.8921];

  useEffect(() => {
    let isMounted = true;
    fetchAllMapPlaces()
      .then((mapPlaces) => {
        if (isMounted) setPlaces(mapPlaces);
      })
      .catch(() => {
        if (isMounted) {
          setError("Places could not be loaded. Please check your connection and try again.");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={styles.mapPage}>
      <Navbar title="Explore Map" showGear={false} />

      <div className={styles.mapContainer}>
        {loading && <p className={styles.mapStatus}>Loading places...</p>}
        {error && <p className={styles.mapStatus} role="alert">{error}</p>}
        {!loading && !error && places.length === 0 && (
          <p className={styles.mapStatus}>No places with map coordinates are available yet.</p>
        )}
        <MapContainer
          center={josCenter}
          zoom={13}
          className={styles.map}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitAllMapMarkers places={places} />
          {groupMapPlaces(places).map(({ place, places: groupedPlaces }) => (
            <MapPlaceMarker
              key={place.id}
              place={place}
              places={groupedPlaces}
            />
          ))}
        </MapContainer>
      </div>

      <BottomNav />
    </div>
  );
}