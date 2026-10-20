import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import VendorSidebar from './Components/VendorSidebar';
import VendorHeader from './Components/VendorHeader';
import VendorStatsRow from './Components/VendorStatsRow';
import VendorEventsTable from './Components/VendorEventsTable';
import PromoteSpotCard from './Components/PromoteSpotCard';
import VendorReviewsSection from './Components/VendorReviewsSection';
import VendorSettings from './Components/VendorSettings.jsx';
import VendorReviews from './Components/VendorReviews.jsx';
import PromotedListings from './Components/PromotedListings.jsx';
import VenueProfile from './Components/VenueProfile.jsx';
import styles from './CSS/VendorDashboard.module.css';

import { fetchVendorProfile, fetchVendorEvents, createVendorEvent } from './api/client.js';

export const VendorDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Overview');
  const [vendorProfile, setVendorProfile] = useState(null);
  const [vendorEvents, setVendorEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Extract passed form state directly from ClaimVenuePage navigation
  const passedState = location.state || {};
  const passedFormData = passedState.formData || {};

  const vendorUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || localStorage.getItem('jos_pulse_user') || 'null');
    } catch {
      return null;
    }
  })();

  // Priority resolution for Business Name
  const claimBusinessName = 
    passedState.businessName || 
    passedFormData.businessName || 
    vendorProfile?.businessName || 
    vendorUser?.businessName || 
    "My Venue";

  const venueImagePreview = passedState.venueImage || vendorProfile?.imageUrl || null;
  const claimConfirmed = passedState.claimConfirmed || vendorProfile?.status === 'active' || false;
  const isIncomplete = passedState.incompleteNotice || false;

  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    eventDate: new Date().toISOString().split('T')[0],
    location: claimBusinessName,
    category: passedFormData.category || 'Restaurant & Dining',
    ticketPrice: 2000,
    availableTickets: 100
  });

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
      } finally {
        setLoading(false);
      }
    };

    loadVendorData();
  }, []);

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
      setNewEvent({ title: '', eventDate: new Date().toISOString().split('T')[0], location: claimBusinessName, category: 'Restaurant & Dining', ticketPrice: 2000, availableTickets: 100 });
      
      const updatedEvents = await fetchVendorEvents();
      if (updatedEvents?.data) setVendorEvents(updatedEvents.data);
    } catch (err) {
      alert("Failed to create event: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <VendorSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        businessName={claimBusinessName}
        venueImage={venueImagePreview}
      />

      <div className={styles.mainWrapper}>
        <VendorHeader 
          onSearch={(q) => console.log(q)} 
          businessName={claimBusinessName}
          venueImage={venueImagePreview}
          category={passedFormData.category || 'Restaurant & Dining'}
        />

        <main className={styles.contentBody}>
          {/* Incomplete Verification Warning Banner */}
          {isIncomplete && (
            <div style={bannerStyles.warningBox}>
              <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: '#D97706', fontSize: '18px' }} />
              <div style={{ flex: 1 }}>
                <strong style={{ color: '#92400E', fontSize: '14px', display: 'block' }}>
                  Incomplete Business Claim Verification
                </strong>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#B45309' }}>
                  We saved your details for <strong>{claimBusinessName}</strong>. Please upload your verification documents to finalize publishing rights.
                </p>
              </div>
              <button onClick={() => navigate('/claim-venue')} style={bannerStyles.completeBtn}>
                Complete Claim
              </button>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'Overview' && (
            <>
              {/* Venue Banner / Header Display */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                {venueImagePreview ? (
                  <img src={venueImagePreview} alt={claimBusinessName} style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '64px', height: '64px', borderRadius: '8px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🏠</div>
                )}
                <div>
                  <h1 style={{ margin: '0 0 4px', fontSize: '22px', color: '#0F172A' }}>{claimBusinessName}</h1>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
                    Category: <strong>{passedFormData.category || 'Restaurant & Dining'}</strong> | Status: <span style={{ color: claimConfirmed ? '#16A34A' : '#D97706', fontWeight: 'bold' }}>{claimConfirmed ? 'Confirmed' : 'Pending Verification'}</span>
                  </p>
                </div>

                <button
                  type="button"
                  className={styles.createEventBtn}
                  onClick={() => setIsCreatingEvent(true)}
                  style={{ marginLeft: 'auto' }}
                >
                  <FontAwesomeIcon icon={faPlus} className={styles.btnIcon} />
                  <span>Create New Event</span>
                </button>
              </div>

              <VendorStatsRow />

              <div className={styles.middleSectionGrid}>
                <VendorEventsTable events={vendorEvents} loading={loading} />
                <PromoteSpotCard onSubscribe={() => alert('Redirecting to payment...')} />
              </div>

              <VendorReviewsSection />
            </>
          )}

          {/* TAB 2: MY VENUE PROFILE */}
          {activeTab === 'My Venue Profile' && (
            <VenueProfile 
              initialBusinessName={claimBusinessName} 
              initialCategory={passedFormData.category} 
              venueImage={venueImagePreview} 
            />
          )}

          {/* TAB 3: EVENTS & TICKETS */}
          {activeTab === 'Events & Tickets' && (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, fontSize: '20px', color: '#0F172A' }}>Manage Events & Tickets</h2>
                <button
                  type="button"
                  className={styles.createEventBtn}
                  onClick={() => setIsCreatingEvent(true)}
                >
                  <FontAwesomeIcon icon={faPlus} className={styles.btnIcon} />
                  <span>Create New Event</span>
                </button>
              </div>
              <VendorEventsTable events={vendorEvents} loading={loading} />
            </div>
          )}
          {activeTab === 'Promoted Listings' && (
  <PromotedListings businessName={claimBusinessName} />
)}
{activeTab === 'Reviews' && (
  <VendorReviews businessName={claimBusinessName} />
)}
{activeTab === 'Settings' && (
  <VendorSettings businessName={claimBusinessName} />
)}
        </main>
      </div>

      {/* CREATE EVENT MODAL WITH PURE WHITE INPUTS */}
      {isCreatingEvent && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modalContainer}>
            <div style={modalStyles.header}>
              <h3 style={{ margin: 0, color: '#0F172A' }}>Create New Event for {claimBusinessName}</h3>
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
                  placeholder="e.g. Acoustic Friday Night"
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

const bannerStyles = {
  warningBox: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px' },
  completeBtn: { backgroundColor: '#D97706', color: '#FFFFFF', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }
};

const modalStyles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modalContainer: { backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '28px', maxWidth: '440px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  closeBtn: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748B' },
  label: { display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#0F172A', marginBottom: '4px' },
  input: { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#0F172A', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
  submitBtn: { width: '100%', padding: '12px', backgroundColor: '#F97316', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }
};

export default VendorDashboard;