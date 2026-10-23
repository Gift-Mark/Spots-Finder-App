import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../Components/headerNav.jsx";
import Footer from "../Components/Footer.jsx";
import styles from "../CSS/StaysPage.module.css";
import { JOS_HOTELS } from "../data/hotelsData.js";
import { 
  toggleSaveSpot, 
  checkIsSaved, 
  fetchReviews, 
  postReview 
} from "../api/client.js";
import {
  createStayBooking,
  fetchAccommodationDetails,  
} from '../services/api.js'

export default function StaysDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Like / Save State
  const [isSaved, setIsSaved] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Booking Form State
  const [checkIn, setCheckIn] = useState("2026-11-18");
  const [checkOut, setCheckOut] = useState("2026-11-20");
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);
  
  // Find matching hotel in static directory for room types
  const currentHotel = JOS_HOTELS.find(h => h.id === slug || h.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug);
  
  // Selected Room Type Price State
  const [selectedRate, setSelectedRate] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    async function loadDetails() {
      try {
        setLoading(true);
        const res = await fetchAccommodationDetails(slug || "rayfield-grand-waterside");
        let propData = null;

        if (res?.success && res.data) {
          propData = res.data;
          setProperty(propData);
          setSelectedRate(propData.startingFare || currentHotel?.pricePerNight || 45000);
        } else if (currentHotel) {
          propData = {
            _id: currentHotel.id || slug,
            name: currentHotel.name,
            neighborhood: currentHotel.neighborhood,
            address: currentHotel.address,
            description: `${currentHotel.name} is a premier hospitality provider located in ${currentHotel.neighborhood}, Jos, offering luxury accommodations, crisp highland air, and exceptional comfort.`,
            startingFare: currentHotel.pricePerNight,
            rating: currentHotel.starRating || 4.5,
            amenities: currentHotel.amenities,
            images: [
              { url: currentHotel.image },
              { url: "/images/Hill Station.jpg" },
              { url: "/images/Valada.jpg" }
            ]
          };
          setProperty(propData);
          setSelectedRate(currentHotel.pricePerNight);
        } else {
          setError("Accommodation details not found.");
          return;
        }

        // Check if property is saved/liked by user & load reviews
        const propId = propData._id || slug;
        try {
          const savedRes = await checkIsSaved(propId);
          if (savedRes?.isSaved) setIsSaved(true);

          const reviewsRes = await fetchReviews(propId);
          if (Array.isArray(reviewsRes)) setReviews(reviewsRes);
          else if (reviewsRes?.data) setReviews(reviewsRes.data);
        } catch (subErr) {
          console.warn("Could not fetch user save/review state:", subErr);
        }

      } catch (err) {
        console.warn("API offline, utilizing local static fallback:", err);
        if (currentHotel) {
          setProperty({
            _id: currentHotel.id || slug,
            name: currentHotel.name,
            neighborhood: currentHotel.neighborhood,
            address: currentHotel.address,
            description: `${currentHotel.name} located in ${currentHotel.neighborhood}, Jos.`,
            startingFare: currentHotel.pricePerNight,
            rating: currentHotel.starRating || 4.5,
            amenities: currentHotel.amenities,
            images: [
              { url: currentHotel.image },
              { url: "/images/Hill Station.jpg" },
              { url: "/images/Valada.jpg" }
            ]
          });
          setSelectedRate(currentHotel.pricePerNight);
        } else {
          setError("Failed to connect to accommodation server.");
        }
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [slug, currentHotel]);

  // Handle Like / Save Toggle
  const handleToggleSave = async () => {
    const token = localStorage.getItem("token") || localStorage.getItem("jos_pulse_token");
    if (!token) {
      navigate("/login", { state: { redirectTo: window.location.pathname } });
      return;
    }

    try {
      setSavingLoading(true);
      const propId = property?._id || slug;
      const res = await toggleSaveSpot(propId);
      if (res?.success || res) {
        setIsSaved(prev => !prev);
      }
    } catch (err) {
      console.error("Failed to toggle save state:", err);
    } finally {
      setSavingLoading(false);
    }
  };

  // Handle Review Submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token") || localStorage.getItem("jos_pulse_token");
    if (!token) {
      navigate("/login", { state: { redirectTo: window.location.pathname } });
      return;
    }

    if (!newComment.trim()) return;

    try {
      setReviewSubmitting(true);
      const propId = property?._id || slug;
      const res = await postReview(propId, {
        rating: Number(newRating),
        comment: newComment.trim()
      });

      if (res?.success || res) {
        // Refresh reviews list
        const updatedReviews = await fetchReviews(propId);
        if (Array.isArray(updatedReviews)) setReviews(updatedReviews);
        else if (updatedReviews?.data) setReviews(updatedReviews.data);
        else {
          setReviews(prev => [{ rating: Number(newRating), comment: newComment.trim(), createdAt: new Date() }, ...prev]);
        }
        setNewComment("");
        alert("Review posted successfully!");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to post review. Please try again.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Calculate nights and total amount dynamically
  const calculateNights = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();
  const basePrice = selectedRate || property?.startingFare || 45000;
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
        userId: "mockUserIdOrDecodedTokenId",
        propertyName: property?.name || "Jos Highland Sanctuary",
        neighborhood: property?.neighborhood || "Jos, Plateau State",
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
        <div style={{ textAlign: "center", padding: "6rem", fontSize: "1.1rem", color: "#64748b", fontWeight: "600" }}>
          Loading sanctuary details...
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className={styles.staysPageContainer}>
        <Header />
        <div style={{ textAlign: "center", padding: "6rem" }}>
          <h2 style={{ color: "#0b132b", marginBottom: "1rem" }}>{error || "Property Not Found"}</h2>
          <button onClick={() => navigate("/stays")} className={styles.searchSubmitBtn}>
            ← Return to Stays Portal
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.staysPageContainer}>
      <Header />

      <main style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1.5rem" }}>
        
        {/* BREADCRUMB / BACK LINK */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <Link to="/stays" style={{ color: "#f97316", textDecoration: "none", fontWeight: "600", fontSize: "0.9rem" }}>
            ← Back to all verified stays
          </Link>
          
          {/* Like / Save Button */}
          <button 
            type="button"
            onClick={handleToggleSave}
            disabled={savingLoading}
            title={isSaved ? "Remove from saved stays" : "Save this stay"}
            style={{
              background: "#ffffff",
              border: "1px solid #cbd5e1",
             width: "42px",
              height: "42px",
              borderRadius: "2rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
              transition: "transform 0.2s ease,border-color 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#f43f5e"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "#cbd5e1"}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              width="20" 
              height="20" 
              fill={isSaved ? "#f43f5e" : "none"} 
              stroke={isSaved ? "#f43f5e" : "#475569"} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ transition: "fill 0.2s ease, stroke 0.2s ease" }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>

        {/* PROPERTY HEADER */}
        <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.35rem" }}>
              <span className={styles.sectionEyebrow} style={{ margin: 0 }}>📍 {property.neighborhood || "Jos Plateau Corridor"}</span>
              <span style={{ background: "#ffedd5", color: "#c2410c", padding: "2px 8px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "700" }}>Jos Pulse Verified</span>
            </div>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "800", color: "#0b132b", margin: 0 }}>
              {property.name}
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.95rem", margin: "0.25rem 0 0 0" }}>{property.address || property.neighborhood + ", Jos Plateau State"}</p>
          </div>

          <div style={{ background: "#fff", border: "1px solid #e2e8f0", padding: "0.75rem 1.25rem", borderRadius: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
            <span style={{ fontSize: "1.25rem" }}>⭐</span>
            <div>
              <div style={{ fontWeight: "800", color: "#0b132b", fontSize: "1.1rem" }}>{property.rating || 4.8} / 5.0</div>
              <small style={{ color: "#64748b", fontSize: "0.75rem" }}>{reviews.length} Guest Reviews</small>
            </div>
          </div>
        </div>

        {/* IMAGE GALLERY GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.25rem", marginBottom: "3rem" }}>
          <div style={{ height: "420px", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <img 
              src={property.images?.[0]?.url || property.images?.[0] || "/images/Crispan.jpg"} 
              alt={property.name} 
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ height: "197px", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
              <img 
                src={property.images?.[1]?.url || property.images?.[1] || "/images/Hill Station.jpg"} 
                alt="Gallery view 2" 
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
              />
            </div>
            <div style={{ height: "197px", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
              <img 
                src={property.images?.[2]?.url || property.images?.[2] || "/images/Valada.jpg"} 
                alt="Gallery view 3" 
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
              />
            </div>
          </div>
        </div>

        {/* MAIN CONTENT & STICKY BOOKING SIDEBAR */}
        <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1.1fr", gap: "3rem", alignItems: "flex-start" }}>
          
          {/* Left Column: About, Amenities, Reviews & Comment Form */}
          <div>
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "1rem", padding: "2.5rem", marginBottom: "2rem", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
              <h3 style={{ fontSize: "1.35rem", fontWeight: "800", color: "#0b132b", marginBottom: "1rem" }}>
                About This Highland Sanctuary
              </h3>
              <p style={{ color: "#475569", lineHeight: "1.8", fontSize: "1rem", margin: 0 }}>
                {property.description}
              </p>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "1rem", padding: "2.5rem", marginBottom: "2rem", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
              <h3 style={{ fontSize: "1.35rem", fontWeight: "800", color: "#0b132b", marginBottom: "1.25rem" }}>
                Verified Property Amenities & Features
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.95rem", color: "#334155", fontWeight: "600" }}>
                {property.amenities?.map((amenity, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: "#16a34a" }}>✓</span> {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* REVIEWS & COMMENTS SECTION */}
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "1rem", padding: "2.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
              <h3 style={{ fontSize: "1.35rem", fontWeight: "800", color: "#0b132b", marginBottom: "1.5rem" }}>
                Guest Reviews & Ratings ({reviews.length})
              </h3>

              {/* Review Submission Form */}
              <form onSubmit={handleReviewSubmit} style={{ marginBottom: "2rem", background: "#f8fafc", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
                <h4 style={{ margin: "0 0 1rem 0", fontSize: "1rem", color: "#1e293b" }}>Leave your rating & comment</h4>
                
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", marginBottom: "0.4rem", color: "#475569" }}>Rating (1 to 5 Stars)</label>
                  <select 
                    value={newRating} 
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", background: "#fff", fontWeight: "600" }}
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5 - Exceptional)</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5 - Great)</option>
                    <option value={3}>⭐⭐⭐ (3/5 - Good)</option>
                    <option value={2}>⭐⭐ (2/5 - Fair)</option>
                    <option value={1}>⭐ (1/5 - Poor)</option>
                  </select>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", marginBottom: "0.4rem", color: "#475569" }}>Your Experience</label>
                  <textarea 
                    rows="3"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="How was your stay? Mention cleanliness, views, hospitality, or room comfort..."
                    required
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", background: "#fff", fontSize: "0.9rem", boxSizing: "border-box" }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={reviewSubmitting}
                  style={{ background: "#0b132b", color: "#fff", border: "none", padding: "0.75rem 1.5rem", borderRadius: "0.5rem", fontWeight: "700", fontSize: "0.9rem", cursor: "pointer" }}
                >
                  {reviewSubmitting ? "Posting Review..." : "Submit Review →"}
                </button>
              </form>

              {/* Display Reviews List */}
              {reviews.length === 0 ? (
                <p style={{ color: "#64748b", fontStyle: "italic", fontSize: "0.9rem" }}>No reviews yet. Be the first guest to leave feedback for this sanctuary!</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {reviews.map((rev, i) => (
                    <div key={i} style={{ padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0", background: "#fff" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <span style={{ fontWeight: "700", color: "#0b132b", fontSize: "0.95rem" }}>
                          {rev.user?.name || rev.author || "Jos Visitor"}
                        </span>
                        <span style={{ color: "#f59e0b", fontWeight: "700" }}>
                          {"⭐".repeat(rev.rating || 5)}
                        </span>
                      </div>
                      <p style={{ color: "#475569", fontSize: "0.9rem", margin: 0, lineHeight: "1.5" }}>
                        {rev.comment || rev.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Sticky Interactive Reservation Card */}
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "1rem", padding: "2.25rem", boxShadow: "0 15px 35px rgba(0,0,0,0.06)", position: "sticky", top: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "1rem" }}>
              <div>
                <span style={{ fontSize: "1.75rem", fontWeight: "800", color: "#0b132b" }}>
                  ₦{basePrice.toLocaleString()}
                </span>
                <span style={{ color: "#64748b", fontSize: "0.85rem", marginLeft: "4px" }}>/ night</span>
              </div>
              <span style={{ fontSize: "0.85rem", color: "#16a34a", fontWeight: "700", background: "#dcfce7", padding: "4px 10px", borderRadius: "20px" }}>Instant Confirmation</span>
            </div>

            <form onSubmit={handleBookingSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              
              {/* Dynamic Room Tier Selector from hotelsData */}
              {currentHotel?.roomTypes && currentHotel.roomTypes.length > 0 && (
                <div className={styles.searchField}>
                  <label>Select Room Category</label>
                  <select 
                    onChange={(e) => setSelectedRate(Number(e.target.value))} 
                    value={selectedRate}
                    style={{ fontWeight: "600" }}
                  >
                    {currentHotel.roomTypes.map((room, idx) => (
                      <option key={idx} value={room.price}>
                        {room.type} - ₦{room.price.toLocaleString()} / night
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div className={styles.searchField}>
                  <label>Check-in Date</label>
                  <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
                </div>
                <div className={styles.searchField}>
                  <label>Check-out Date</label>
                  <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
                </div>
              </div>

              <div className={styles.searchField}>
                <label>Guests & Accommodation</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <select value={adults} onChange={(e) => setAdults(Number(e.target.value))}>
                    <option value={1}>1 Adult</option>
                    <option value={2}>2 Adults</option>
                    <option value={3}>3 Adults</option>
                    <option value={4}>4+ Adults</option>
                  </select>
                  <select value={rooms} onChange={(e) => setRooms(Number(e.target.value))}>
                    <option value={1}>1 Room</option>
                    <option value={2}>2 Rooms</option>
                    <option value={3}>3 Rooms</option>
                  </select>
                </div>
              </div>

              {/* Price Calculation Card */}
              <div style={{ background: "#f8fafc", padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0", fontSize: "0.9rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", color: "#64748b" }}>
                  <span>₦{basePrice.toLocaleString()} × {nights} nights ({rooms} room)</span>
                  <span>₦{(basePrice * nights * rooms).toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", color: "#64748b" }}>
                  <span>Plateau Eco & Tourism Fee</span>
                  <span>Free</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "800", color: "#0b132b", borderTop: "1px solid #cbd5e1", paddingTop: "0.75rem", marginTop: "0.5rem", fontSize: "1.05rem" }}>
                  <span>Total Amount Due</span>
                  <span style={{ color: "#f97316" }}>₦{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={submitting} 
                className={styles.searchSubmitBtn} 
                style={{ width: "100%", padding: "1rem", fontSize: "1rem", fontWeight: "700", cursor: "pointer" }}
              >
                {submitting ? "Securing Reservation..." : "Confirm & Reserve Stay →"}
              </button>

              {bookingSuccess && (
                <div style={{ background: "#dcfce7", color: "#166534", padding: "1rem", borderRadius: "0.75rem", fontSize: "0.85rem", textAlign: "center", border: "1px solid #bbf7d0" }}>
                  <strong>Reservation Confirmed!</strong><br />
                  Reference: <code>{bookingSuccess.bookingReference}</code>
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