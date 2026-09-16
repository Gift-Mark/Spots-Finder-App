import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

// Detail-page map centered on one venue rather than the full city.
export default function PlaceMap({
  latitude,
  longitude,
  title
}) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={16}
      style={{
        height: "300px",
        width: "100%",
        borderRadius: "16px"
      }}
    >
      <TileLayer
        attribution='© OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[latitude, longitude]}>
        <Popup>{title}</Popup>
      </Marker>
    </MapContainer>
  );
}