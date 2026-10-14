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
  onFilter, 
  onEdit, 
  onDelete,
  onApprove,
  onReject 
}) => {
  return (
    <div className={styles.tableCard}>
      {/* Header & Controls */}
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>Promoted Venue Listings</h2>
          <p className={styles.cardSubtitle}>Manage active subscriptions, approvals, and live listings.</p>
        </div>

        <div className={styles.actionGroup}>
          <button type="button" className={styles.filterBtn} onClick={onFilter}>
            <FontAwesomeIcon icon={faSliders} />
            <span>Filter</span>
          </button>
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
            {venues.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#64748B' }}>
                  No venue listings found. Click "New Listing" to add one.
                </td>
              </tr>
            ) : (
              venues.map((item) => {
                const venueId = item._id || item.id;
                const venueStatus = item.status || 'Active';
                
                return (
                  <tr key={venueId}>
                    {/* Venue Name & Thumbnail */}
                    <td className={styles.venueCell}>
                      <img 
                        src={item.imageUrl || item.image || '/images/default-venue.jpg'} 
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
                          venueStatus === 'Active'
                            ? styles.statusActive
                            : venueStatus === 'Pending'
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
        <a href="#all-listings" className={styles.viewAllLink}>
          View All Listings
        </a>
      </div>
    </div>
  );
};

export default PromotedVenuesTable;