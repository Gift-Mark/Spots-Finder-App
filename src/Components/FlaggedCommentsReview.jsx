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

export default function FlaggedCommentsReview() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await request("/api/admin/flagged-content");
      setReports(data.data || []);
      setError("");
    } catch (loadError) {
      setError(loadError.message || "Could not load flagged comments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchReports = async () => {
      try {
        const data = await request("/api/admin/flagged-content");
        if (isMounted) {
          setReports(data.data || []);
          setError("");
        }
      } catch (loadError) {
        if (isMounted) setError(loadError.message || "Could not load flagged comments.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchReports();
    return () => {
      isMounted = false;
    };
  }, []);

  const reviewReport = async (report, action) => {
    try {
      await request(`/api/admin/flagged-content/${report._id}`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
      });
      setReports((current) => current.filter((item) => item._id !== report._id));
      setError("");
    } catch (reviewError) {
      setError(reviewError.message || "Could not review this comment report.");
    }
  };

  return (
    <section style={{ background: "#FFFFFF", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginTop: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, color: "#1E293B", fontSize: 18 }}>Flagged Comments ({reports.length})</h2>
          <p style={{ margin: "4px 0 0", color: "#64748B", fontSize: 13 }}>Review community reports, remove comments, or dismiss reports.</p>
        </div>
        <button type="button" onClick={loadReports} style={buttonStyle("#F1F5F9", "#334155")}>Refresh</button>
      </div>

      {error && <p role="alert" style={{ color: "#B91C1C" }}>{error}</p>}
      {loading ? (
        <p style={{ color: "#64748B" }}>Loading flagged comments...</p>
      ) : reports.length === 0 ? (
        <p style={{ color: "#64748B" }}>There are no pending comment reports.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {reports.map((report) => (
            <article key={report._id} style={{ border: "1px solid #FECACA", borderRadius: 9, padding: 16 }}>
              <p style={{ margin: "0 0 8px", color: "#0F172A", whiteSpace: "pre-wrap" }}>{report.contentSnippet}</p>
              <p style={{ margin: "4px 0", color: "#475569", fontSize: 13 }}>
                Reason: {report.reason} · Reported by {report.reporterId?.firstName || report.reporterName || "Community member"}
              </p>
              <p style={{ margin: "4px 0 12px", color: "#64748B", fontSize: 12 }}>
                {new Date(report.createdAt).toLocaleString()}
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" onClick={() => reviewReport(report, "remove_comment")} style={buttonStyle("#DC2626", "#FFFFFF")}>Remove comment</button>
                <button type="button" onClick={() => reviewReport(report, "dismiss")} style={buttonStyle("#F1F5F9", "#334155")}>Dismiss report</button>
              </div>
            </article>
          ))}
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
