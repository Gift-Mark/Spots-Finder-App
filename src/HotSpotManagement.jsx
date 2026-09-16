import { useState, useEffect } from "react";
import styles from "./HotSpotManagement.module.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faBell,
  faCircleQuestion,
  faPlus,
  faPen,
  faTrash,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { Sidebar } from "./Components/sidebar";

const HotSpotManagement = () => {
  const navigate = useNavigate();
  const [hotSpots, setHotSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load the management table from the public places endpoint on first render.
  useEffect(() => {
    fetch("http://localhost:5000/api/places")
      .then((res) => res.json())
      .then((data) => {
        setHotSpots(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch places:", err);
        setLoading(false);
      });
  }, []);

  // Delete on the server first, then remove the confirmed record from local state.
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hot spot?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/places/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Match either the numeric seed id or MongoDB's generated document id.
        setHotSpots((prev) => prev.filter((spot) => spot.id !== id && spot._id !== id));
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to delete spot");
      }
    } catch (error) {
      console.error("Error deleting spot:", error);
      alert("Server error while deleting");
    }
  };

  return (
    <div className={styles.adminContainer}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* Top Header Actions */}
        <header className={styles.topHeader}>
          <nav className={styles.breadcrumbs}>
            <span>Management</span> &rsaquo;{" "}
            <span className={styles.currentBreadcrumb}>Hot Spots</span>
          </nav>

          <div className={styles.topActions}>
            <button className={styles.iconBtn}>
              <FontAwesomeIcon icon={faBell} />
              <span className={styles.notificationDot} />
            </button>
            <button className={styles.iconBtn}>
              <FontAwesomeIcon icon={faCircleQuestion} />
            </button>
            <button
              className={styles.primaryActionBtn}
              onClick={() => navigate("/adminDashboard")}
            >
              <FontAwesomeIcon icon={faPlus} /> New Spot
            </button>
          </div>
        </header>

        {/* Page Title */}
        <div className={styles.pageHeader}>
          <h1>Hot Spot Management</h1>
          <p className={styles.descriptionText}>
            Manage and monitor venues across the city.
          </p>
        </div>

        {/* Main Card / Table Wrapper */}
        <section className={styles.tableCard}>
          {/* Controls Header */}
          <div className={styles.controlsRow}>
            <div className={styles.searchBar}>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className={styles.searchIcon}
              />
              <input type="text" placeholder="Search venues..." />
            </div>

            <div className={styles.dropdownGroup}>
              <div className={styles.selectWrapper}>
                <select defaultValue="all-districts">
                  <option value="all-districts">All Districts</option>
                </select>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={styles.dropdownIcon}
                />
              </div>

              <div className={styles.selectWrapper}>
                <select defaultValue="all-vibes">
                  <option value="all-vibes">All Vibes</option>
                </select>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={styles.dropdownIcon}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className={styles.tableWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>VENUE NAME</th>
                  <th>LOCATION</th>
                  <th>CATEGORY</th>
                  <th>STATUS</th>
                  <th className={styles.alignRight}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                      Loading spots...
                    </td>
                  </tr>
                ) : hotSpots.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                      No spots found.
                    </td>
                  </tr>
                ) : (
                  hotSpots.map((item) => (
                    <tr key={item._id || item.id}>
                      <td>
                        <div className={styles.venueCell}>
                          <img
                            src={item.image}
                            alt={item.title}
                            className={styles.venueThumb}
                          />
                          <div>
                            <span className={styles.venueName}>{item.title}</span>
                            <span className={styles.venueId}>ID: {item.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className={styles.locationText}>{item.location}</td>
                      <td>
                        <span className={`${styles.vibeBadge} ${styles.vibeLively}`}>
                          {Array.isArray(item.category)
                            ? item.category.join(", ")
                            : item.category}
                        </span>
                      </td>
                      <td>
                        <span className={styles.statusCell}>
                          <span className={styles.activeDot} />
                          <span className={styles.statusText}>Active</span>
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionsCell}>
                          <button
                            className={styles.actionIconBtn}
                            onClick={() =>
                              navigate(`/adminDashboard/edit/${item.id || item._id}`)
                            }
                            title="Edit"
                          >
                            <FontAwesomeIcon icon={faPen} />
                          </button>
                          {/* handleDelete attached here */}
                          <button
                            className={styles.actionIconBtn}
                            onClick={() => handleDelete(item._id || item.id)}
                            title="Delete"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className={styles.tableFooter}>
            <span className={styles.paginationInfo}>
              Showing {hotSpots.length} entries
            </span>

            <div className={styles.paginationControls}>
              <button className={styles.pageArrowBtn} disabled>
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button className={`${styles.pageNumberBtn} ${styles.activePage}`}>
                1
              </button>
              <button className={styles.pageArrowBtn} disabled>
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HotSpotManagement;