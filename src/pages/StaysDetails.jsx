import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Components/headerNav.jsx";
import Footer from "../Components/Footer.jsx";
import styles from "../CSS/StaysPage.module.css";
import { fetchAccommodationDetails, createStayBooking } from "../services/api.js";

export default function StaysDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking Form State
  const [checkIn, setCheckIn] = useState("2026-11-18");
  const [checkOut, setCheckOut] = useState("2026-11-20");
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    async function loadDetails() {
      try {
        setLoading(true);
        const res = await fetchAccommodationDetails(slug || "rayfield-grand-waterside");
        if (res?.success) {
          setProperty(res.data);
        } else {
          setError("Accommodation details not found.");
        }
      } catch (err) {
        console.error("Failed to load property details:", err);
        setError("Failed to connect to accommodation server.");
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [slug]);

  // Calculate nights and total amount dynamically
  const calculateNights = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();
  const basePrice = property?.startingFare || 145000;
  const totalAmount = basePrice * nights * rooms;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("jos_pulse_token");
      if (!token) {
        navigate("/login", { state: { redirectTo: window.location.pathname } });
        return;
      }

      const bookingPayload = {
        userId: "mockUserIdOrDecodedTokenId", // Replace with real auth user ID if available
        propertyName: property?.name || "Rayfield Grand Waterside Resort",
        neighborhood: property?.neighborhood || "Rayfield, Jos",
        checkIn,
        checkOut,
        totalAmount,
        bookingReference: `JP-STAY-${Math.floor(100000 + Math.random() * 900000)}`
      };

      const res = await createStayBooking(bookingPayload);
      if (res?.success) {
        setBookingSuccess(res.data);
        alert(`Booking Confirmed! Reference: ${res.data.bookingReference}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to complete reservation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.staysPageContainer}>
        <Header />
        <div style={{ textAlign: "center", padding: "5rem", fontSize: "1.1rem", color: "#64748b" }}>
          Loading verified property details...
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className={styles.staysPageContainer}>
        <Header />
        <div style={{ textAlign: "center", padding: "5rem" }}>
          <h2>{error || "Property Not Found"}</h2>
          <button onClick={() => navigate("/stays")} className={styles.searchSubmitBtn} style={{ marginTop: "1rem" }}>
            Return to Stays Portal
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.staysPageContainer}>
      <Header />

      <main style={{ maxWidth: "1100px", margin: "2rem auto", padding: "0 1.5rem" }}>
        {/* PROPERTY HEADER */}
        <div style={{ marginBottom: "1.5rem" }}>
          <span className={styles.sectionEyebrow}>📍 {property.neighborhood || "Jos Plateau Corridor"}</span>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#0b132b", margin: "0.25rem 0" }}>
            {property.name}
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>{property.address}</p>
        </div>

        {/* IMAGE GALLERY GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginBottom: "2.5rem" }}>
          <div style={{ height: "380px", borderRadius: "1rem", overflow: "hidden" }}>
            <img 
              src={property.images?.[0]?.url || "/images/rayfield-grand.jpg"} 
              alt={property.name} 
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ height: "182px", borderRadius: "1rem", overflow: "hidden" }}>
              <img 
                src={property.images?.[1]?.url || "/images/hill-station.jpg"} 
                alt="Property gallery view 2" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
            </div>
            <div style={{ height: "182px", borderRadius: "1rem", overflow: "hidden" }}>
              <img 
                src={property.images?.[2]?.url || "/images/lamingo-lodge.jpg"} 
                alt="Property gallery view 3" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
            </div>
          </div>
        </div>

        {/* MAIN CONTENT & BOOKING SIDEBAR */}
        <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: "2.5rem", alignItems: "flex-start" }}>
          
          {/* Left Column: Description & Amenities */}
          <div>
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "1rem", padding: "2rem", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#0b132b", marginBottom: "0.75rem" }}>
                About This Highland Sanctuary
              </h3>
              <p style={{ color: "#64748b", lineHeight: "1.6", fontSize: "0.9rem" }}>
                {property.description}
              </p>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "1rem", padding: "2rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#0b132b", marginBottom: "1rem" }}>
                Verified Property Amenities
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.85rem", color: "#475569", fontWeight: "600" }}>
                {property.amenities?.map((amenity, idx) => (
                  <span key={idx}>✅ {amenity}</span>
                )) || (
                  <>
                    <span>✅ Starlink High-Speed WiFi</span>
                    <span>✅ Stone Fireplace & Heating</span>
                    <span>✅ 24/7 Solar & Generator Backup</span>
                    <span>✅ Chauffeur Airport Pickup</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Booking Box */}
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "1rem", padding: "2rem", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", position: "sticky", top: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div>
                <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0b132b" }}>
                  ₦{basePrice.toLocaleString()}
                </span>
                <small style={{ color: "#64748b", fontSize: "0.75rem", display: "block" }}>per night • taxes included</small>
              </div>
              <span className={styles.badgeFeatured}>⭐ {property.rating || 4.9}</span>
            </div>

            <form onSubmit={handleBookingSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                <div className={styles.searchField}>
                  <label>Check-in</label>
                  <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
                </div>
                <div className={styles.searchField}>
                  <label>Check-out</label>
                  <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
                </div>
              </div>

              <div className={styles.searchField}>
                <label>Guests & Rooms</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  <select value={adults} onChange={(e) => setAdults(Number(e.target.value))}>
                    <option value={1}>1 Adult</option>
                    <option value={2}>2 Adults</option>
                    <option value={4}>4 Adults</option>
                  </select>
                  <select value={rooms} onChange={(e) => setRooms(Number(e.target.value))}>
                    <option value={1}>1 Room</option>
                    <option value={2}>2 Rooms</option>
                  </select>
                </div>
              </div>

              {/* Price Breakdown */}
              <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "0.5rem", border: "1px solid #f1f5f9", fontSize: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem", color: "#64748b" }}>
                  <span>₦{basePrice.toLocaleString()} × {nights} nights</span>
                  <span>₦{(basePrice * nights).toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem", color: "#64748b" }}>
                  <span>Service & Tourism Fee</span>
                  <span>₦0 (Waived)</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "800", color: "#0b132b", borderTop: "1px solid #e2e8f0", paddingTop: "0.5rem", marginTop: "0.5rem" }}>
                  <span>Total Due</span>
                  <span>₦{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button type="submit" disabled={submitting} className={styles.searchSubmitBtn} style={{ width: "100%", padding: "0.85rem" }}>
                {submitting ? "Processing Reservation..." : "Confirm & Book Stay →"}
              </button>

              {bookingSuccess && (
                <div style={{ background: "#dcfce7", color: "#166534", padding: "0.75rem", borderRadius: "0.5rem", fontSize: "0.8rem", textAlign: "center" }}>
                  <strong>Success!</strong> Ref: {bookingSuccess.bookingReference}
                </div>
              )}
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}