import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import Navbar from "./Components/NavBar";
import BottomNav from "./Components/BottomNav";
import places from "../backend/data/places";

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
  // Center coordinates for Jos, Plateau State
  const josCenter = [9.9285, 8.8921];

  return (
    <div className={styles.mapPage}>
      <Navbar title="Explore Map" showGear={false} />

      <div className={styles.mapContainer}>
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

          {/* Places without coordinates cannot be represented as map markers. */}
          {places
            .filter((place) => place.latitude && place.longitude)
            .map((place) => (
              <Marker
                key={place.id || place._id}
                position={[
                  parseFloat(place.latitude),
                  parseFloat(place.longitude),
                ]}
              >
                <Popup>
                  <div style={{ minWidth: "180px", textAlign: "left" }}>
                    <img
                      src={place.image || "/images/Jos Museum.jpg"}
                      alt={place.title}
                      style={{
                        width: "100%",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "8px",
                      }}
                    />

                    <h3 style={{ margin: "0 0 4px 0", fontSize: "16px" }}>
                      {place.title}
                    </h3>

                    <p style={{ margin: "0 0 4px 0", color: "#666", fontSize: "13px" }}>
                      📍 {place.location}
                    </p>

                    {place.rating && (
                      <p style={{ margin: "0 0 8px 0", fontSize: "13px" }}>
                        ⭐ {place.rating}
                      </p>
                    )}

                    <Link
                      to={`/place/${place.slug || place.id}`}
                      style={{
                        display: "inline-block",
                        color: "#7c3aed",
                        fontWeight: "bold",
                        textDecoration: "none",
                        fontSize: "13px",
                      }}
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>

      <BottomNav />
    </div>
  );
}