import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getVenueImageUrl } from '../utils/imageHelpers';

export const VenueManagement = ({ venues = [], onEdit, onDelete, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Calculate statistics
  const stats = {
    total: venues.length,
    active: venues.filter(v => (v.status || 'active') === 'active').length,
    pending: venues.filter(v => v.status === 'pending').length,
    inactive: venues.filter(v => v.status === 'inactive').length,
  };

  // Filter venues based on local tab controls
  const filteredVenues = (venues || []).filter((venue) => {
    if (!venue) return false;

    const name = String(venue.name || venue.title || '').toLowerCase();
    const category = String(venue.category || 'General').toLowerCase();
    const location = String(venue.location || venue.address || '').toLowerCase();
    const status = String(venue.status || 'active').toLowerCase();

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = query === '' || name.includes(query) || category.includes(query) || location.includes(query);
    const matchesStatus = statusFilter === 'All' || status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleDeleteWithRefresh = async (venueId) => {
    await onDelete(venueId);
    if (onRefresh) onRefresh();
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      {/* Statistics Summary */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: '16px', 
        marginBottom: '24px' 
      }}>
        <div style={{ 
          padding: '16px', 
          backgroundColor: '#F8FAFC', 
          borderRadius: '10px', 
          border: '2px solid #E2E8F0' 
        }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600', marginBottom: '4px' }}>TOTAL VENUES</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#0F172A' }}>{stats.total}</div>
          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>Across all pages</div>
        </div>

        <div style={{ 
          padding: '16px', 
          backgroundColor: '#DCFCE7', 
          borderRadius: '10px', 
          border: '2px solid #86EFAC' 
        }}>
          <div style={{ fontSize: '12px', color: '#166534', fontWeight: '600', marginBottom: '4px' }}>ACTIVE</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#15803D' }}>{stats.active}</div>
          <div style={{ fontSize: '11px', color: '#16A34A', marginTop: '2px' }}>Live on website</div>
        </div>

        <div style={{ 
          padding: '16px', 
          backgroundColor: '#FEF3C7', 
          borderRadius: '10px', 
          border: '2px solid #FDE047' 
        }}>
          <div style={{ fontSize: '12px', color: '#854D0E', fontWeight: '600', marginBottom: '4px' }}>PENDING</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#A16207' }}>{stats.pending}</div>
          <div style={{ fontSize: '11px', color: '#CA8A04', marginTop: '2px' }}>Awaiting review</div>
        </div>

        <div style={{ 
          padding: '16px', 
          backgroundColor: '#FEE2E2', 
          borderRadius: '10px', 
          border: '2px solid #FCA5A5' 
        }}>
          <div style={{ fontSize: '12px', color: '#991B1B', fontWeight: '600', marginBottom: '4px' }}>INACTIVE</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#B91C1C' }}>{stats.inactive}</div>
          <div style={{ fontSize: '11px', color: '#DC2626', marginTop: '2px' }}>Hidden from public</div>
        </div>
      </div>

      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1E293B' }}>Venue Directory & Management</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>
            Showing {filteredVenues.length} of {stats.total} venues
          </p>
        </div>

        {/* Search & Status Filter Controls */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94A3B8' }} />
            <input 
              type="text"
              placeholder="Search venues or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '10px 14px 10px 36px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#F8FAFC',
                fontSize: '13px',
                outline: 'none',
                width: '240px',
                color: '#0F172A'
              }}
            />
          </div>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#F8FAFC',
              fontSize: '13px',
              color: '#0F172A',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Full Inventory Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B', fontSize: '12px', fontWeight: '700' }}>
              <th style={{ padding: '12px' }}>VENUE NAME</th>
              <th style={{ padding: '12px' }}>CATEGORY</th>
              <th style={{ padding: '12px' }}>LOCATION</th>
              <th style={{ padding: '12px' }}>CONTACT / PHONE</th>
              <th style={{ padding: '12px' }}>STATUS</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredVenues.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>
                  No venues match your search or filter criteria.
                </td>
              </tr>
            ) : (
              filteredVenues.map((venue) => {
                const venueId = venue._id || venue.id;
                const status = venue.status || 'active';

                return (
                  <tr key={venueId} style={{ borderBottom: '1px solid #F1F5F9', fontSize: '14px', color: '#0F172A' }}>
                    <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img 
                        src={getVenueImageUrl(venue)} 
                        alt={venue.name} 
                        style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = '/images/Rayfield Resort.jpg'; }}
                      />
                      <div>
                        <span style={{ fontWeight: '600', display: 'block' }}>{venue.name}</span>
                        <span style={{ fontSize: '11px', color: '#94A3B8' }}>Slug: {venue.slug || 'N/A'}</span>
                      </div>
                    </td>

                    <td style={{ padding: '12px' }}>
                      <span style={{ background: '#F1F5F9', color: '#334155', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                        {venue.category || 'General'}
                      </span>
                    </td>

                    <td style={{ padding: '12px', color: '#475569', fontSize: '13px' }}>
                      {venue.location || venue.address || 'Jos, Plateau'}
                    </td>

                    <td style={{ padding: '12px', color: '#475569', fontSize: '13px' }}>
                      {venue.phone || 'N/A'}
                    </td>

                    <td style={{ padding: '12px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: status === 'active' ? '#DCFCE7' : '#FEE2E2',
                        color: status === 'active' ? '#16A34A' : '#DC2626'
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: status === 'active' ? '#16A34A' : '#DC2626' }} />
                        {status.toUpperCase()}
                      </span>
                    </td>

                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => onEdit(venue)}
                          style={{ background: '#F1F5F9', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', color: '#334155' }}
                          title="Edit Venue"
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteWithRefresh(venueId)}
                          style={{ background: '#FEE2E2', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', color: '#DC2626' }}
                          title="Delete Venue"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VenueManagement;