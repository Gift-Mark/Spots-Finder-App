import { useState, useEffect } from 'react';
import AdminSidebar from './Components/AdminSidebar';
import AdminHeader from './Components/AdminHeader';
import PromotedVenuesTable from './Components/PromotedVenuesTable';
import FlaggedContentQueue from './Components/FlaggedContentQueue';
import styles from './CSS/AdminDashboard.module.css';

// API Client Methods
import { fetchPlaces, createPlace, updatePlace, deletePlace } from './api/client';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal / Form state for Create & Update
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Restaurant & Dining',
    location: '',
    description: '',
    priceRange: '₦₦',
    imageUrl: ''
  });

  // --- READ: Fetch venues on mount ---
  const loadVenues = async () => {
    try {
      setLoading(true);
      const data = await fetchPlaces();
      setVenues(Array.isArray(data) ? data : data.places || []);
    } catch (err) {
      setError('Failed to load platform listings.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- READ: Fetch venues on mount (Warning-free) ---
  useEffect(() => {

    const loadVenues = async () => {
    try {
      setLoading(true);
      const data = await fetchPlaces();
      console.log("RAW PLACES FETCHED:", data); // 👈 Check your browser console!
      setVenues(Array.isArray(data) ? data : data.places || data.data || []);
    } catch (err) {
      setError('Failed to load platform listings.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

    loadVenues();

  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleSearch = (query) => {
    console.log('Admin search query:', query);
  };

  // --- CREATE & UPDATE: Open Modal ---
  const handleOpenCreateModal = () => {
    setEditingVenue(null);
    setFormData({ name: '', category: 'Restaurant & Dining', location: '', description: '', priceRange: '₦₦', imageUrl: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (venue) => {
    setEditingVenue(venue);
    setFormData({
      name: venue.name || '',
      category: venue.category || 'Restaurant & Dining',
      location: venue.location || '',
      description: venue.description || '',
      priceRange: venue.priceRange || '₦₦',
      imageUrl: venue.imageUrl || ''
    });
    setIsModalOpen(true);
  };

  // --- SUBMIT CREATE OR UPDATE ---
  const handleSaveVenue = async (e) => {
    e.preventDefault();
    try {
      if (editingVenue) {
        // UPDATE
        await updatePlace(editingVenue._id || editingVenue.id, formData);
        alert('Venue updated successfully!');
      } else {
        // CREATE
        await createPlace(formData);
        alert('New venue created successfully!');
      }
      setIsModalOpen(false);

      setTimeout(async () => {
        await loadVenues(); // Refresh list
      }, 300)
       

    } catch (err) {
      alert('Operation failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // --- DELETE ---
  const handleDeleteVenue = async (id) => {
    if (!window.confirm('Are you sure you want to delete this venue listing?')) return;
    try {
      await deletePlace(id);
      alert('Venue deleted successfully!');

      // Give MongoDB a brief moment to commit before reloading the list
      setTimeout(async () => {
        await loadVenues();
      }, 300);
      
    } catch (err) {
      alert('Failed to delete venue: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleFilter = () => {
    alert('Opening Filter Drawer...');
  };

  const handleGoToModeration = () => {
    alert('Navigating to Moderation Hub...');
  };

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
        {/* Top Header */}
        <AdminHeader onSearch={handleSearch} />

        {/* Page Content Workspace */}
        <main className={styles.contentBody}>
          {/* Section Welcome Header */}
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>Platform Overview</h1>
              <p className={styles.pageSubtitle}>
                Real-time metrics and critical administration tasks for Jos Pulse.
              </p>
            </div>
            <button 
              onClick={handleOpenCreateModal}
              style={{ backgroundColor: '#F97316', color: '#FFF', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              + Add New Listing
            </button>
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          {loading && <p>Loading platform listings...</p>}

          {/* Promoted Venue Listings Table with live CRUD handlers */}
          <PromotedVenuesTable 
            venues={venues}
            onNewListing={handleOpenCreateModal}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteVenue}
            onFilter={handleFilter} 
          />

          {/* Bottom Grid Split: Flagged Content & Quick Actions */}
          <div className={styles.bottomSectionGrid}>
            <FlaggedContentQueue onGoToModeration={handleGoToModeration} />
          </div>
        </main>
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modalContainer}>
            <h3 style={{ marginTop: 0 }}>{editingVenue ? 'Edit Venue Listing' : 'Create New Promoted Venue'}</h3>
            <form onSubmit={handleSaveVenue} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={modalStyles.label}>Venue Name</label>
                <input 
                  type="text" required 
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
                  type="text" required 
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

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '10px 16px', background: '#E2E8F0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ padding: '10px 16px', background: '#F97316', color: '#FFF', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {editingVenue ? 'Save Changes' : 'Publish Listing'}
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
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
  },
  modalContainer: {
    backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '28px',
    maxWidth: '480px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', color: '#0F172A'
  },
  label: { display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' },
  input: { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }
};

export default AdminDashboard;