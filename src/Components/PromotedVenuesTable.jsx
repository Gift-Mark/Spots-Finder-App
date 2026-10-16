import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSliders, 
  faPlus, 
  faPen, 
  faCheck, 
  faXmark,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/PromotedVenuesTable.module.css';

export const PromotedVenuesTable = ({ 
  venues = [], 
  onNewListing, 
  onEdit, 
  onDelete,
  onApprove,
  onReject,
  onViewAll
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Filter the venues array dynamically
  const filteredVenues = venues.filter((venue) => {
    const matchCategory = selectedCategory === 'All' || venue.category === selectedCategory;
    const matchStatus = selectedStatus === 'All' || venue.status === selectedStatus;
    return matchCategory && matchStatus;
  });

  return (
    <div className={styles.tableCard}>
      {/* Header & Controls */}
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>Promoted Venue Listings</h2>
          <p className={styles.cardSubtitle}>Manage active subscriptions, approvals, and live listings.</p>
        </div>

        <div className={styles.actionGroup} style={{ position: 'relative', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            type="button" 
            className={styles.filterBtn} 
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <FontAwesomeIcon icon={faSliders} />
            <span>Filter</span>
          </button>

          {/* Filter Dropdown Popover */}
          {showFilterDropdown && (
            <div style={{
              position: 'absolute',
              right: '120px',
              top: '45px',
              width: '240px',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
              borderRadius: '10px',
              padding: '16px',
              zIndex: 100,
              border: '1px solid #E2E8F0',
              color: '#0F172A'
            }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '700', color: '#1E293B' }}>Filter Listings</h4>
              
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', color: '#475569', marginBottom: '4px' }}>Category</label>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', color: '#0F172A', fontSize: '13px', outline: 'none' }}
                >
                  <option value="All">All Categories</option>
                  <option value="Restaurant & Dining">Restaurant & Dining</option>
                  <option value="Hotel & Resort">Hotel & Resort</option>
                  <option value="Golf & Sports Club">Golf & Sports Club</option>
                  <option value="Lounge & Nightlife">Lounge & Nightlife</option>
                  <option value="Event Center & Arena">Event Center & Arena</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>Status</label>
                <select 
                  value={selectedStatus} 
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', color: '#0F172A', fontSize: '13px' }}
                >
                  <option value="All">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <button 
                onClick={() => { setSelectedCategory('All'); setSelectedStatus('All'); }}
                style={{ width: '100%', padding: '8px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', color: '#334155' }}
              >
                Reset Filters
              </button>
            </div>
          )}

          <button type="button" className={styles.newListingBtn} onClick={onNewListing}>
            <FontAwesomeIcon icon={faPlus} />
            <span>New Listing</span>
          </button>
        </div>
      </div>

      {/* Listings Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>VENUE NAME</th>
              <th>CATEGORY</th>
              <th>LOCATION</th>
              <th>PLAN</th>
              <th>STATUS</th>
              <th className={styles.actionsHeader}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredVenues.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#64748B' }}>
                  No venue listings match your filter criteria.
                </td>
              </tr>
            ) : (
              filteredVenues.map((item) => {
                const venueId = item._id || item.id;
                const venueStatus = item.status || 'Active';
                
                return (
                  <tr key={venueId}>
                    {/* Venue Name & Thumbnail */}
                    <td className={styles.venueCell}>
                      <img 
                        src={item.imageUrl || item.heroImage || '/images/default-venue.jpg'} 
                        alt={item.name} 
                        className={styles.venueThumb} 
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                      />
                      <span className={styles.venueName}>{item.name}</span>
                    </td>

                    {/* Category Badge */}
                    <td>
                      <span className={styles.categoryBadge}>{item.category || 'General'}</span>
                    </td>

                    {/* Location / Email */}
                    <td className={styles.emailCell}>{item.location || item.ownerEmail || 'Jos, Plateau'}</td>

                    {/* Subscription Plan */}
                    <td className={styles.planCell}>{item.plan || item.priceRange || 'Standard'}</td>

                    {/* Status Badge */}
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          venueStatus.toLowerCase() === 'active'
                            ? styles.statusActive
                            : venueStatus.toLowerCase() === 'pending'
                            ? styles.statusPending
                            : styles.statusExpired
                        }`}
                      >
                        <span className={styles.statusDot} />
                        {venueStatus}
                      </span>
                    </td>

                    {/* Actions (CRUD: Edit, Delete, Approve, Reject) */}
                    <td className={styles.actionsCell}>
                      <div className={styles.pendingActions} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {venueStatus === 'Pending' && onApprove && (
                          <button
                            type="button"
                            className={styles.approveBtn}
                            title="Approve Listing"
                            aria-label="Approve Listing"
                            onClick={() => onApprove(venueId)}
                          >
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                        )}

                        {venueStatus === 'Pending' && onReject && (
                          <button
                            type="button"
                            className={styles.rejectBtn}
                            title="Reject Listing"
                            aria-label="Reject Listing"
                            onClick={() => onReject(venueId)}
                          >
                            <FontAwesomeIcon icon={faXmark} />
                          </button>
                        )}

                        {onEdit && (
                          <button
                            type="button"
                            className={styles.editBtn}
                            title="Edit Listing"
                            aria-label="Edit Listing"
                            onClick={() => onEdit(item)}
                          >
                            <FontAwesomeIcon icon={faPen} />
                          </button>
                        )}

                        {onDelete && (
                          <button
                            type="button"
                            className={styles.rejectBtn}
                            title="Delete Listing"
                            aria-label="Delete Listing"
                            onClick={() => onDelete(venueId)}
                            style={{ backgroundColor: '#EF4444', color: '#FFF' }}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Link */}
      <div className={styles.cardFooter}>
        <button 
          type="button" 
          onClick={onViewAll} 
          style={{ background: 'none', border: 'none', color: '#F97316', fontWeight: '600', cursor: 'pointer', padding: 0, fontSize: '14px' }}
        >
          View All Listings →
        </button>
      </div>
    </div>
  );
};

export default PromotedVenuesTable;