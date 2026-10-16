import { useState, useEffect } from "react";
import AdminSidebar from "./Components/AdminSidebar";
import AdminHeader from "./Components/AdminHeader";
import PromotedVenuesTable from "./Components/PromotedVenuesTable";
import VenueManagement from "./Components/VenueManagement";
import EventModeration from "./Components/EventModeration";
import UserManagement from "./Components/UserManagement";
import AdManagement from "./Components/AdManagement";
import SystemLogs from "./Components/SystemLogs";
import styles from "./CSS/AdminDashboard.module.css";

// API Client Methods
import {
  fetchPlaces,
  createPlace,
  updatePlace,
  deletePlace,
} from "./api/client";

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminSearchQuery, setAdminSearchQuery] = useState(""); 

  // State for Flagged Content Queue
  const [flaggedItems, setFlaggedItems] = useState([]);

  // Modal / Form state for Create & Update
  const [activeModalTab, setActiveModalTab] = useState("basic"); // 'basic' or 'details'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Restaurant & Dining",
    location: "",
    address: "",
    description: "",
    summary: "",
    phone: "",
    openingHours: "",
    openingTime: "",
    closingTime: "",
    entryPrice: "Free Admission",
    heroImage: "",
    displayStatus: "Open Now",
    priceRange: "₦₦",
    status: "active",
  });

  // Helper to generate URL slugs cleanly
  const createSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // --- READ: Fetch venues on mount using the proven client API method ---
  const loadVenues = async (isMounted = true) => {
    try {
      if (isMounted) setLoading(true);
      const response = await fetchPlaces();

      let venueList = [];
      if (Array.isArray(response)) {
        venueList = response;
      } else if (response && Array.isArray(response.data)) {
        venueList = response.data;
      } else if (response && Array.isArray(response.places)) {
        venueList = response.places;
      } else if (response && response.data && Array.isArray(response.data.data)) {
        venueList = response.data.data;
      }

      if (isMounted) {
        setVenues(venueList);
        setError("");
      }
    } catch (err) {
      if (isMounted) {
        setError("Failed to load platform listings.");
        console.error("Venue load error:", err);
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  // --- READ: Fetch flagged content from backend ---
  const loadFlaggedContent = async (isMounted = true) => {
    try {
      const response = await fetch("/api/admin/flagged-content", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const flaggedData = await response.json();
      
      let itemsList = [];
      if (Array.isArray(flaggedData)) {
        itemsList = flaggedData;
      } else if (flaggedData && Array.isArray(flaggedData.data)) {
        itemsList = flaggedData.data;
      } else if (flaggedData && Array.isArray(flaggedData.items)) {
        itemsList = flaggedData.items;
      }

      if (isMounted) {
        setFlaggedItems(itemsList);
      }
    } catch (err) {
      if (isMounted) {
        console.error("Failed to load flagged content:", err);
      }
    }
  };

  // --- READ: Load all dashboard data on mount ---
  useEffect(() => {
    let isMounted = true;

    const initializeDashboard = async () => {
      await loadVenues(isMounted);
      await loadFlaggedContent(isMounted);
    };

    initializeDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSignOut = () => {
    if (!window.confirm('Are you sure you want to sign out of the Jos Pulse Admin Portal?')) return;
    localStorage.clear();
    window.location.href = '/login';
  };

  const handleSearch = (query) => {
    setAdminSearchQuery(query);
  };

  // --- HEADER UTILITY ACTIONS ---
  const handleNotificationsClick = () => {
    alert(`System Notifications:\n- ${flaggedItems.length} flagged content items require review.\n- All server nodes operating normally.`);
  };

  const handleSettingsClick = () => {
    setActiveTab("System Logs"); // Quick jump to system logs/settings
  };

  const handleProfileClick = () => {
    if (window.confirm("Super Admin Profile: John Doe\nWould you like to sign out?")) {
      handleSignOut();
    }
  };

  // --- CREATE & UPDATE: Open Modal ---
  const handleOpenCreateModal = () => {
    setEditingVenue(null);
    setActiveModalTab("basic");
    setFormData({
      name: "",
      category: "Restaurant & Dining",
      location: "",
      address: "",
      description: "",
      summary: "",
      phone: "",
      openingHours: "",
      openingTime: "",
      closingTime: "",
      entryPrice: "Free Admission",
      displayStatus: "Open Now",
      status: "active",
      priceRange: "₦₦",
    });
    setIsModalOpen(true);
    setSelectedFile(null);
  };

  const handleOpenEditModal = (venue) => {
    setEditingVenue(venue);
    setActiveModalTab("basic");
    setFormData({
      name: venue.name || "",
      category: venue.category || "Restaurant & Dining",
      location: venue.location || "",
      address: venue.address || venue.location || "",
      description: venue.description || "",
      priceRange: venue.priceRange || "₦₦",
      heroImage: venue.heroImage || venue.imageUrl || "",
      summary: venue.summary || "",
      phone: venue.phone || "",
      openingHours: venue.openingHours || "",
      openingTime: venue.openingTime || "",
      closingTime: venue.closingTime || "",
      entryPrice: venue.entryPrice || "Free Admission",
      displayStatus: venue.displayStatus || "Open Now",
      status: venue.status || "active",
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  // --- SUBMIT CREATE OR UPDATE ---
  const handleSaveVenue = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("slug", createSlug(formData.name));
    data.append("category", formData.category);
    data.append("location", formData.location);
    data.append("address", formData.address || formData.location);
    data.append("description", formData.description);
    data.append(
      "summary",
      formData.summary || formData.description.slice(0, 150),
    );
    data.append("displayStatus", formData.displayStatus);
    data.append("status", formData.status);
    data.append("phone", formData.phone);
    data.append("openingHours", formData.openingHours);
    data.append("openingTime", formData.openingTime);
    data.append("closingTime", formData.closingTime);
    data.append("entryPrice", formData.entryPrice);

    if (selectedFile) {
      data.append("heroImage", selectedFile);
    }

    try {
      if (editingVenue) {
        await updatePlace(editingVenue._id || editingVenue.id, data);
        alert("Venue updated successfully!");
      } else {
        await createPlace(data);
        alert("New venue created successfully!");
      }
      setIsModalOpen(false);
      setSelectedFile(null);

      setTimeout(async () => {
        await loadVenues();
      }, 300);
    } catch (err) {
      alert(
        "Operation failed: " + (err.response?.data?.message || err.message),
      );
    }
  };

  // --- DELETE ---
  const handleDeleteVenue = async (id) => {
    if (!window.confirm("Are you sure you want to delete this venue listing?"))
      return;
    try {
      await deletePlace(id);
      alert("Venue deleted successfully!");

      setTimeout(async () => {
        await loadVenues();
      }, 300);
    } catch (err) {
      alert(
        "Failed to delete venue: " +
          (err.response?.data?.message || err.message),
      );
    }
  };

  const handleFilter = () => {
    alert("Opening Filter Drawer...");
  };

  // Delete the flagged content
  const handleDeleteContent = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this reported content?"))
      return;
    try {
      await fetch(`/api/admin/flagged-content/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Content deleted successfully.");
      loadFlaggedContent();
    } catch {
      alert("Failed to delete content.");
    }
  };

  // Ignore/Dismiss the report
  const handleIgnoreReport = async (itemId) => {
    try {
      await fetch(`/api/admin/flagged-content/${itemId}/ignore`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Report dismissed.");
      loadFlaggedContent();
    } catch {
      alert("Failed to update report status.");
    }
  };

  const handleGoToModeration = () => {
    alert("Navigating to Moderation Hub...");
  };

  // --- SAFE GLOBAL SEARCH FILTER ---
  const filteredVenues = (venues || []).filter((venue) => {
    if (!venue) return false;
    if (!adminSearchQuery || adminSearchQuery.trim() === "") return true; // Show all if search is empty

    const query = adminSearchQuery.toLowerCase();
    const name = String(venue.name || venue.title || '').toLowerCase();
    const category = String(venue.category || '').toLowerCase();
    const location = String(venue.location || venue.address || '').toLowerCase();

    return name.includes(query) || category.includes(query) || location.includes(query);
  });

  return (
    <div className={styles.adminContainer}>
      {/* Fixed Super Admin Navigation Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSignOut={handleSignOut}
      />

      {/* Main Content Workspace */}
      <div className={styles.mainWrapper}>
        <AdminHeader 
          onSearch={handleSearch} 
          onNotifications={handleNotificationsClick}
          onSettings={handleSettingsClick}
          onProfile={handleProfileClick}
        />

        {/* Page Content Workspace */}
        <main className={styles.contentBody}>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>
                {activeTab === "Overview"
                  ? "Platform Overview"
                  : activeTab === "Venue Management"
                    ? "Venue Directory Management"
                    : activeTab === "Event Moderation"
                      ? "Event Moderation Queue"
                      : activeTab === "Users"
                        ? "User Management & Permissions"
                        : activeTab === "Ads"
                          ? "Ads & Sponsored Campaigns"
                          : "System Activity & Audit Logs"}
              </h1>
              <p className={styles.pageSubtitle}>
                {activeTab === 'Overview' 
                  ? 'Real-time metrics and critical administration tasks for Jos Pulse.' 
                  : activeTab === 'Venue Management'
                  ? 'Full-scale inventory control, search filters, and venue audits.'
                  : activeTab === 'Event Moderation'
                  ? 'Review, verify, and approve community event submissions.'
                  : activeTab === 'Users'
                  ? 'Manage registered platform accounts and security roles.'
                  : activeTab === 'Ads'
                  ? 'Manage promotional banners and campaign telemetry.'
                  : 'Real-time server terminal telemetry and audit logs.'}
              </p>
            </div>

            {(activeTab === 'Overview' || activeTab === 'Venue Management') && (
              <button
                onClick={handleOpenCreateModal}
                style={{
                  backgroundColor: "#F97316",
                  color: "#FFF",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                + Add New Listing
              </button>
            )}
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {loading && <p>Loading platform listings...</p>}

          {/* TAB 1: OVERVIEW WORKSPACE */}
          {activeTab === "Overview" && (
            <>
              <PromotedVenuesTable
                venues={filteredVenues}
                onNewListing={handleOpenCreateModal}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteVenue}
                onFilter={handleFilter}
                onViewAll={() => setActiveTab("Venue Management")}
              />

              {/* FLAGGED CONTENT QUEUE SECTION */}
              <div
                style={{
                  marginTop: "32px",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  padding: "24px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#1E293B",
                      }}
                    >
                      Flagged Content Queue
                    </h3>
                    <p
                      style={{
                        margin: "4px 0 0 0",
                        fontSize: "13px",
                        color: "#64748B",
                      }}
                    >
                      Review user reports and moderate inappropriate venue
                      comments or reviews.
                    </p>
                  </div>
                  <span
                    style={{
                      background: "#FEE2E2",
                      color: "#DC2626",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "700",
                    }}
                  >
                    {flaggedItems.length} Items
                  </span>
                </div>

                {flaggedItems.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      background: "#F8FAFC",
                      borderRadius: "8px",
                      color: "#64748B",
                    }}
                  >
                    <p style={{ margin: 0 }}>
                      🎉 No flagged items in the queue! All content is clean.
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    {flaggedItems.map((item) => (
                      <div
                        key={item._id || item.id}
                        style={{
                          padding: "16px",
                          background: "#F8FAFC",
                          borderRadius: "8px",
                          borderLeft: "4px solid #EF4444",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "8px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#0F172A",
                            }}
                          >
                            {item.title ||
                              `Reported ${item.contentType || "Review"} on "${item.venueName}"`}
                          </span>
                          <span style={{ fontSize: "12px", color: "#94A3B8" }}>
                            {item.timeAgo || "Recently"}
                          </span>
                        </div>

                        <p
                          style={{
                            fontSize: "13px",
                            color: "#475569",
                            fontStyle: "italic",
                            margin: "0 0 14px 0",
                          }}
                        >
                          "{item.contentSnippet || item.reason}"
                        </p>

                        <div style={{ display: "flex", gap: "10px" }}>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteContent(item._id || item.id)
                            }
                            style={{
                              backgroundColor: "#EF4444",
                              color: "#FFF",
                              border: "none",
                              padding: "6px 14px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "600",
                              cursor: "pointer",
                            }}
                          >
                            Delete Content
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleIgnoreReport(item._id || item.id)
                            }
                            style={{
                              backgroundColor: "#E2E8F0",
                              color: "#334155",
                              border: "none",
                              padding: "6px 14px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "600",
                              cursor: "pointer",
                            }}
                          >
                            Ignore Report
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: "16px", textAlign: "right" }}>
                  <a
                    href="#moderation-hub"
                    onClick={handleGoToModeration}
                    style={{
                      fontSize: "13px",
                      color: "#F97316",
                      fontWeight: "600",
                      textDecoration: "none",
                    }}
                  >
                    Go to Moderation Hub →
                  </a>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: VENUE MANAGEMENT DIRECTORY */}
          {activeTab === "Venue Management" && (
            <VenueManagement
              venues={filteredVenues}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteVenue}
              onRefresh={loadVenues}
            />
          )}

          {activeTab === "Event Moderation" && <EventModeration />}
          {activeTab === "Users" && <UserManagement />}
          {activeTab === "Ads" && <AdManagement />}
          {activeTab === "System Logs" && <SystemLogs />}
        </main>
      </div>

      {/* CREATE / EDIT MODAL WITH TABS */}
      {isModalOpen && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modalContainer}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: "20px",
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#1E293B",
                }}
              >
                {editingVenue
                  ? "Edit Venue Listing"
                  : "Create New Promoted Venue"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                  color: "#64748B",
                }}
              >
                ✕
              </button>
            </div>

            {/* Tab Navigation Buttons */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "20px",
                borderBottom: "1px solid #E2E8F0",
                paddingBottom: "10px",
              }}
            >
              <button
                type="button"
                onClick={() => setActiveModalTab("basic")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                  backgroundColor:
                    activeModalTab === "basic" ? "#F97316" : "#F1F5F9",
                  color: activeModalTab === "basic" ? "#FFFFFF" : "#475569",
                }}
              >
                1. Basic Info
              </button>

              <button
                type="button"
                onClick={() => setActiveModalTab("details")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                  backgroundColor:
                    activeModalTab === "details" ? "#F97316" : "#F1F5F9",
                  color: activeModalTab === "details" ? "#FFFFFF" : "#475569",
                }}
              >
                2. Detailed Options
              </button>
            </div>

            <form
              onSubmit={handleSaveVenue}
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              {/* TAB 1: BASIC INFORMATION */}
              {activeModalTab === "basic" && (
                <>
                  <div>
                    <label style={modalStyles.label}>Venue Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      style={modalStyles.input}
                    />
                  </div>

                  <div>
                    <label style={modalStyles.label}>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      style={modalStyles.input}
                    >
                      <option>Restaurant & Dining</option>
                      <option>Hotel & Resort</option>
                      <option>Golf & Sports Club</option>
                      <option>Lounge & Nightlife</option>
                      <option>Event Center & Arena</option>
                    </select>
                  </div>

                  <div>
                    <label style={modalStyles.label}>Location / Address</label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      style={modalStyles.input}
                    />
                  </div>

                  <div>
                    <label style={modalStyles.label}>Description</label>
                    <textarea
                      rows="3"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      style={modalStyles.input}
                    />
                  </div>

                  <div>
                    <label style={modalStyles.label}>Upload Venue Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      style={{
                        ...modalStyles.input,
                        padding: "8px 12px",
                        cursor: "pointer",
                      }}
                    />
                    {selectedFile && (
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#16A34A",
                          marginTop: "4px",
                        }}
                      >
                        Selected: {selectedFile.name}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* TAB 2: DETAILED OPTIONS */}
              {activeModalTab === "details" && (
                <>
                  <div>
                    <label style={modalStyles.label}>Phone Contact</label>
                    <input
                      type="text"
                      placeholder="e.g. +234 803 000 0000"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      style={modalStyles.input}
                    />
                  </div>

                  <div>
                    <label style={modalStyles.label}>Opening Hours Text</label>
                    <input
                      type="text"
                      placeholder="e.g. Mon - Sun: 8:00 AM - 10:00 PM"
                      value={formData.openingHours}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          openingHours: e.target.value,
                        })
                      }
                      style={modalStyles.input}
                    />
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                    }}
                  >
                    <div>
                      <label style={modalStyles.label}>Opening Time</label>
                      <input
                        type="text"
                        placeholder="08:00 AM"
                        value={formData.openingTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            openingTime: e.target.value,
                          })
                        }
                        style={modalStyles.input}
                      />
                    </div>
                    <div>
                      <label style={modalStyles.label}>Closing Time</label>
                      <input
                        type="text"
                        placeholder="10:00 PM"
                        value={formData.closingTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            closingTime: e.target.value,
                          })
                        }
                        style={modalStyles.input}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={modalStyles.label}>
                      Entry Price / Fee Info
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Free Admission or ₦2,000"
                      value={formData.entryPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, entryPrice: e.target.value })
                      }
                      style={modalStyles.input}
                    />
                  </div>

                  <div>
                    <label style={modalStyles.label}>Display Status</label>
                    <select
                      value={formData.displayStatus}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          displayStatus: e.target.value,
                        })
                      }
                      style={modalStyles.input}
                    >
                      <option value="Open Now">Open Now</option>
                      <option value="Closed">Closed</option>
                      <option value="Closing Soon">Closing Soon</option>
                    </select>
                  </div>
                </>
              )}

              {/* Form Action Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                  marginTop: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: "10px 16px",
                    background: "#E2E8F0",
                    color: "#0F172A",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 16px",
                    background: "#F97316",
                    color: "#FFF",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  {editingVenue ? "Save Changes" : "Publish Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    padding: "28px",
    maxWidth: "480px",
    width: "100%",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    color: "#0F172A",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "bold",
    marginBottom: "6px",
    color: "#334155",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1px solid #CBD5E1",
    backgroundColor: "#F8FAFC",
    color: "#0F172A",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
  },
};

export default AdminDashboard;