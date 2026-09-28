import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { fetchPlaceBySlug } from "../api/client";
import PlaceMap from "../Components/PlaceMap";

import styles from "./PlaceDetails.module.css";

export default function PlaceDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlace = async () => {
      try {
        const data = await fetchPlaceBySlug(slug);
        setPlace(data.data || data);
      } catch (error) {
        console.error("Failed to load place details:", error);
        setPlace(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) loadPlace();
  }, [slug]);

  if (loading) {
    return <h2>Loading place details...</h2>;
  }

  if (!place) {
    return <h2>Place not found</h2>;
  }

  const gallery = Array.isArray(place.gallery) ? place.gallery : [];
  const events = Array.isArray(place.events) ? place.events : [];
  const categories = Array.isArray(place.category) ? place.category : [place.category].filter(Boolean);

  return (
    <div className={styles.page}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <img src={place.image} alt={place.title} className={styles.hero} />

      <div className={styles.content}>
        <h1>{place.title}</h1>
        <p>⭐ {place.rating || 4.5}</p>
        <p>📍 {place.location || place.address || "Jos, Plateau State"}</p>

        {place.open && place.close && (
          <p>
            🕒 {place.open} - {place.close}
          </p>
        )}

        {categories.length > 0 && (
          <div className={styles.categories}>
            {categories.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        )}

        <h2>About</h2>
        <p className={styles.about}>{place.description}</p>

        {gallery.length > 0 && (
          <>
            <h2>Gallery</h2>
            <div className={styles.gallery}>
              {gallery.map((image) => (
                <img key={image} src={image} alt={`${place.title} gallery`} />
              ))}
            </div>
          </>
        )}

        {events.length > 0 && (
          <>
            <h2>Upcoming Events</h2>
            {events.map((event) => (
              <div key={event.title || event.date}>
                <h3>{event.title}</h3>
                <p>{event.date}</p>
                <p>{event.time}</p>
              </div>
            ))}
          </>
        )}
      </div>

      {place.latitude && place.longitude && (
        <div className={styles.mapWrapper}>
          <PlaceMap
            latitude={place.latitude}
            longitude={place.longitude}
            title={place.title}
          />
        </div>
      )}
    </div>
  );
}