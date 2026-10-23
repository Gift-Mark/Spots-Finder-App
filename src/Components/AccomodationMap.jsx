import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons in Vite builds
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const customMarkerIcon = new L.Icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Verified coordinates for Plateau Districts
const ZONE_COORDINATES = {
  'rayfield-gra': [9.8542, 8.8910],
  'tudun-wada-central': [9.9185, 8.8895],
  'lamingo-dam': [9.9120, 8.9240],
  default: [9.8965, 8.8583] // General Jos Plateau Center
};

// Helper component to auto-recenter map when `selectedZone` changes
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

export default function AccommodationMap({ properties = [], selectedZone = null, height = "380px" }) {
  const currentCenter = useMemo(() => {
    if (selectedZone && ZONE_COORDINATES[selectedZone]) {
      return ZONE_COORDINATES[selectedZone];
    }
    return ZONE_COORDINATES.default;
  }, [selectedZone]);

  return (
    <div style={{ height, width: "100%", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
      <MapContainer 
        center={currentCenter} 
        zoom={12} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%" }}
      >
        <ChangeView center={currentCenter} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {properties.map((property, index) => {
          const baseLat = 9.8965;
          const baseLng = 8.8583;
          
          const lat = property.coordinates?.latitude || property.latitude || (baseLat + (index * 0.006));
          const lng = property.coordinates?.longitude || property.longitude || (baseLng + (index * 0.006));

          return (
            <Marker 
              key={property._id || property.id || index} 
              position={[lat, lng]} 
              icon={customMarkerIcon}
            >
              <Popup>
                <div style={{ padding: "0.25rem" }}>
                  <h4 style={{ margin: "0 0 0.25rem 0", color: "#0b132b", fontSize: "0.95rem" }}>
                    {property.name}
                  </h4>
                  <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.75rem", color: "#64748b" }}>
                    📍 {property.neighborhood || "Jos Central"}
                  </p>
                  <strong style={{ color: "#ea580c", fontSize: "0.85rem" }}>
                    ₦{(property.pricePerNight || property.startingFare || 35000).toLocaleString()} / night
                  </strong>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}