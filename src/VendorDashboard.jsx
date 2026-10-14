import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import VendorSidebar from './Components/VendorSidebar';
import VendorHeader from './Components/VendorHeader';
import VendorStatsRow from './Components/VendorStatsRow';
import VendorEventsTable from './Components/VendorEventsTable';
import PromoteSpotCard from './Components/PromoteSpotCard';
import VendorReviewsSection from './Components/VendorReviewsSection';
import styles from './CSS/VendorDashboard.module.css';

// API Services
import { fetchVendorProfile, fetchVendorEvents, createVendorEvent } from './api/client.js';

export const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [vendorProfile, setVendorProfile] = useState(null);
  const [vendorEvents, setVendorEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for Create Event Modal
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    eventDate: new Date().toISOString().split('T')[0],
    location: '',
    category: 'Festival / Concert',
    ticketPrice: 2000,
    availableTickets: 100
  });

  const location = useLocation();
  const navigate = useNavigate();

  // Load vendor profile and events on mount
  useEffect(() => {
    const loadVendorData = async () => {
      try {
        setLoading(true);
        const profileRes = await fetchVendorProfile().catch(() => null);
        const eventsRes = await fetchVendorEvents().catch(() => []);

        if (profileRes?.data) setVendorProfile(profileRes.data);
        if (eventsRes?.data) setVendorEvents(eventsRes.data);
      } catch (err) {
        console.error("Failed to load vendor dashboard data:", err);
        // Use navigate to redirect out if unauthorized token fails completely
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    loadVendorData();
  }, [navigate]);

  const vendorUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || localStorage.getItem('jos_pulse_user') || 'null');
    } catch {
      return null;
    }
  })();

  const claimBusinessName = location.state?.businessName || vendorProfile?.businessName || vendorUser?.businessName || "Rayfield Golf Club";
  const claimConfirmed = location.state?.claimConfirmed || vendorProfile?.status === 'active' || true;

  // Handle Event Form Submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await createVendorEvent({
        ...newEvent,
        location: newEvent.location || claimBusinessName,
        status: "upcoming"
      });
      alert("Event created successfully!");
      setIsCreatingEvent(false);
      setNewEvent({ title: '', eventDate: new Date().toISOString().split('T')[0], location: '', category: 'Festival / Concert', ticketPrice: 2000, availableTickets: 100 });
      
      // Reload events list
      const updatedEvents = await fetchVendorEvents();
      if (updatedEvents?.data) setVendorEvents(updatedEvents.data);
    } catch (err) {
      alert("Failed to create event: " + (err.response?.data?.message || err.message));
    }
  };

  const handleSubscribePromotion = () => {
    alert('Redirecting to Promotion Plan Payment Gateway...');
  };

  const handleSearch = (query) => {
    console.log('Vendor search query:', query);
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Fixed Left Navigation Sidebar */}
      <VendorSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <div className={styles.mainWrapper}>
        {/* Top Header */}
        <VendorHeader onSearch={handleSearch} />

        {/* Page Content View */}
        <main className={styles.contentBody}>
          {/* Section Welcome Header & Primary CTA */}
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>Overview</h1>
              <p className={styles.pageSubtitle}>
                {claimConfirmed && claimBusinessName
                  ? `Your business account is confirmed for ${claimBusinessName}. Venue management live.`
                  : "Here's what's happening at your venue today."}
              </p>
            </div>

            <button
              type="button"
              className={styles.createEventBtn}
              onClick={() => setIsCreatingEvent(true)}
            >
              <FontAwesomeIcon icon={faPlus} className={styles.btnIcon} />
              <span>Create New Event</span>
            </button>
          </div>

          {/* 4 KPI Analytics Cards Row */}
          <VendorStatsRow />

          {/* Main Content Split: Events Table & Promotion Monetization Card */}
          <div className={styles.middleSectionGrid}>
            <VendorEventsTable events={vendorEvents} loading={loading} />
            <PromoteSpotCard onSubscribe={handleSubscribePromotion} />
          </div>

          {/* Recent Reviews & Community Feedback Section */}
          <VendorReviewsSection />
        </main>
      </div>

      {/* CREATE EVENT MODAL (Uses isCreatingEvent) */}
      {isCreatingEvent && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modalContainer}>
            <div style={modalStyles.header}>
              <h3 style={{ margin: 0, color: '#0F172A' }}>Create New Venue Event</h3>
              <button onClick={() => setIsCreatingEvent(false)} style={modalStyles.closeBtn}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={modalStyles.label}>Event Title</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Highland Jazz Night"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  style={modalStyles.input}
                />
              </div>

              <div>
                <label style={modalStyles.label}>Date</label>
                <input 
                  type="date" 
                  required 
                  value={newEvent.eventDate}
                  onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
                  style={modalStyles.input}
                />
              </div>

              <div>
                <label style={modalStyles.label}>Location / Venue</label>
                <input 
                  type="text" 
                  placeholder={claimBusinessName}
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  style={modalStyles.input}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={modalStyles.label}>Ticket Price (₦)</label>
                  <input 
                    type="number" 
                    value={newEvent.ticketPrice}
                    onChange={(e) => setNewEvent({ ...newEvent, ticketPrice: Number(e.target.value) })}
                    style={modalStyles.input}
                  />
                </div>
                <div>
                  <label style={modalStyles.label}>Available Slots</label>
                  <input 
                    type="number" 
                    value={newEvent.availableTickets}
                    onChange={(e) => setNewEvent({ ...newEvent, availableTickets: Number(e.target.value) })}
                    style={modalStyles.input}
                  />
                </div>
              </div>

              <button type="submit" style={modalStyles.submitBtn}>
                Publish Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Clean inline modal styling helpers
const modalStyles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
  },
  modalContainer: {
    backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '28px',
    maxWidth: '440px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  closeBtn: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748B' },
  label: { display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#0F172A', marginBottom: '4px' },
  input: { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' },
  submitBtn: { width: '100%', padding: '12px', backgroundColor: '#F97316', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }
};

export default VendorDashboard;