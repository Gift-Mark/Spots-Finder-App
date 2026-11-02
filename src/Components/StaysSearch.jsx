import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import Header from "./headerNav.jsx";
import Footer from "./Footer.jsx";
import styles from "../CSS/StaysPage.module.css";
import { JOS_HOTELS } from "../data/hotelsData.js";
import { JOS_STAYS_DIRECTORY } from "../data/accomodationData.js";
import { JOS_LOUNGES } from "../data/loungesData.js";

const ALL_STAYS_INVENTORY = [
  ...JOS_HOTELS,
  ...(Array.isArray(JOS_LOUNGES) ? JOS_LOUNGES : []),
  ...((JOS_STAYS_DIRECTORY && [
    ...(JOS_STAYS_DIRECTORY.traditionalHotels || []),
    ...(JOS_STAYS_DIRECTORY.boutiqueResorts || []),
    ...(JOS_STAYS_DIRECTORY.servicedApartments || [])
  ]) || [])
];

export default function StaysSearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const destinationQuery = searchParams.get("destination") || "Jos";
  const typeQuery = searchParams.get("type") || "All accommodation";

  // Filter States
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceFilter, setPriceFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;

    // Process filtering inside a timer to prevent synchronous cascading render loops
    const timer = setTimeout(() => {
      if (!isMounted) return;

      let filtered = ALL_STAYS_INVENTORY.filter((item) => {
        const matchesNeighborhood = 
          !destinationQuery ||
          item.neighborhood?.toLowerCase().includes(destinationQuery.toLowerCase()) ||
          item.name?.toLowerCase().includes(destinationQuery.toLowerCase()) ||
          item.address?.toLowerCase().includes(destinationQuery.toLowerCase());

        return matchesNeighborhood;
      });

      if (typeQuery !== "All accommodation") {
        filtered = filtered.filter(item => {
          const cat = (item.category || item.propertyType || "").toLowerCase();
          return cat.includes(typeQuery.toLowerCase());
        });
      }

      setResults(filtered);
      setLoading(false);
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [destinationQuery, typeQuery]);

  // Handle advanced sorting & filtering
  const displayedResults = results.filter(item => {
    const price = item.pricePerNight || item.startingFare || item.price || 45000;
    if (priceFilter === "budget" && price > 40000) return false;
    if (priceFilter === "mid" && (price <= 40000 || price > 80000)) return false;
    if (priceFilter === "luxury" && price <= 80000) return false;

    const rating = item.starRating || item.rating || 4.5;
    if (ratingFilter === "4.8" && rating < 4.8) return false;

    return true;
  });

  return (
    <div className={styles.staysPageContainer} style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Header />

      <main style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1.5rem" }}>
        
        {/* TOP SEARCH HEADER BAR */}
        <div style={{ background: "#0b132b", color: "#fff", padding: "2rem", borderRadius: "1rem", marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <Link to="/stays" style={{ color: "#f97316", textDecoration: "none", fontWeight: "700", fontSize: "0.85rem", display: "inline-block", marginBottom: "0.5rem" }}>
              ← Back to Stays Portal
            </Link>
            <h1 style={{ fontSize: "1.75rem", fontWeight: "800", margin: 0 }}>
              Search Results for "{destinationQuery}"
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: "0.25rem 0 0 0" }}>
              Showing verified accommodations matching your criteria ({displayedResults.length} properties found)
            </p>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <select 
              value={priceFilter} 
              onChange={(e) => setPriceFilter(e.target.value)}
              style={{ padding: "0.6rem 1rem", borderRadius: "0.5rem", border: "1px solid #334155", background: "#1e293b", color: "#fff", fontWeight: "600" }}
            >
              <option value="all">All Prices</option>
              <option value="budget">Budget (Under ₦40k)</option>
              <option value="mid">Mid-Range (₦40k - ₦80k)</option>
              <option value="luxury">Luxury (Above ₦80k)</option>
            </select>

            <select 
              value={ratingFilter} 
              onChange={(e) => setRatingFilter(e.target.value)}
              style={{ padding: "0.6rem 1rem", borderRadius: "0.5rem", border: "1px solid #334155", background: "#1e293b", color: "#fff", fontWeight: "600" }}
            >
              <option value="all">All Ratings</option>
              <option value="4.8">⭐ 4.8 & above</option>
            </select>
          </div>
        </div>

        {/* RESULTS GRID */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "5rem", color: "#64748b", fontWeight: "700" }}>
            Searching highland inventory...
          </div>
        ) : displayedResults.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "1rem", padding: "4rem", textAlign: "center" }}>
            <h3 style={{ color: "#0b132b", fontSize: "1.25rem", marginBottom: "0.5rem" }}>No matching sanctuaries found</h3>
            <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.5rem" }}>Try adjusting your search destination, price filters, or property category.</p>
            <button 
              onClick={() => navigate("/stays")} 
              style={{ background: "#f97316", color: "#fff", border: "none", padding: "0.75rem 1.5rem", borderRadius: "0.5rem", fontWeight: "700", cursor: "pointer" }}
            >
              Reset Search Filters
            </button>
          </div>
        ) : (
          <div className={styles.fourCardGrid} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "1.5rem" }}>
            {displayedResults.map((stay, idx) => {
              const stayId = stay.id || stay._id || stay.slug || idx;
              const stayName = stay.name || stay.title;
              const stayImage = stay.image || stay.heroImage || stay.images?.[0]?.url || "/images/Crispan.jpg";
              const stayPrice = stay.pricePerNight || stay.startingFare || stay.price || 45000;
              const stayRating = stay.starRating || stay.rating || 4.8;
              const stayNeighborhood = stay.neighborhood || stay.location || "Jos, Plateau State";

              return (
                <div key={stayId} className={styles.standardStayCard} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "0.85rem", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
                  <div className={styles.stdImgBox} style={{ position: "relative", height: "190px" }}>
                    <span className={styles.stdBadge} style={{ position: "absolute", top: "12px", left: "12px", background: "rgba(0,0,0,0.7)", color: "#fff", padding: "3px 8px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "700" }}>
                      ⭐ {stayRating}
                    </span>
                    <img src={stayImage} alt={stayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div className={styles.stdBody} style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                    <div>
                      <h4 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#0b132b", margin: "0 0 0.25rem 0" }}>{stayName}</h4>
                      <p style={{ color: "#64748b", fontSize: "0.85rem", margin: "0 0 1rem 0" }}>📍 {stayNeighborhood}</p>
                    </div>
                    <div className={styles.stdPriceRow} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "0.75rem" }}>
                      <strong style={{ color: "#f97316", fontSize: "1.05rem" }}>₦{stayPrice.toLocaleString()} <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "normal" }}>/ night</span></strong>
                      <Link to={`/stays/${stay.slug || stay.id}`} className={styles.stdReserveBtn} style={{ background: "#0b132b", color: "#fff", padding: "0.4rem 0.9rem", borderRadius: "0.4rem", textDecoration: "none", fontSize: "0.85rem", fontWeight: "700" }}>
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}