import { useState, useEffect, useCallback } from "react";
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
  const [adminSearchQuery, setAdminSearchQuery] = useState("");

  // State for Concierge Enquiries
  const [conciergeEnquiries, setConciergeEnquiries] = useState([]);
  const [conciergeLoading, setConciergeLoading] = useState(false);
  const [conciergeFilter, setConciergeFilter] = useState("all");

  // State for Flagged Content Queue
  const [flaggedItems, setFlaggedItems] = useState([]);

  // Modal / Form state for Create & Update
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

  const createSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // --- READ: Fetch Concierge Enquiries ---
  const loadConciergeEnquiries = useCallback(async (filterValue) => {
    try {
      setConciergeLoading(true);
      const targetFilter = filterValue || conciergeFilter;
      const url = targetFilter === "all" 
        ? "http://localhost:5000/api/v1/concierge" 
        : `http://localhost:5000/api/v1/concierge?status=${targetFilter}`;
        
      const response = await fetch(url);
      const data = await response.json();

      if (data?.success) {
        setConciergeEnquiries(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load concierge enquiries:", err);
    } finally {
      setConciergeLoading(false);
    }
  }, [conciergeFilter]);

  // --- READ: Fetch venues ---
  const loadVenues = useCallback(async () => {
    try {
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

      setVenues(venueList);
    } catch (err) {
      console.error("Venue load error:", err);
    }
  }, []);

  // --- READ: Fetch all dashboard data on mount (Consolidated to prevent cascading warnings & unused helper issues) ---
  useEffect(() => {
    let isMounted = true;

    const fetchAllDashboardData = async () => {
      try {
        // 1. Fetch Venues
        const venueResponse = await fetchPlaces();
        let venueList = [];
        if (Array.isArray(venueResponse)) venueList = venueResponse;
        else if (venueResponse?.data) venueList = venueResponse.data;
        else if (venueResponse?.places) venueList = venueResponse.places;
        
        if (isMounted) setVenues(venueList);

        // 2. Fetch Flagged Content
        const flaggedResponse = await fetch("/api/admin/flagged-content", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const flaggedData = await flaggedResponse.json();
        let itemsList = [];
        if (Array.isArray(flaggedData)) itemsList = flaggedData;
        else if (flaggedData?.data) itemsList = flaggedData.data;

        if (isMounted) setFlaggedItems(itemsList);

        // 3. Fetch Concierge Enquiries
        const url = conciergeFilter === "all" 
          ? "http://localhost:5000/api/v1/concierge" 
          : `http://localhost:5000/api/v1/concierge?status=${conciergeFilter}`;
        
        const conciergeResponse = await fetch(url);
        const conciergeData = await conciergeResponse.json();
        
        if (isMounted && conciergeData?.success) {
          setConciergeEnquiries(conciergeData.data || []);
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      }
    };

    fetchAllDashboardData();

    return () => {
      isMounted = false;
    };
  }, [conciergeFilter]);

  // --- UPDATE: Concierge Enquiry Status ---
  const handleUpdateConciergeStatus = async (reference, newStatus, assignedTo) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/concierge/${reference}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, assignedTo })
      });
      const data = await response.json();

      if (data?.success) {
        alert(`Enquiry ${reference} updated successfully.`);
        loadConciergeEnquiries(conciergeFilter);
      } else {
        alert(data?.error?.message || "Failed to update enquiry.");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating enquiry status.");
    }
  };

  const handleSignOut = () => {
    if (!window.confirm('Are you sure you want to sign out?')) return;
    localStorage.clear();
    window.location.href = '/login';
  };

  const handleSearch = (query) => setAdminSearchQuery(query);

  const handleOpenCreateModal = () => {
    setEditingVenue(null);
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

  const handleSaveVenue = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("slug", createSlug(formData.name));
    data.append("category", formData.category);
    data.append("location", formData.location);
    data.append("address", formData.address || formData.location);
    data.append("description", formData.description);
    data.append("summary", formData.summary || formData.description.slice(0, 150));
    data.append("displayStatus", formData.displayStatus);
    data.append("status", formData.status);
    data.append("phone", formData.phone);
    data.append("openingHours", formData.openingHours);
    data.append("openingTime", formData.openingTime);
    data.append("closingTime", formData.closingTime);
    data.append("entryPrice", formData.entryPrice);

    if (selectedFile) data.append("heroImage", selectedFile);

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
      setTimeout(() => loadVenues(), 300);
    } catch (err) {
      alert("Operation failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteVenue = async (id) => {
    if (!window.confirm("Are you sure you want to delete this venue listing?")) return;
    try {
      await deletePlace(id);
      alert("Venue deleted successfully!");
      setTimeout(() => loadVenues(), 300);
    } catch (err) {
      alert("Failed to delete venue: " + (err.response?.data?.message || err.message));
    }
  };

  const filteredVenues = (venues || []).filter((venue) => {
    if (!venue) return false;
    if (!adminSearchQuery || adminSearchQuery.trim() === "") return true;

    const query = adminSearchQuery.toLowerCase();
    const name = String(venue.name || venue.title || '').toLowerCase();
    const category = String(venue.category || '').toLowerCase();
    const location = String(venue.location || venue.address || '').toLowerCase();

    return name.includes(query) || category.includes(query) || location.includes(query);
  });

  return (
    <div className={styles.adminContainer}>
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSignOut={handleSignOut}
      />

      <div className={styles.mainWrapper}>
        <AdminHeader 
          onSearch={handleSearch} 
          onNotifications={() => alert(`System Notifications: ${flaggedItems.length} flagged items require review.`)}
          onSettings={() => setActiveTab("System Logs")}
          onProfile={handleSignOut}
        />

        <main className={styles.contentBody}>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>
                {activeTab === "Overview"
                  ? "Platform Overview"
                  : activeTab === "Venue Management"
                    ? "Venue Directory Management"
                    : activeTab === "Concierge Support"
                      ? "Airport Concierge Enquiries"
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
                  : activeTab === 'Concierge Support'
                  ? 'Manage and resolve passenger air-support & ground concierge requests.'
                  : activeTab === 'Venue Management'
                  ? 'Full-scale inventory control, search filters, and venue audits.'
                  : 'Platform administration workspace.'}
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

          {/* TAB: CONCIERGE SUPPORT MANAGEMENT */}
          {activeTab === "Concierge Support" && (
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, fontSize: "18px", color: "#1E293B" }}>
                  Passenger Concierge Tickets ({conciergeEnquiries.length})
                </h3>
                <div style={{ display: "flex", gap: "10px" }}>
                  {["all", "open", "in-progress", "closed"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setConciergeFilter(st)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "6px",
                        border: "1px solid #CBD5E1",
                        backgroundColor: conciergeFilter === st ? "#F97316" : "#F8FAFC",
                        color: conciergeFilter === st ? "#FFF" : "#475569",
                        fontWeight: "600",
                        fontSize: "12px",
                        cursor: "pointer",
                        textTransform: "capitalize"
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {conciergeLoading ? (
                <p>Loading concierge tickets...</p>
              ) : conciergeEnquiries.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#F8FAFC", borderRadius: "8px", color: "#64748B" }}>
                  No concierge enquiries found for the selected filter.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {conciergeEnquiries.map((ticket) => (
                    <div
                      key={ticket._id || ticket.reference}
                      style={{
                        padding: "18px",
                        borderRadius: "8px",
                        border: "1px solid #E2E8F0",
                        backgroundColor: "#F8FAFC",
                        borderLeft: `5px solid ${ticket.status === 'open' ? '#EF4444' : ticket.status === 'in-progress' ? '#F59E0B' : '#10B981'}`
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <div>
                          <span style={{ fontSize: "12px", fontWeight: "bold", color: "#F97316" }}>
                            {ticket.reference}
                          </span>
                          <h4 style={{ margin: "4px 0 0 0", color: "#0F172A", fontSize: "16px" }}>
                            {ticket.name} ({ticket.email})
                          </h4>
                        </div>
                        <span style={{
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          backgroundColor: ticket.status === 'open' ? '#FEE2E2' : ticket.status === 'in-progress' ? '#FEF3C7' : '#D1FAE5',
                          color: ticket.status === 'open' ? '#991B1B' : ticket.status === 'in-progress' ? '#92400E' : '#065F46'
                        }}>
                          {ticket.status}
                        </span>
                      </div>

                      <p style={{ fontSize: "13px", color: "#334155", margin: "8px 0" }}>
                        <strong>Category:</strong> {ticket.category} | <strong>Phone:</strong> {ticket.phone || "N/A"}
                      </p>
                      
                      <div style={{ backgroundColor: "#FFFFFF", padding: "12px", borderRadius: "6px", border: "1px solid #E2E8F0", fontSize: "13px", color: "#475569", margin: "8px 0" }}>
                        "{ticket.message}"
                      </div>

                      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "12px" }}>
                        <small style={{ color: "#64748B" }}>Assigned To:</small>
                        <input
                          type="text"
                          defaultValue={ticket.assignedTo || "Unassigned"}
                          onBlur={(e) => handleUpdateConciergeStatus(ticket.reference, ticket.status, e.target.value)}
                          style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #CBD5E1", fontSize: "12px" }}
                        />

                        <small style={{ color: "#64748B", marginLeft: "10px" }}>Change Status:</small>
                        <select
                          value={ticket.status}
                          onChange={(e) => handleUpdateConciergeStatus(ticket.reference, e.target.value, ticket.assignedTo)}
                          style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #CBD5E1", fontSize: "12px" }}
                        >
                          <option value="open">Open</option>
                          <option value="in-progress">In-Progress</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "Overview" && (
            <PromotedVenuesTable
              venues={filteredVenues}
              onNewListing={handleOpenCreateModal}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteVenue}
              onFilter={() => alert("Filtering...")}
              onViewAll={() => setActiveTab("Venue Management")}
            />
          )}

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

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modalContainer}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ marginTop: 0, marginBottom: 0, fontSize: "20px", fontWeight: "700", color: "#1E293B" }}>
                {editingVenue ? "Edit Venue Listing" : "Create New Promoted Venue"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748B" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveVenue} style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "16px" }}>
              <div>
                <label style={modalStyles.label}>Venue Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={modalStyles.input}
                />
              </div>

              <div>
                <label style={modalStyles.label}>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  style={modalStyles.input}
                />
              </div>

              <div>
                <label style={modalStyles.label}>Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={modalStyles.input}
                />
              </div>

              <div>
                <label style={modalStyles.label}>Upload Venue Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  style={{ ...modalStyles.input, padding: "8px 12px", cursor: "pointer" }}
                />
                {selectedFile && (
                  <p style={{ fontSize: "12px", color: "#16A34A", marginTop: "4px" }}>
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: "10px 16px", background: "#E2E8F0", color: "#0F172A", border: "none", borderRadius: "6px", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "10px 16px", background: "#F97316", color: "#FFF", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
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