import styles from "./createHotSpots.module.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faLocationDot,
  faMagnifyingGlass,
  faBell,
  faCircleQuestion,
  faPlus,
  faInfoCircle,
  faImage,
  faBoltLightning,
  faMusic,
  faUtensils,
  faCoffee,
  faFloppyDisk,
} from "@fortawesome/free-solid-svg-icons";
import { Sidebar } from "./Components/sidebar";

const CreateHotSpot = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [selectedVibe, setSelectedVibe] = useState("Chill");
  const [selectedTags, setSelectedTags] = useState(["Neon"]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    image: "",
    category: [],
  });

  // Edit routes load the existing record; create routes keep the empty form.
  useEffect(() => {
    if (isEditMode) {
      fetch(`http://localhost:5000/api/places/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            title: data.title || "",
            description: data.description || "",
            location: data.location || "",
            image: data.image || "",
            category: Array.isArray(data.category) ? data.category : [],
          });

          // Keep the tag controls aligned with the categories stored by the API.
          if (Array.isArray(data.category) && data.category.length > 0) {
            setSelectedTags(data.category.slice(0, 3));
          }
        })
        .catch((err) => console.error("Error fetching spot details:", err));
    }
  }, [id, isEditMode]);

  // Keep every text field in one object so create and edit use the same form.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Categories are stored as one array whose first item is the primary vibe.
  const toggleTag = (tag) => {
    let updatedTags;
    if (selectedTags.includes(tag)) {
      updatedTags = selectedTags.filter((t) => t !== tag);
    } else if (selectedTags.length < 3) {
      updatedTags = [...selectedTags, tag];
    } else {
      return;
    }

    setSelectedTags(updatedTags);
    setFormData((prev) => ({
      ...prev,
      category: [selectedVibe, ...updatedTags],
    }));
  };

  const handleVibeChange = (vibeId) => {
    setSelectedVibe(vibeId);
    setFormData((prev) => ({
      ...prev,
      category: [vibeId, ...selectedTags],
    }));
  };

  // The URL and method switch between creating a record and updating an existing one.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const url = isEditMode
      ? `http://localhost:5000/api/places/${id}`
      : "http://localhost:5000/api/places";
    const method = isEditMode ? "PUT" : "POST";

    const payload = {
      ...formData,
      slug: formData.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
      category: [selectedVibe, ...selectedTags],
    };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        navigate("/management");
      } else {
        const err = await response.json();
        alert(err.message || "Failed to save hot spot.");
      }
    } catch (error) {
      console.error("Error saving spot:", error);
    }
  };

  const vibeCategories = [
    { id: "Chill", label: "Chill", icon: faCoffee },
    { id: "Electric", label: "Electric", icon: faBoltLightning },
    { id: "Acoustic", label: "Acoustic", icon: faMusic },
    { id: "Dining", label: "Dining", icon: faUtensils },
  ];

  const availableTags = [
    "Neon",
    "Rooftop",
    "Techno",
    "Cocktails",
    "Lively",
    "Intimate",
    "Outdoor",
  ];

  return (
    <div className={styles.adminContainer}>
      {/* Sidebar Navigation */}
     <Sidebar />

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* Top Navbar */}
        <header className={styles.topHeader}>
          <div className={styles.searchBar}>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className={styles.searchIcon}
            />
            <input type="text" placeholder="Search..." />
          </div>

          <div className={styles.topActions}>
            <button className={styles.iconBtn}>
              <FontAwesomeIcon icon={faBell} />
              <span className={styles.notificationDot}>1</span>
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

        {/* Page Title & Breadcrumbs */}
        <div className={styles.pageHeader}>
          <nav className={styles.breadcrumbs}>
            <span>Hot Spots</span> &rsaquo;{" "}
            <span className={styles.currentBreadcrumb}>
              {isEditMode ? "Edit Spot" : "Create New"}
            </span>
          </nav>
          <h1>{isEditMode ? "Edit Hot Spot" : "Create Hot Spot"}</h1>
          <p className={styles.descriptionText}>
            Add a new location to the Jos Pulse ecosystem. Ensure details are
            accurate and visually engaging for urban explorers.
          </p>
        </div>

        {/* FORM WRAPPER */}
        <form onSubmit={handleSubmit}>
          {/* Form Body Grid */}
          <div className={styles.formGrid}>
            {/* Left Column */}
            <div className={styles.leftColumn}>
              {/* Basic Info Section */}
              <section className={`${styles.card} ${styles.purpleAccentCard}`}>
                <div className={styles.cardTitle}>
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className={styles.sectionIcon}
                  />
                  <h2>Basic Info</h2>
                </div>

                <div className={styles.inputGroup}>
                  <label>Venue Name</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. The Neon Lounge"
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Description</label>
                  <textarea
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the vibe and what makes this spot unique..."
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>District / Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Rayfield, Jos"
                  />
                </div>
              </section>

              {/* Vibe Settings Section */}
              <section className={`${styles.card} ${styles.cyanAccentCard}`}>
                <div className={styles.cardHeaderRow}>
                  <div className={styles.cardTitle}>
                    <FontAwesomeIcon
                      icon={faChartSimple}
                      className={styles.sectionIconCyan}
                    />
                    <h2>Vibe Settings</h2>
                  </div>
                  <div className={styles.toggleWrapper}>
                    <span>Live Status</span>
                    <input type="checkbox" id="liveStatus" defaultChecked />
                    <label
                      htmlFor="liveStatus"
                      className={styles.switchLabel}
                    ></label>
                  </div>
                </div>

                <div className={styles.vibeSection}>
                  <label className={styles.subLabel}>
                    Primary Vibe Category
                  </label>
                  <div className={styles.vibeGrid}>
                    {vibeCategories.map((vibe) => (
                      <button
                        type="button"
                        key={vibe.id}
                        className={`${styles.vibeCard} ${
                          selectedVibe === vibe.id ? styles.activeVibe : ""
                        }`}
                        onClick={() => handleVibeChange(vibe.id)}
                      >
                        <FontAwesomeIcon
                          icon={vibe.icon}
                          className={styles.vibeIcon}
                        />
                        <span>{vibe.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.tagSection}>
                  <label className={styles.subLabel}>
                    Vibe Tags (Select up to 3)
                  </label>
                  <div className={styles.tagWrap}>
                    {availableTags.map((tag) => (
                      <button
                        type="button"
                        key={tag}
                        className={`${styles.tagPill} ${
                          selectedTags.includes(tag) ? styles.activeTag : ""
                        }`}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className={styles.rightColumn}>
              {/* Media Upload Section */}
              <section className={`${styles.card} ${styles.purpleAccentCard}`}>
                <div className={styles.cardTitle}>
                  <FontAwesomeIcon
                    icon={faImage}
                    className={styles.sectionIcon}
                  />
                  <h2>Media</h2>
                </div>

                <div className={styles.inputGroup}>
                  <label>Cover Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="e.g. ../images/rayfield gardens.avif"
                  />
                </div>

                <div className={styles.mediaHint}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <span>Enter image path or image URL for venue cover.</span>
                </div>
              </section>

              {/* Location Section */}
              <section className={`${styles.card} ${styles.cyanAccentCard}`}>
                <div className={styles.cardTitle}>
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className={styles.sectionIconCyan}
                  />
                  <h2>Location Preview</h2>
                </div>

                <div className={styles.mapContainer}>
                  <div className={styles.mapMarker}>
                    <FontAwesomeIcon icon={faLocationDot} />
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Bottom Form Actions */}
          <div className={styles.bottomBar}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate("/management")}
            >
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn}>
              <FontAwesomeIcon icon={faFloppyDisk} />{" "}
              {isEditMode ? "Update Hot Spot" : "Save Hot Spot"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateHotSpot;