import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faTrophy, faGlassWater, faGolfBall } from '@fortawesome/free-solid-svg-icons';
import styles from '../CSS/VendorEventsTable.module.css';

const events = [
  {
    id: 1,
    name: 'Annual Amateur Open',
    date: 'Oct 15, 2024',
    sold: 120,
    total: 150,
    icon: faTrophy,
    progressColor: '#f97316',
  },
  {
    id: 2,
    name: 'Clubhouse Mixer',
    date: 'Oct 22, 2024',
    sold: 45,
    total: 100,
    icon: faGlassWater,
    progressColor: '#f97316',
  },
  {
    id: 3,
    name: 'Pro-Am Tournament',
    date: 'Nov 05, 2024',
    sold: 20,
    total: 200,
    icon: faGolfBall,
    progressColor: '#f59e0b',
  },
];

export const VendorEventsTable = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Active Ticketed Events</h2>
        <a href="#view-all" className={styles.viewAllLink}>View All</a>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Date</th>
              <th>Tickets Sold</th>
              <th className={styles.actionHeader}>Action</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const percentage = Math.round((event.sold / event.total) * 100);
              return (
                <tr key={event.id}>
                  <td className={styles.eventNameCell}>
                    <div className={styles.eventIconBox}>
                      <FontAwesomeIcon icon={event.icon} />
                    </div>
                    <span className={styles.eventName}>{event.name}</span>
                  </td>
                  <td className={styles.dateCell}>{event.date}</td>
                  <td className={styles.progressCell}>
                    <div className={styles.progressTrack}>
                      <div
                        className={styles.progressBar}
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: event.progressColor,
                        }}
                      />
                    </div>
                    <span className={styles.progressText}>
                      {event.sold}/{event.total}
                    </span>
                  </td>
                  <td className={styles.actionCell}>
                    <button type="button" className={styles.moreBtn} aria-label="Event options">
                      <FontAwesomeIcon icon={faEllipsisVertical} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorEventsTable;