import { useParams, useNavigate } from "react-router-dom";

import places from "../../server/data/places.js";
import PlaceMap from "../Components/PlaceMap";

import styles from "./PlaceDetails.module.css";

export default function PlaceDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const place = places.find(
    (p) => p.slug === slug
  );


  // Slugs are the stable public identifier used by place-card links.
  if (!place) {
    return <h2>Place not found</h2>;
  }

  return (
    <div className={styles.page}>

      {/* Back Button */}
      <button
        className={styles.backButton}
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      {/* Hero Image */}
      <img
        src={place.image}
        alt={place.title}
        className={styles.hero}
      />

      {/* Venue Info */}
      <div className={styles.content}>
        <h1>{place.title}</h1>

        <p>⭐ {place.rating}</p>

        <p>📍 {place.location}</p>

        <p>
          🕒 {place.open} - {place.close}
        </p>

        {/* Categories */}
        <div className={styles.categories}>
          {place.category.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        {/* About */}
        <h2>About</h2>
        <p className={styles.about}>{place.description}</p>

        {/* Gallery */}
        <h2>Gallery</h2>

        <div className={styles.gallery}>
          {place.gallery.map((image) => (
            <img
              key={image}
              src={image}
              alt={`${place.title} gallery`}
            />
          ))}
        </div>

        {/* Upcoming Events */}
        <h2>Upcoming Events</h2>

        {place.events.map((event) => (
          <div key={event.title}>
            <h3>{event.title}</h3>

            <p>{event.date}</p>

            <p>{event.time}</p>
          </div>
        ))}
      </div>

      {/* Map */}
      <div className={styles.mapWrapper}>
        <PlaceMap
          latitude={place.latitude}
          longitude={place.longitude}
          title={place.title}
        />
      </div>

    </div>
  );
}