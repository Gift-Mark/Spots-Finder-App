export default function AdminSettings({ darkMode, onDarkModeChange, onSignOut, onOpenLogs }) {
  const adminUser = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 720 }}>
      <section style={cardStyle}>
        <h2 style={headingStyle}>Appearance</h2>
        <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <span>
            <strong>Dark mode</strong>
            <span style={subheadingStyle}>Use a darker theme for the admin workspace.</span>
          </span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(event) => onDarkModeChange(event.target.checked)}
            aria-label="Enable admin dark mode"
          />
        </label>
      </section>

      <section style={cardStyle}>
        <h2 style={headingStyle}>Administrator account</h2>
        <p style={{ margin: "0 0 14px", color: "#475569" }}>
          Signed in as {adminUser.firstName || "Administrator"} {adminUser.lastName || ""}
          {adminUser.email ? ` (${adminUser.email})` : ""}.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" onClick={onOpenLogs} style={buttonStyle("#F1F5F9", "#334155")}>Open system logs</button>
          <button type="button" onClick={onSignOut} style={buttonStyle("#FEE2E2", "#B91C1C")}>Log out</button>
        </div>
      </section>
    </div>
  );
}

const cardStyle = {
  background: "#FFFFFF",
  borderRadius: 12,
  padding: 24,
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
};

const headingStyle = { margin: "0 0 16px", color: "#1E293B", fontSize: 18 };
const subheadingStyle = { display: "block", marginTop: 4, color: "#64748B", fontSize: 13 };
const buttonStyle = (background, color) => ({
  background,
  color,
  border: "none",
  borderRadius: 6,
  padding: "9px 14px",
  fontWeight: 600,
  cursor: "pointer",
});
