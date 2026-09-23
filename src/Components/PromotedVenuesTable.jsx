import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSliders, 
  faPlus, 
  faPen, 
  faCheck, 
  faXmark 
} from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/PromotedVenuesTable.module.css';

const listingsData = [
  {
    id: 1,
    name: 'Rayfield Resort & Spa',
    image: './assets/images/rayfield-resort.jpg',
    category: 'Leisure',
    ownerEmail: 'admin@rayfield.com',
    plan: 'Premium Gold',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Jos Museum Heritage Center',
    image: './assets/images/jos-museum.jpg',
    category: 'Historical',
    ownerEmail: 'curator@josmuseum.ng',
    plan: 'Basic Free',
    status: 'Pending',
  },
  {
    id: 3,
    name: 'The Cave Lounge',
    image: './assets/images/cave-lounge.jpg',
    category: 'Nightlife',
    ownerEmail: 'hello@cavelounge.com',
    plan: 'Standard',
    status: 'Expired',
  },
];

export const PromotedVenuesTable = ({ onNewListing, onFilter }) => {
  return (
    <div className={styles.tableCard}>
      {/* Header & Controls */}
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>Promoted Venue Listings</h2>
          <p className={styles.cardSubtitle}>Manage active subscriptions and approvals.</p>
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
              <th>OWNER EMAIL</th>
              <th>PLAN</th>
              <th>STATUS</th>
              <th className={styles.actionsHeader}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {listingsData.map((item) => (
              <tr key={item.id}>
                {/* Venue Name & Thumbnail */}
                <td className={styles.venueCell}>
                  <img src={item.image} alt={item.name} className={styles.venueThumb} />
                  <span className={styles.venueName}>{item.name}</span>
                </td>

                {/* Category Badge */}
                <td>
                  <span className={styles.categoryBadge}>{item.category}</span>
                </td>

                {/* Owner Email */}
                <td className={styles.emailCell}>{item.ownerEmail}</td>

                {/* Subscription Plan */}
                <td className={styles.planCell}>{item.plan}</td>

                {/* Status Badge */}
                <td>
                  <span
                    className={`${styles.statusBadge} ${
                      item.status === 'Active'
                        ? styles.statusActive
                        : item.status === 'Pending'
                        ? styles.statusPending
                        : styles.statusExpired
                    }`}
                  >
                    <span className={styles.statusDot} />
                    {item.status}
                  </span>
                </td>

                {/* Actions */}
                <td className={styles.actionsCell}>
                  {item.status === 'Pending' ? (
                    <div className={styles.pendingActions}>
                      <button
                        type="button"
                        className={styles.approveBtn}
                        title="Approve Listing"
                        aria-label="Approve Listing"
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                      <button
                        type="button"
                        className={styles.rejectBtn}
                        title="Reject Listing"
                        aria-label="Reject Listing"
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={styles.editBtn}
                      title="Edit Listing"
                      aria-label="Edit Listing"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
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