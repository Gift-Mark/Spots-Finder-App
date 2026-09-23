import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTicket, faStar, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/VendorStatsRow.module.css';

export const VendorStatsRow = () => {
  const stats = [
    {
      label: 'TOTAL VENUE VIEWS',
      value: '12,450',
      trend: '+14%',
      icon: faEye,
    },
    {
      label: 'TICKET REVENUE',
      value: '₦450,000',
      icon: faTicket,
    },
    {
      label: 'AVERAGE RATING',
      value: '4.8',
      subtext: '/5.0',
      icon: faStar,
    },
    {
      label: 'LISTING STATUS',
      status: 'Active',
      tag: 'Promoted Spot',
      icon: faShieldHalved,
    },
  ];

  return (
    <div className={styles.statsGrid}>
      {/* 1. Total Venue Views */}
      <div className={styles.statCard}>
        <div className={styles.cardHeader}>
          <span className={styles.statLabel}>{stats[0].label}</span>
          <div className={styles.iconWrapper}>
            <FontAwesomeIcon icon={stats[0].icon} />
          </div>
        </div>
        <div className={styles.cardBody}>
          <span className={styles.statValue}>{stats[0].value}</span>
          <span className={styles.trendBadge}>{stats[0].trend}</span>
        </div>
      </div>

      {/* 2. Ticket Revenue */}
      <div className={styles.statCard}>
        <div className={styles.cardHeader}>
          <span className={styles.statLabel}>{stats[1].label}</span>
          <div className={styles.iconWrapper}>
            <FontAwesomeIcon icon={stats[1].icon} />
          </div>
        </div>
        <div className={styles.cardBody}>
          <span className={styles.statValue}>{stats[1].value}</span>
        </div>
      </div>

      {/* 3. Average Rating */}
      <div className={styles.statCard}>
        <div className={styles.cardHeader}>
          <span className={styles.statLabel}>{stats[2].label}</span>
          <div className={styles.iconWrapperGold}>
            <FontAwesomeIcon icon={stats[2].icon} />
          </div>
        </div>
        <div className={styles.cardBody}>
          <span className={styles.statValue}>
            {stats[2].value} <span className={styles.subtext}>{stats[2].subtext}</span>
          </span>
        </div>
      </div>

      {/* 4. Listing Status */}
      <div className={styles.statCard}>
        <div className={styles.cardHeader}>
          <span className={styles.statLabel}>{stats[3].label}</span>
          <div className={styles.iconWrapper}>
            <FontAwesomeIcon icon={stats[3].icon} />
          </div>
        </div>
        <div className={styles.cardBodyColumn}>
          <div className={styles.statusRow}>
            <span className={styles.greenDot} />
            <span className={styles.statusText}>{stats[3].status}</span>
          </div>
          <span className={styles.promotedTag}>{stats[3].tag}</span>
        </div>
      </div>
    </div>
  );
};

export default VendorStatsRow;