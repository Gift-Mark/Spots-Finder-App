import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn, faPlus, faTrash, faEye, faMousePointer } from '@fortawesome/free-solid-svg-icons';

export const AdManagement = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    placement: 'Hero Banner',
    targetUrl: '',
    imageUrl: '',
    startDate: '',
    endDate: '',
    status: 'Active'
  });

  // Fetch ads on mount safely
  useEffect(() => {
    let isMounted = true;

    const fetchAds = async () => {
      try {
        if (isMounted) setLoading(true);
        const response = await fetch('/api/admin/ads', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        const adList = Array.isArray(data) ? data : data.data || data.ads || [];
        
        if (isMounted) {
          setAds(adList);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch ads:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAds();

    return () => {
      isMounted = false;
    };
  }, []);

  const reloadAds = async () => {
    try {
      const response = await fetch('/api/admin/ads', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      const adList = Array.isArray(data) ? data : data.data || data.ads || [];
      setAds(adList);
    } catch (err) {
      console.error('Failed to reload ads:', err);
    }
  };

  // Create new ad campaign
  const handleCreateAd = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/admin/ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      alert('Ad campaign created successfully!');
      setIsModalOpen(false);
      setFormData({ title: '', placement: 'Hero Banner', targetUrl: '', imageUrl: '', startDate: '', endDate: '', status: 'Active' });
      reloadAds();
    } catch {
      alert('Failed to create ad campaign.');
    }
  };

  // Delete ad campaign
  const handleDeleteAd = async (adId) => {
    if (!window.confirm('Are you sure you want to delete this ad campaign?')) return;
    try {
      await fetch(`/api/admin/ads/${adId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Ad deleted successfully.');
      reloadAds();
    } catch {
      alert('Failed to delete ad.');
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1E293B' }}>Ads & Sponsored Campaigns</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>Manage promotional banners, hero placements, and view campaign analytics.</p>
        </div>

        <button 
          type="button"
          onClick={() => setIsModalOpen(true)}
          style={{ backgroundColor: '#F97316', color: '#FFF', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FontAwesomeIcon icon={faPlus} /> Create Campaign
        </button>
      </div>

      {/* Ads Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B', fontSize: '12px', fontWeight: '700' }}>
              <th style={{ padding: '12px' }}>CAMPAIGN TITLE</th>
              <th style={{ padding: '12px' }}>PLACEMENT</th>
              <th style={{ padding: '12px' }}>IMPRESSIONS / CLICKS</th>
              <th style={{ padding: '12px' }}>STATUS</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>Loading ad campaigns...</td>
              </tr>
            ) : ads.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>No active ad campaigns found. Click "Create Campaign" to add one.</td>
              </tr>
            ) : (
              ads.map((ad) => {
                const adId = ad._id || ad.id;
                const status = ad.status || 'Active';

                return (
                  <tr key={adId} style={{ borderBottom: '1px solid #F1F5F9', fontSize: '14px', color: '#0F172A' }}>
                    <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FontAwesomeIcon icon={faBullhorn} style={{ color: '#F97316' }} />
                      <span style={{ fontWeight: '600' }}>{ad.title}</span>
                    </td>

                    <td style={{ padding: '12px', color: '#475569', fontSize: '13px' }}>
                      {ad.placement || 'Hero Banner'}
                    </td>

                    <td style={{ padding: '12px', color: '#475569', fontSize: '13px' }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <span><FontAwesomeIcon icon={faEye} /> {ad.impressions || 0}</span>
                        <span><FontAwesomeIcon icon={faMousePointer} /> {ad.clicks || 0}</span>
                      </div>
                    </td>

                    <td style={{ padding: '12px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: status === 'Active' ? '#DCFCE7' : '#FEE2E2',
                        color: status === 'Active' ? '#16A34A' : '#DC2626'
                      }}>
                        {status}
                      </span>
                    </td>

                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleDeleteAd(adId)}
                        style={{ background: '#FEE2E2', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', color: '#DC2626' }}
                        title="Delete Campaign"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE AD MODAL */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '28px', maxWidth: '440px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', color: '#0F172A' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Create Ad Campaign</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748B' }}>✕</button>
            </div>

            <form onSubmit={handleCreateAd} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Campaign Title</label>
                <input 
                  type="text" required 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Placement</label>
                <select 
                  value={formData.placement} 
                  onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC' }}
                >
                  <option value="Hero Banner">Hero Banner</option>
                  <option value="Sidebar Spotlight">Sidebar Spotlight</option>
                  <option value="Event Feed Sponsored">Event Feed Sponsored</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Target URL / Link</label>
                <input 
                  type="text" required 
                  placeholder="https://jos-pulse.com/venues/..."
                  value={formData.targetUrl} 
                  onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 16px', background: '#E2E8F0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 16px', background: '#F97316', color: '#FFF', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Publish Campaign</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdManagement;