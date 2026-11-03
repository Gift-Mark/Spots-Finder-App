import { useCallback, useEffect, useState } from "react";

const request = async (url, options = {}) => {
  const token = localStorage.getItem("token") || localStorage.getItem("jos_pulse_token");
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || `Request failed (${response.status}).`);
  }
  return data;
};

export default function VendorVerificationReview() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadClaims = useCallback(async () => {
    setLoading(true);
    try {
      const data = await request("/api/admin/vendor-claims");
      setClaims(data.data || []);
      setError("");
    } catch (loadError) {
      setError(loadError.message || "Could not load vendor documents.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchClaims = async () => {
      try {
        const data = await request("/api/admin/vendor-claims");
        if (isMounted) {
          setClaims(data.data || []);
          setError("");
        }
      } catch (loadError) {
        if (isMounted) setError(loadError.message || "Could not load vendor documents.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchClaims();
    return () => {
      isMounted = false;
    };
  }, []);

  const reviewClaim = async (claim, status) => {
    const reviewNote =
      status === "rejected"
        ? window.prompt("Why is this document being rejected?")?.trim()
        : "";
    if (status === "rejected" && !reviewNote) return;

    try {
      await request(`/api/admin/vendor-claims/${claim._id}`, {
        method: "PATCH",
        body: JSON.stringify({ status, reviewNote }),
      });
      setClaims((current) =>
        current.map((item) => (item._id === claim._id ? { ...item, status, reviewNote } : item))
      );
      setError("");
    } catch (reviewError) {
      setError(reviewError.message || "Could not update this vendor claim.");
    }
  };

  const viewDocument = async (claim) => {
    const documentWindow = window.open("", "_blank");
    if (!documentWindow) {
      setError("Allow pop-ups to view vendor documents.");
      return;
    }

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("jos_pulse_token");
      const response = await fetch(`/api/admin/vendor-claims/${claim._id}/document`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Could not open document (${response.status}).`);
      }
      const documentBlob = await response.blob();
      const documentUrl = URL.createObjectURL(documentBlob);
      documentWindow.location.href = documentUrl;
      window.setTimeout(() => URL.revokeObjectURL(documentUrl), 60000);
      setError("");
    } catch (documentError) {
      documentWindow.close();
      setError(documentError.message || "Could not open this document.");
    }
  };

  return (
    <section style={{ background: "#FFFFFF", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginTop: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, color: "#1E293B", fontSize: 18 }}>Vendor Documents & Claims</h2>
          <p style={{ margin: "4px 0 0", color: "#64748B", fontSize: 13 }}>Review proof-of-ownership documents submitted with vendor claims.</p>
        </div>
        <button type="button" onClick={loadClaims} style={buttonStyle("#F1F5F9", "#334155")}>Refresh</button>
      </div>

      {error && <p role="alert" style={{ color: "#B91C1C" }}>{error}</p>}
      {loading ? (
        <p style={{ color: "#64748B" }}>Loading vendor documents...</p>
      ) : claims.length === 0 ? (
        <p style={{ color: "#64748B" }}>No vendor claims have been submitted yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {claims.map((claim) => {
            const pending = claim.status === "pending";
            return (
              <article key={claim._id} style={{ border: "1px solid #E2E8F0", borderRadius: 9, padding: 16, display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <strong style={{ color: "#0F172A" }}>{claim.businessName}</strong>
                  <p style={{ margin: "4px 0", color: "#475569", fontSize: 13 }}>
                    {claim.ownerName} · {claim.email} · {claim.category}
                  </p>
                  <p style={{ margin: "4px 0", color: "#64748B", fontSize: 12 }}>
                    Submitted {new Date(claim.createdAt).toLocaleString()} · Status: {claim.status}
                  </p>
                  {claim.reviewNote && <p style={{ color: "#B91C1C", margin: "6px 0" }}>Review note: {claim.reviewNote}</p>}
                  <button type="button" onClick={() => viewDocument(claim)} style={linkButtonStyle}>
                    View {claim.originalFileName || "ownership document"}
                  </button>
                </div>
                {pending && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button type="button" onClick={() => reviewClaim(claim, "approved")} style={buttonStyle("#16A34A", "#FFFFFF")}>Approve</button>
                    <button type="button" onClick={() => reviewClaim(claim, "rejected")} style={buttonStyle("#DC2626", "#FFFFFF")}>Reject</button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

const buttonStyle = (background, color) => ({
  border: "none",
  borderRadius: 6,
  padding: "8px 12px",
  background,
  color,
  fontWeight: 600,
  cursor: "pointer",
});

const linkButtonStyle = {
  border: "none",
  padding: 0,
  background: "transparent",
  color: "#C2410C",
  fontWeight: 600,
  cursor: "pointer",
  textDecoration: "underline",
};
