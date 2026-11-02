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
  fetchEvents,
  createVendorEvent,
} from "./api/client";

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [venues, setVenues] = useState([]);
  const [events, setEvents] = useState([]);
  const [adminSearchQuery, setAdminSearchQuery] = useState("");

  // State for Concierge Enquiries
  const [conciergeEnquiries, setConciergeEnquiries] = useState([]);
  const [conciergeLoading, setConciergeLoading] = useState(false);
  const [conciergeFilter, setConciergeFilter] = useState("all");

  // State for Flagged Content Queue
  const [flaggedItems, setFlaggedItems] = useState([]);

  // Modal / Form state for Create & Update Venues
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

  // Modal / Form state for Create & Update Events
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedEventImage, setSelectedEventImage] = useState(null);
  const [eventFormData, setEventFormData] = useState({
    title: "",
    description: "",
    category: "Concert",
    eventDate: "",
    startTime: "",
    endTime: "",
    ticketPrice: 0,
    availableTickets: 0,
    organizer: "",
    ticketUrl: "",
    placeId: "",
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

  // --- READ: Fetch venues (ALL statuses for admin) ---
  const loadVenues = useCallback(async () => {
    try {
      // Direct API call to ensure we get all venues
      const token = localStorage.getItem('token') || localStorage.getItem('jos_pulse_token');
      const response = await fetch('http://localhost:5000/api/places?limit=1000&status=', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      console.log('📊 Raw API Response:', data);
      
      let venueList = [];
      if (Array.isArray(data)) {
        venueList = data;
      } else if (data && Array.isArray(data.data)) {
        venueList = data.data;
      } else if (data && Array.isArray(data.places)) {
        venueList = data.places;
      }

      console.log(`📊 Admin Dashboard loaded ${venueList.length} total venues from database`);
      console.log('Total from API:', data.total || venueList.length);
      
      setVenues(venueList);
    } catch (err) {
      console.error("Venue load error:", err);
      console.error("Error details:", err.response?.data || err.message);
    }
  }, []);

  // --- READ: Fetch events ---
  const loadEvents = useCallback(async () => {
    try {
      const response = await fetchEvents();

      let eventList = [];
      if (Array.isArray(response)) {
        eventList = response;
      } else if (response && Array.isArray(response.data)) {
        eventList = response.data;
      }

      setEvents(eventList);
    } catch (err) {
      console.error("Event load error:", err);
    }
  }, []);

  // --- DELETE: Delete venue by ID ---
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

  // --- EVENT MODAL HANDLERS ---
  const handleOpenCreateEventModal = () => {
    setEditingEvent(null);
    setEventFormData({
      title: "",
      description: "",
      category: "Concert",
      eventDate: "",
      startTime: "",
      endTime: "",
      ticketPrice: 0,
      availableTickets: 0,
      organizer: "",
      ticketUrl: "",
      placeId: "",
    });
    setIsEventModalOpen(true);
    setSelectedEventImage(null);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();

    // Validation
    if (!eventFormData.placeId) {
      alert("Please select a venue for this event.");
      return;
    }

    const payload = {
      ...eventFormData,
      image: selectedEventImage ? URL.createObjectURL(selectedEventImage) : "", // In production, upload to backend
    };

    try {
      await createVendorEvent(payload);
      alert(`✓ Event Published!\n\nTitle: ${eventFormData.title}\nDate: ${eventFormData.eventDate}\nVenue: ${eventFormData.placeId}\n\nEvent will appear on the Events page immediately.`);
      setIsEventModalOpen(false);
      setSelectedEventImage(null);
      setTimeout(() => loadEvents(), 300);
    } catch (err) {
      alert("Failed to create event: " + (err.response?.data?.message || err.message));
    }
  };

  // --- READ: Fetch all dashboard data on mount ---
  useEffect(() => {
    let isMounted = true;

    const fetchAllDashboardData = async () => {
      try {
        // 1. Fetch ALL Venues (direct API call to ensure no filtering)
        const token = localStorage.getItem('token') || localStorage.getItem('jos_pulse_token');
        const venueResponse = await fetch('http://localhost:5000/api/places?limit=1000&status=', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const venueData = await venueResponse.json();
        console.log('📊 useEffect API Response:', venueData);
        
        let venueList = [];
        if (Array.isArray(venueData)) venueList = venueData;
        else if (venueData?.data) venueList = venueData.data;
        else if (venueData?.places) venueList = venueData.places;
        
        if (isMounted) {
          setVenues(venueList);
          console.log(`📊 Dashboard loaded ${venueList.length} total venues`);
        }

        // 2. Fetch Events
        const eventsResponse = await fetchEvents();
        let eventList = [];
        if (Array.isArray(eventsResponse)) eventList = eventsResponse;
        else if (eventsResponse?.data) eventList = eventsResponse.data;
        
        if (isMounted) setEvents(eventList);

        // 3. Fetch Flagged Content
        const flaggedResponse = await fetch("/api/admin/flagged-content", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const flaggedData = await flaggedResponse.json();
        let itemsList = [];
        if (Array.isArray(flaggedData)) itemsList = flaggedData;
        else if (flaggedData?.data) itemsList = flaggedData.data;

        if (isMounted) setFlaggedItems(itemsList);

        // 4. Fetch Concierge Enquiries
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
      name: venue.name || venue.title || "",
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

    // Enhanced Category-to-Section mapping with comprehensive coverage
    let targetSection = "dining"; // default fallback
    const catLower = formData.category.toLowerCase();

    // Exact category mapping for robust wiring
    const categoryMap = {
      'restaurant & dining': 'dining',
      'restaurant': 'dining',
      'dining': 'dining',
      'cafe': 'dining',
      'hotel & resort': 'stays',
      'hotel': 'stays',
      'resort': 'stays',
      'accommodation': 'stays',
      'stay': 'stays',
      'lounge & nightlife': 'nightlife',
      'nightlife': 'nightlife',
      'lounge': 'lounges',
      'bar': 'nightlife',
      'club': 'nightlife',
      'event center & arena': 'events',
      'event': 'events',
      'arena': 'events',
      'festival': 'events',
      'music & festivals': 'events',
      'golf & sports club': 'golf',
      'golf': 'golf',
      'sports': 'golf',
      'cultural landmark': 'culture',
      'culture': 'culture',
      'landmark': 'culture',
      'museum': 'culture',
      'heritage': 'culture',
      'attraction': 'attractions',
      'nature': 'attractions',
      'other': 'explore',
    };

    // Find matching section from map
    targetSection = categoryMap[catLower] || 
                    Object.entries(categoryMap).find(([key]) => 
                      catLower.includes(key)
                    )?.[1] || 'explore';

    const generatedSlug = createSlug(formData.name);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("title", formData.name);
    data.append("slug", generatedSlug);
    data.append("category", formData.category);
    data.append("section", targetSection);
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
    data.append("priceRange", formData.priceRange || "₦₦");

    // Send image as 'heroImage' field (backend expects this name)
    if (selectedFile) {
      data.append("heroImage", selectedFile);
      console.log("✅ Uploading image:", selectedFile.name, selectedFile.type, selectedFile.size);
    }

    try {
      if (editingVenue) {
        await updatePlace(editingVenue._id || editingVenue.id, data);
        alert(`✓ Venue Updated!\n\nName: ${formData.name}\nCategory: ${formData.category}\nAuto-routed to: /${targetSection}\nSlug: ${generatedSlug}\n\nVisitors can now find this place on the ${targetSection} page.`);
      } else {
        await createPlace(data);
        alert(`✓ New Venue Published!\n\nName: ${formData.name}\nCategory: ${formData.category}\nAuto-routed to: /${targetSection}\nSlug: ${generatedSlug}\n\nVisitors will see this on the ${targetSection} page immediately.`);
      }
      setIsModalOpen(false);
      setSelectedFile(null);
      setTimeout(() => loadVenues(), 300);
    } catch (err) {
      alert("Operation failed: " + (err.response?.data?.message || err.message));
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
                      : activeTab === "Event Management"
                        ? "Event Management"
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

            {activeTab === 'Event Management' && (
              <button
                onClick={handleOpenCreateEventModal}
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
                + Add New Event
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
              venues={filteredVenues.slice(0, 8)}
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

          {activeTab === "Event Management" && <EventModeration />}
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
                <label style={modalStyles.label}>Category & Wiring</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={modalStyles.input}
                >
                  <option value="Restaurant & Dining">Restaurant & Dining → /dining</option>
                  <option value="Hotel & Resort">Hotel & Resort → /stays</option>
                  <option value="Lounge & Nightlife">Lounge & Nightlife → /nightlife</option>
                  <option value="Event Center & Arena">Event Center & Arena → /events</option>
                  <option value="Music & Festivals">Music & Festivals → /events</option>
                  <option value="Golf & Sports Club">Golf & Sports Club → /golf</option>
                  <option value="Cultural Landmark">Cultural Landmark → /culture</option>
                  <option value="Attraction">Tourist Attraction → /attractions</option>
                  <option value="Nature">Nature & Parks → /attractions</option>
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={modalStyles.label}>Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={modalStyles.input}
                    placeholder="+234 XXX XXX XXXX"
                  />
                </div>

                <div>
                  <label style={modalStyles.label}>Listing Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={modalStyles.input}
                  >
                    <option value="active">✓ Active (Visible to public)</option>
                    <option value="pending">⏳ Pending (Under review)</option>
                    <option value="inactive">✕ Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={modalStyles.label}>Upload Venue Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setSelectedFile(file);
                  }}
                  style={{ ...modalStyles.input, padding: "8px 12px", cursor: "pointer" }}
                />
                {selectedFile && (
                  <div style={{ marginTop: "12px" }}>
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      style={{
                        width: "100%",
                        maxHeight: "240px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "2px solid #F97316",
                        boxShadow: "0 2px 8px rgba(249, 115, 22, 0.2)"
                      }}
                    />
                    <p style={{ fontSize: "12px", color: "#16A34A", marginTop: "8px", fontWeight: "600" }}>
                      ✓ Selected: {selectedFile.name}
                    </p>
                  </div>
                )}
                {!selectedFile && editingVenue?.heroImage && (
                  <div style={{ marginTop: "12px" }}>
                    <p style={{ fontSize: "11px", color: "#64748B", marginBottom: "6px" }}>Current image:</p>
                    <img
                      src={editingVenue.heroImage}
                      alt="Current"
                      style={{
                        width: "100%",
                        maxHeight: "180px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        border: "1px solid #CBD5E1",
                        opacity: 0.7
                      }}
                    />
                  </div>
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

      {/* CREATE / EDIT EVENT MODAL */}
      {isEventModalOpen && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modalContainer}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ marginTop: 0, marginBottom: 0, fontSize: "20px", fontWeight: "700", color: "#1E293B" }}>
                {editingEvent ? "Edit Event" : "Create New Event"}
              </h2>
              <button
                type="button"
                onClick={() => setIsEventModalOpen(false)}
                style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748B" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEvent} style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "16px" }}>
              <div>
                <label style={modalStyles.label}>Event Title</label>
                <input
                  type="text"
                  required
                  value={eventFormData.title}
                  onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                  style={modalStyles.input}
                />
              </div>

              <div>
                <label style={modalStyles.label}>Category</label>
                <select
                  value={eventFormData.category}
                  onChange={(e) => setEventFormData({ ...eventFormData, category: e.target.value })}
                  style={modalStyles.input}
                >
                  <option value="Concert">Concert</option>
                  <option value="Festival">Festival</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Conference">Conference</option>
                  <option value="Networking">Networking</option>
                  <option value="Sports">Sports</option>
                  <option value="Exhibition">Exhibition</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={modalStyles.label}>Venue (Select Place)</label>
                <select
                  required
                  value={eventFormData.placeId}
                  onChange={(e) => setEventFormData({ ...eventFormData, placeId: e.target.value })}
                  style={modalStyles.input}
                >
                  <option value="">-- Select Venue --</option>
                  {venues.map((venue) => (
                    <option key={venue._id || venue.id} value={venue._id || venue.id}>
                      {venue.name || venue.title} - {venue.location || venue.address}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={modalStyles.label}>Event Date</label>
                  <input
                    type="date"
                    required
                    value={eventFormData.eventDate}
                    onChange={(e) => setEventFormData({ ...eventFormData, eventDate: e.target.value })}
                    style={modalStyles.input}
                  />
                </div>

                <div>
                  <label style={modalStyles.label}>Start Time</label>
                  <input
                    type="time"
                    required
                    value={eventFormData.startTime}
                    onChange={(e) => setEventFormData({ ...eventFormData, startTime: e.target.value })}
                    style={modalStyles.input}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={modalStyles.label}>End Time</label>
                  <input
                    type="time"
                    required
                    value={eventFormData.endTime}
                    onChange={(e) => setEventFormData({ ...eventFormData, endTime: e.target.value })}
                    style={modalStyles.input}
                  />
                </div>

                <div>
                  <label style={modalStyles.label}>Ticket Price (₦)</label>
                  <input
                    type="number"
                    min="0"
                    value={eventFormData.ticketPrice}
                    onChange={(e) => setEventFormData({ ...eventFormData, ticketPrice: e.target.value })}
                    style={modalStyles.input}
                  />
                </div>
              </div>

              <div>
                <label style={modalStyles.label}>Available Tickets</label>
                <input
                  type="number"
                  min="0"
                  value={eventFormData.availableTickets}
                  onChange={(e) => setEventFormData({ ...eventFormData, availableTickets: e.target.value })}
                  style={modalStyles.input}
                />
              </div>

              <div>
                <label style={modalStyles.label}>Organizer</label>
                <input
                  type="text"
                  value={eventFormData.organizer}
                  onChange={(e) => setEventFormData({ ...eventFormData, organizer: e.target.value })}
                  style={modalStyles.input}
                />
              </div>

              <div>
                <label style={modalStyles.label}>Ticket URL (Optional)</label>
                <input
                  type="url"
                  value={eventFormData.ticketUrl}
                  onChange={(e) => setEventFormData({ ...eventFormData, ticketUrl: e.target.value })}
                  style={modalStyles.input}
                  placeholder="https://tickets.example.com"
                />
              </div>

              <div>
                <label style={modalStyles.label}>Description</label>
                <textarea
                  rows="4"
                  required
                  value={eventFormData.description}
                  onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                  style={modalStyles.input}
                />
              </div>

              <div>
                <label style={modalStyles.label}>Upload Event Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setSelectedEventImage(file);
                  }}
                  style={{ ...modalStyles.input, padding: "8px 12px", cursor: "pointer" }}
                />
                {selectedEventImage && (
                  <div style={{ marginTop: "12px" }}>
                    <img
                      src={URL.createObjectURL(selectedEventImage)}
                      alt="Preview"
                      style={{
                        width: "100%",
                        maxHeight: "240px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "2px solid #F97316",
                        boxShadow: "0 2px 8px rgba(249, 115, 22, 0.2)"
                      }}
                    />
                    <p style={{ fontSize: "12px", color: "#16A34A", marginTop: "8px", fontWeight: "600" }}>
                      ✓ Selected: {selectedEventImage.name}
                    </p>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  style={{ padding: "10px 16px", background: "#E2E8F0", color: "#0F172A", border: "none", borderRadius: "6px", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "10px 16px", background: "#F97316", color: "#FFF", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
                >
                  {editingEvent ? "Save Changes" : "Publish Event"}
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