import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPlaceBySlug } from "../api/client";
import styles from "./PlaceDetail.module.css";

export function PlaceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(false);

    fetchPlaceBySlug(id)
      .then((response) => {
        const record = response?.data || response;
        if (!record?.title) throw new Error("Place details were not returned");
        if (!cancelled) setPlace(record);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <div className={styles.loader}>Loading place details...</div>;
  }

  if (loadError || !place) {
    return (
      <div className={styles.loader}>
        <div>
          <p>Place details could not be loaded.</p>
          <button type="button" onClick={() => navigate(-1)} className={styles.flightBtn}>
            Back to Discovery
          </button>
        </div>
      </div>
    );
  }

  const adultRate = place.pricing?.adultRate || 0;
  const kidRate = place.pricing?.kidRate || 0;
  const totalEstimate = adults * adultRate + kids * kidRate + selectedAddons.reduce((sum, item) => sum + item.price, 0);

  const handleAddonToggle = (addon) => {
    setSelectedAddons((current) =>
      current.some((item) => item.id === addon.id)
        ? current.filter((item) => item.id !== addon.id)
        : [...current, addon]
    );
  };

  const handleBookingSubmit = (event) => {
    event.preventDefault();
    setBookingSuccess(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.heroBanner}>
        <img className={styles.heroImage} src={place.heroImage} alt="" aria-hidden="true" />
        <div className={styles.heroOverlay}>
          <div className={styles.heroTopRow}>
            <button onClick={() => navigate(-1)} className={styles.backButton}>
              ← Back to Discovery
            </button>
            <div className={styles.heroActions}>
              <button className={styles.circleBtn} aria-label="Bookmark">🔖</button>
              <button className={styles.circleBtn} aria-label="Share">🔗</button>
            </div>
          </div>

          <div className={styles.heroBottomRow}>
            <div className={styles.leftInfo}>
              <div className={styles.badgeGroup}>
                <span className={styles.categoryBadge}>{place.category}</span>
                {place.verified && <span className={styles.verifiedBadge}>✓ Verified Venue</span>}
              </div>
              <h1 className={styles.title}>{place.title}</h1>
              <div className={styles.subMeta}>
                <span>⭐ {place.rating} ({place.reviewsCount} reviews)</span>
                <span>•</span>
                <span>{place.managedBy}</span>
              </div>
              <p className={styles.address}>📍 {place.address}</p>
            </div>

            {place.weather && (
              <div className={styles.weatherCard}>
                <small>Average Daily Temp</small>
                <div className={styles.tempVal}>⛅ {place.weather.temp}°C <span>{place.weather.condition}</span></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {place.tags && (
        <div className={styles.tagsContainer}>
          {place.tags.map((tag) => <span key={tag} className={styles.tagPill}>{tag}</span>)}
        </div>
      )}

      <div className={styles.metricsGrid}>
        <div className={styles.metricItem}><small>OPENING HOURS</small><p><strong>• {place.status}</strong><br />{place.openingHours}</p></div>
        <div className={styles.metricItem}><small>ENTRY / TICKET</small><p><strong>{place.entryPrice}</strong></p></div>
        <div className={styles.metricItem}><small>RECOMMENDED VISIT</small><p>{place.recommendedVisit}</p></div>
        <div className={styles.metricItem}><small>DIRECT HOTLINE</small><p>{place.phone}</p></div>
      </div>

      <div className={styles.flightCallout}>
        <div>
          <h3>✈️ Visiting from Outside Plateau State?</h3>
          <p>Book commercial flights directly into Yakubu Gowon Airport, Jos (JOS).</p>
        </div>
        <button onClick={() => navigate("/flights")} className={styles.flightBtn}>Search Flights to Jos</button>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.leftContent}>
          <div className={styles.tabNav}>
            <button className={activeTab === "about" ? styles.activeTab : ""} onClick={() => setActiveTab("about")}>About the Spot</button>
            <button className={activeTab === "highlights" ? styles.activeTab : ""} onClick={() => setActiveTab("highlights")}>Highlights & Amenities</button>
          </div>

          {activeTab === "about" ? (
            <div className={styles.tabBody}>
              <h2>{place.overviewHeading}</h2>
              {place.description?.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              {place.quote && <div className={styles.quoteBox}><p>"{place.quote.text}"</p><small>— {place.quote.author}</small></div>}
              {place.gallery?.length > 0 && (
                <div className={styles.galleryGrid}>
                  {place.gallery.map((image, index) => <img key={image} src={image} alt={`${place.title} view ${index + 1}`} />)}
                </div>
              )}
              {place.visitorTips && (
                <div className={styles.tipsBox}>
                  <h3>💡 Local Visitor Tips</h3>
                  <ul>{place.visitorTips.map((tip) => <li key={tip}>✓ {tip}</li>)}</ul>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.tabBody}>
              <h2>Venue Amenities & Accessibility</h2>
              <ul className={styles.amenitiesList}>
                <li>📍 Located in {place.address}</li>
                <li>📞 Customer Support & Desk: {place.phone}</li>
                <li>🕒 Standard Visiting Hours: {place.openingHours}</li>
                <li>🛡️ Safety: Security & verified tour guides available on site</li>
              </ul>
            </div>
          )}
        </div>

        <div className={styles.rightSidebar}>
          <div className={styles.bookingCard}>
            <small>STANDARD ENTRY</small>
            <div className={styles.priceHeading}>
              <h2>{adultRate > 0 ? `₦${adultRate.toLocaleString()}` : "Free Entry"}</h2>
              <span className={styles.instantBadge}>Instant Confirmation</span>
            </div>

            {!bookingSuccess ? (
              <form onSubmit={handleBookingSubmit}>
                <div className={styles.fieldGroup}>
                  <label>Visit Date</label>
                  <input type="date" defaultValue={new Date().toISOString().split("T")[0]} required />
                </div>
                <div className={styles.counterRow}>
                  <div><strong>Adults</strong><small>{adultRate > 0 ? `₦${adultRate.toLocaleString()}` : "Free"}</small></div>
                  <div className={styles.counterBtns}>
                    <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))}>-</button><span>{adults}</span><button type="button" onClick={() => setAdults(adults + 1)}>+</button>
                  </div>
                </div>
                <div className={styles.counterRow}>
                  <div><strong>Kids</strong><small>{kidRate > 0 ? `₦${kidRate.toLocaleString()}` : "Free"}</small></div>
                  <div className={styles.counterBtns}>
                    <button type="button" onClick={() => setKids(Math.max(0, kids - 1))}>-</button><span>{kids}</span><button type="button" onClick={() => setKids(kids + 1)}>+</button>
                  </div>
                </div>
                {place.pricing?.addons?.length > 0 && (
                  <div className={styles.addonsSection}>
                    <label>Optional Experiences</label>
                    {place.pricing.addons.map((addon) => (
                      <div key={addon.id} className={styles.addonRow}>
                        <input type="checkbox" id={addon.id} onChange={() => handleAddonToggle(addon)} />
                        <label htmlFor={addon.id}>{addon.name}</label>
                        <span>+₦{addon.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className={styles.totalRow}><span>Estimated Total</span><strong>₦{totalEstimate.toLocaleString()}</strong></div>
                <button type="submit" className={styles.bookNowBtn}>Confirm & Reserve Entry Pass</button>
              </form>
            ) : (
              <div className={styles.successBox}>
                <h3>🎉 Pass Reserved!</h3>
                <p>Your visit pass for {place.title} has been generated.</p>
                <button onClick={() => setBookingSuccess(false)} className={styles.resetBtn}>Book Another Entry</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceDetailPage;
