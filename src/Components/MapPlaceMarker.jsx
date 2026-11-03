import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

export function FitAllMapMarkers({ places }) {
  const map = useMap();

  useEffect(() => {
    if (places.length === 0) return;
    const bounds = L.latLngBounds(
      places.map((place) => [place.latitude, place.longitude])
    );
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [28, 28], maxZoom: 13 });
    }
  }, [map, places]);

  return null;
}

const MapPlacePopup = ({ place }) => (
  <div style={{ width: "220px", color: "#0f172a" }}>
    <img
      src={place.image || "/images/Jos Museum.jpg"}
      alt={place.title}
      style={{
        width: "100%",
        height: "112px",
        borderRadius: "8px",
        objectFit: "cover",
        marginBottom: "8px",
      }}
      onError={(event) => {
        event.currentTarget.src = "/images/Jos Museum.jpg";
      }}
    />
    <strong style={{ display: "block", fontSize: "15px" }}>
      {place.title}
    </strong>
    <small style={{ color: "#c2410c", fontSize: "11px" }}>
      {Array.isArray(place.category) ? place.category.join(", ") : place.category}
    </small>
    <p style={{ margin: "4px 0", color: "#64748b", fontSize: "12px" }}>
      📍 {place.location}
    </p>
    {place.approximateLocation && (
      <small style={{ color: "#a16207", fontSize: "11px" }}>
        Approximate map position
      </small>
    )}
    {place.description && (
      <p style={{ margin: "4px 0", color: "#475569", fontSize: "12px" }}>
        {place.description.slice(0, 110)}
        {place.description.length > 110 ? "..." : ""}
      </p>
    )}
    <p style={{ margin: "4px 0", fontSize: "13px" }}>
      ⭐ {place.rating.toFixed(1)} ({place.reviewsCount} reviews)
      <span style={{ marginLeft: "10px" }}>♥ {place.likes} likes</span>
    </p>
    <Link
      to={place.detailPath}
      style={{
        display: "inline-block",
        marginTop: "5px",
        color: "#c2410c",
        fontSize: "13px",
        fontWeight: 700,
      }}
    >
      View details →
    </Link>
  </div>
);

export default function MapPlaceMarker({ place, places = [place], onClick }) {
  const icon = places.length > 1
    ? L.divIcon({
        className: "",
        html: `<span style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border:3px solid #fff;border-radius:50%;background:#c2410c;color:#fff;font-size:12px;font-weight:800;box-shadow:0 2px 8px #0005">${places.length}</span>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      })
    : undefined;

  return (
    <Marker
      position={[place.latitude, place.longitude]}
      icon={icon}
      eventHandlers={onClick ? { click: onClick } : undefined}
    >
      <Popup>
        <div style={{ maxHeight: "65vh", overflowY: "auto", paddingRight: "4px" }}>
          {places.length > 1 && (
            <strong style={{ display: "block", marginBottom: "8px", color: "#0f172a" }}>
              {places.length} places at this map location
            </strong>
          )}
          {places.map((groupedPlace) => (
            <div
              key={groupedPlace.id}
              style={{ padding: "8px 0", borderBottom: "1px solid #e2e8f0" }}
            >
              <MapPlacePopup place={groupedPlace} />
            </div>
          ))}
        </div>
      </Popup>
    </Marker>
  );
}
