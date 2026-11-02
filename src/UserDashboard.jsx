import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./CSS/userDashboard.module.css";
import {
  getMySavedSpots,
  getUserProfile,
  updateUserProfile,
  toggleSaveSpot,
  fetchMyBookings,
  default as api,
} from "./api/client";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  API_BASE_URL.replace(/\/api\/?$/, "");
const socket = io(SOCKET_URL);

const SPOTS_GEO = [
  {
    id: 1,
    name: "Rayfield Resort",
    lat: 9.8358,
    lng: 8.9131,
    type: "Resort",
    price: "₦12,500",
  },
  {
    id: 2,
    name: "Shere Hills Peak",
    lat: 9.9542,
    lng: 9.0225,
    type: "Scenic",
    price: "₦3,500",
  },
  {
    id: 3,
    name: "Jos Wildlife Park",
    lat: 9.8722,
    lng: 8.8751,
    type: "Nature",
    price: "₦1,500",
  },
  {
    id: 4,
    name: "Solomon Lar Leisure Gardens",
    lat: 9.9051,
    lng: 8.8912,
    type: "Dining",
    price: "Free",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // Real-time time & city status
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const hour = currentTime.getHours();
  const cityStatus = hour >= 6 && hour < 22 ? "🟢 Day Operations" : "🌙 Nightlife Mode";

  const [userCoords, setUserCoords] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  const heroGreeting = (() => {
    if (location.state?.greeting) return location.state.greeting;
    const firstName = currentUser?.firstName || "Explorer";
    const currentHour = new Date().getHours();
    const timeWord =
      currentHour < 12
        ? "Good morning"
        : currentHour < 18
          ? "Good afternoon"
          : "Good evening";
    return `${timeWord}, ${firstName}`;
  })();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("jos_pulse_token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const [activeNav, setActiveNav] = useState("Overview");
  const [activeTab, setActiveTab] = useState("Passes");
  const [behaviorStream, setBehaviorStream] = useState([]);
  const [feedPosts, setFeedPosts] = useState([]);
  const [postInput, setPostInput] = useState("");
  const [selectedFeedImage, setSelectedFeedImage] = useState(null);
  const [feedPublishError, setFeedPublishError] = useState("");
  const [feedLoadError, setFeedLoadError] = useState("");
  const [feedPublishing, setFeedPublishing] = useState(false);
  const [activeVibeFilter, setActiveVibeFilter] = useState(null);
  const [activeExplorers, setActiveExplorers] = useState(1);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [feedActionErrors, setFeedActionErrors] = useState({});

  const [liveStories] = useState([
    {
      id: 1,
      name: "The Net Bar",
      image: "/images/The net bar.avif",
      vibeStatus: "🔥 Packed",
      statusColor: "#EF4444",
      location: "THE NET RAYFIELD",
    },
    {
      id: 2,
      name: "Crispan Suites",
      image: "/images/Crispan.avif",
      vibeStatus: "🎵 Live DJ",
      statusColor: "#F59E0B",
      location: "CRISPAN SUITES",
    },
    {
      id: 3,
      name: "Shere Hills",
      image: "/images/Shere Hills Sunset Party.avif",
      vibeStatus: "⛰️ Hiking",
      statusColor: "#10B981",
      location: "SHERE HILLS",
    },
    {
      id: 4,
      name: "Rayfield Waters",
      image: "/images/Rayfield Resort.jpg",
      vibeStatus: "🌊 Breezy",
      statusColor: "#3B82F6",
      location: "RAYFIELD LAKE",
    },
  ]);

  const [savedSpots, setSavedSpots] = useState([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [savedError, setSavedError] = useState("");
  const [myBookings, setMyBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profileImage: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const profileImageInputRef = useRef(null);

  // Real-time Explorers Counter Listener
  useEffect(() => {
    socket.on("active_explorers_count", (count) => {
      if (typeof count === "number") {
        setActiveExplorers(count);
      }
    });
    return () => socket.off("active_explorers_count");
  }, []);

  // Real-time Post Publishing, Behavior Stream, and Post Updates
  useEffect(() => {
    socket.on("realtime_behavior_logged", (log) => {
      setBehaviorStream((prev) => [log, ...prev.slice(0, 5)]);
    });

    socket.on("post_published", (newPost) => {
      setFeedPosts((prev) => [
        newPost,
        ...prev.filter((post) => (post._id || post.id) !== (newPost._id || newPost.id)),
      ]);
    });

    socket.on("post_updated", ({ postId, likes, comments, likedBy, commentItems }) => {
      setFeedPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId || p._id === postId
            ? { ...p, likes, comments, likedBy, commentItems }
            : p
        )
      );
    });

    return () => {
      socket.off("realtime_behavior_logged");
      socket.off("post_published");
      socket.off("post_updated");
    };
  }, []);

  // Fetch saved spots
  useEffect(() => {
    if (activeNav === "Saved") {
      let isMounted = true;
      getMySavedSpots()
        .then((res) => {
          if (!isMounted) return;
          const apiSpots = Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res)
              ? res
              : [];
          const localStaysObj = JSON.parse(
            localStorage.getItem("jos_saved_stays") || "{}"
          );
          const localStaysList = Object.values(localStaysObj);

          const combinedMap = new Map();
          [...apiSpots, ...localStaysList].forEach((item) => {
            const id = item._id || item.slug || item.id;
            if (id) combinedMap.set(id, item);
          });

          setSavedSpots(Array.from(combinedMap.values()));
        })
        .catch((err) => {
          if (!isMounted) return;
          setSavedError(
            err.response?.data?.message ||
              "Could not load your saved spots from the server."
          );
          const localStaysObj = JSON.parse(
            localStorage.getItem("jos_saved_stays") || "{}"
          );
          setSavedSpots(Object.values(localStaysObj));
        })
        .finally(() => {
          if (isMounted) setSavedLoading(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [activeNav]);

  // Fetch bookings
  useEffect(() => {
    if (activeNav === "Bookings" || activeNav === "Overview") {
      fetchMyBookings()
        .then((res) => {
          const bookings = res?.data ?? (Array.isArray(res) ? res : []);
          setMyBookings(bookings);
        })
        .catch(() => setMyBookings([]))
        .finally(() => setBookingsLoading(false));
    }
  }, [activeNav]);

  // Fetch user profile
  useEffect(() => {
    if (activeNav === "Profile") {
      getUserProfile()
        .then((res) => {
          const d = res?.user || res?.data?.user || res?.data || res;
          setProfileData({
            firstName: d.firstName || "",
            lastName: d.lastName || "",
            email: d.email || "",
            profileImage: d.profileImage || "",
          });
          setProfileImagePreview(d.profileImage || "");
        })
        .catch((err) => {
          setProfileMsg(
            err.response?.data?.message || "Could not load your profile."
          );
        })
        .finally(() => setProfileLoading(false));
    }
  }, [activeNav]);

  // Reload persisted posts on mount and whenever the live connection returns.
  useEffect(() => {
    const loadFeedPosts = () =>
      api
        .get("/posts")
        .then(({ data }) => {
          setFeedLoadError("");
          if (data.success && Array.isArray(data.data)) {
            const loadedPosts = data.data.map((p) => ({
              id: p._id || p.id,
              userName: p.userName,
              userAvatar: p.userAvatar,
              location: p.location,
              postTime: new Date(p.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              postImage: p.postImage,
              postText: p.postText,
              likes: p.likes ?? "0",
              comments: p.comments ?? "0",
              likedBy: p.likedBy || [],
              commentItems: p.commentItems || [],
            }));
            setFeedPosts((currentPosts) => {
              const postsById = new Map(
                loadedPosts.map((post) => [post.id, post])
              );
              currentPosts.forEach((post) => {
                const id = post._id || post.id;
                if (!postsById.has(id)) postsById.set(id, post);
              });
              return Array.from(postsById.values());
            });
          }
        })
        .catch((err) => {
          console.error("Error fetching feed posts:", err);
          setFeedLoadError(
            "Could not load saved feed posts. Check that the backend and database are running."
          );
        });

    loadFeedPosts();
    socket.on("connect", loadFeedPosts);
    return () => socket.off("connect", loadFeedPosts);
  }, []);

  const changeNav = (nav) => {
    if (nav === activeNav) return;
    if (nav === "Saved") {
      setSavedLoading(true);
      setSavedError("");
    }
    else if (nav === "Bookings" || nav === "Overview") setBookingsLoading(true);
    else if (nav === "Profile") setProfileLoading(true);
    setActiveNav(nav);
  };

  const handleProfileImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setProfileMsg("Profile image must be 5MB or smaller.");
      e.target.value = "";
      return;
    }
    setProfileMsg("");
    const objectUrl = URL.createObjectURL(file);
    setProfileImagePreview(objectUrl);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfileData((prev) => ({ ...prev, profileImage: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const logBehavior = async (eventType, payload) => {
    try {
      const { data } = await api.post("/behavior/log", {
        sessionId: "sess_user_9921",
        eventType,
        payload,
      });
      if (data.success && data.data) {
        setBehaviorStream((prev) => [data.data, ...prev.slice(0, 5)]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const publishFeedPost = () => {
    if (!postInput.trim() && !selectedFeedImage) return;
    if (feedPublishing) return;
    setFeedPublishing(true);
    setFeedPublishError("");

    const newPostPayload = {
      user: currentUser?.firstName
        ? `${currentUser.firstName} ${currentUser.lastName || ""}`.trim()
        : "Explorer",
      userAvatar:
        profileData.profileImage ||
        currentUser?.profileImage ||
        "/images/John Doe.avif",
      location: activeVibeFilter || "Jos Central",
      content: postInput.trim(),
      postImage: selectedFeedImage || null,
    };

    socket.timeout(8000).emit("create_post", newPostPayload, (error, result) => {
      setFeedPublishing(false);
      if (error || !result?.success) {
        setFeedPublishError(
          result?.message || "Your post could not be saved. Check your connection and try again."
        );
        return;
      }

      socket.emit("log_activity", {
        eventType: "BROADCAST",
        message: `New post tagged at ${activeVibeFilter || "Jos Central"}`,
      });
      logBehavior("CATEGORY_CLICK", {
        category: "Feed Post",
        content: postInput,
      });
      setPostInput("");
      setSelectedFeedImage(null);
    });
  };

  const getCurrentUserId = () =>
    String(
      currentUser?._id ||
        currentUser?.id ||
        currentUser?.userId ||
        currentUser?.email ||
        `guest-${socket.id || "anonymous"}`
    );

  const handleLikePost = (post) => {
    const postId = post._id || post.id;
    setFeedActionErrors((prev) => ({ ...prev, [postId]: "" }));
    socket.timeout(5000).emit(
      "like_post",
      { postId, userId: getCurrentUserId() },
      (error, result) => {
        if (error || !result?.success) {
          setFeedActionErrors((prev) => ({
            ...prev,
            [postId]:
              result?.message || "Could not update this like. Check your connection.",
          }));
          return;
        }
        socket.emit("log_activity", {
          eventType: "LIKE",
          message: "Explorer liked a community broadcast",
        });
      }
    );
  };

  const handleCommentSubmit = (event, post) => {
    event.preventDefault();
    const postId = post._id || post.id;
    const commentText = (commentInputs[postId] || "").trim();
    if (!commentText) return;

    setFeedActionErrors((prev) => ({ ...prev, [postId]: "" }));
    socket.timeout(5000).emit(
      "add_comment",
      {
        postId,
        userId: getCurrentUserId(),
        userName:
          `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() ||
          "Explorer",
        userAvatar: profileData.profileImage || currentUser?.profileImage || "",
        commentText,
      },
      (error, result) => {
        if (error || !result?.success) {
          setFeedActionErrors((prev) => ({
            ...prev,
            [postId]:
              result?.message || "Could not publish your comment. Check your connection.",
          }));
          return;
        }
        setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
        socket.emit("log_activity", {
          eventType: "COMMENT",
          message: "Explorer commented on a broadcast",
        });
      }
    );
  };

  const renderPostEngagement = (post) => {
    const postId = post._id || post.id;
    const comments = Array.isArray(post.commentItems) ? post.commentItems : [];
    const isLiked = (post.likedBy || []).includes(getCurrentUserId());

    return (
      <>
        <div className={styles.postEngagement}>
          <button
            type="button"
            className={`${styles.engagementButton} ${isLiked ? styles.engagementButtonActive : ""}`}
            aria-pressed={isLiked}
            onClick={() => handleLikePost(post)}
          >
            {isLiked ? "❤️" : "🤍"} <span>{post.likes}</span> Likes
          </button>
          <button
            type="button"
            className={styles.engagementButton}
            aria-expanded={activeCommentPostId === postId}
            onClick={() =>
              setActiveCommentPostId((activeId) =>
                activeId === postId ? null : postId
              )
            }
          >
            💬 <span>{post.comments}</span> Comments
          </button>
          <span>🔄 Share</span>
        </div>
        {activeCommentPostId === postId && (
          <div className={styles.commentSection}>
            <div className={styles.commentList} aria-live="polite">
              {comments.length === 0 ? (
                <p className={styles.noComments}>No comments yet. Start the conversation.</p>
              ) : (
                comments.map((comment, index) => (
                  <article
                    className={styles.commentItem}
                    key={comment._id || `${comment.userId}-${comment.createdAt}-${index}`}
                  >
                    <img
                      className={styles.commentAvatar}
                      src={comment.userAvatar || "/images/John Doe.avif"}
                      alt=""
                      onError={(event) => {
                        event.currentTarget.src = "/images/John Doe.avif";
                      }}
                    />
                    <div className={styles.commentBody}>
                      <div className={styles.commentMeta}>
                        <strong>{comment.userName || "Explorer"}</strong>
                        <time>
                          {comment.createdAt
                            ? new Date(comment.createdAt).toLocaleString([], {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })
                            : "Just now"}
                        </time>
                      </div>
                      <p>{comment.text}</p>
                    </div>
                  </article>
                ))
              )}
            </div>
            <form
              className={styles.commentForm}
              onSubmit={(event) => handleCommentSubmit(event, post)}
            >
              <img
                className={styles.commentAvatar}
                src={profileImagePreview || currentUser?.profileImage || "/images/John Doe.avif"}
                alt=""
              />
              <input
                type="text"
                maxLength={1000}
                value={commentInputs[postId] || ""}
                onChange={(event) =>
                  setCommentInputs((prev) => ({
                    ...prev,
                    [postId]: event.target.value,
                  }))
                }
                placeholder="Write a comment..."
                aria-label="Write a comment"
              />
              <button type="submit" disabled={!(commentInputs[postId] || "").trim()}>
                Comment
              </button>
            </form>
          </div>
        )}
        {feedActionErrors[postId] && (
          <p className={styles.feedActionError} role="alert">
            {feedActionErrors[postId]}
          </p>
        )}
      </>
    );
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg("");
    try {
      const response = await updateUserProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        profileImage: profileData.profileImage,
      });
      const updatedUser = response?.user || response?.data?.user;
      if (updatedUser) {
        setProfileData({
          firstName: updatedUser.firstName || "",
          lastName: updatedUser.lastName || "",
          email: updatedUser.email || "",
          profileImage: updatedUser.profileImage || "",
        });
        setProfileImagePreview(updatedUser.profileImage || "");
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      setProfileMsg("Profile updated successfully!");
    } catch (err) {
      setProfileMsg(
        err.response?.data?.message ||
          err.message ||
          "Failed to update profile."
      );
    } finally {
      setProfileSaving(false);
    }
  };

  const filteredFeedPosts = feedPosts
    .map((p) => ({
      ...p,
      id: p.id || p._id,
      userName: p.userName || p.user || currentUser?.firstName || "Explorer",
      userAvatar: p.userAvatar || profileImagePreview || "/images/John Doe.avif",
      location: p.location || "Jos Plateau",
      postTime: p.postTime || p.time || "Just now",
      postImage: p.postImage || p.image || null,
      postText: p.content || p.postText || "",
      likes: p.likes ?? "0",
      comments: p.comments ?? "0",
      likedBy: p.likedBy || [],
      commentItems: p.commentItems || [],
    }))
    .filter((post) => {
      if (!activeVibeFilter) return true;
      return (
        post.location.toLowerCase().includes(activeVibeFilter.toLowerCase()) ||
        post.postText.toLowerCase().includes(activeVibeFilter.toLowerCase())
      );
    });

  const [weatherData, setWeatherData] = useState({
    temp: "28°C",
    breeze: "12 km/h",
    humidity: "32%",
    uv: "Moderate",
    condition: "Partly Cloudy",
    recommendation: "☀️ Ideal for Rayfield Lakeside Pass"
  });

  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=9.9285&longitude=8.8921&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code")
      .then((res) => res.json())
      .then((data) => {
        if (data.current) {
          const temp = Math.round(data.current.temperature_2m);
          const humidity = data.current.relative_humidity_2m;
          const windSpeed = Math.round(data.current.wind_speed_10m);
          
          let rec = "⛰️ Great trek weather for Shere Hills";
          if (temp > 30) {
            rec = "🍹 Recommended: Rayfield Waterpark & Cabanas";
          } else if (temp < 18) {
            rec = "☕ Perfect evening for Crispan Lounge & Coffee";
          }

          setWeatherData({
            temp: `${temp}°C`,
            breeze: `${windSpeed} km/h`,
            humidity: `${humidity}%`,
            uv: temp > 28 ? "High" : "Moderate",
            condition: "Highland Breeze",
            recommendation: rec,
          });
        }
      })
      .catch((err) => console.warn("Fallback to default weather:", err));
  }, []);

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.brandGroup}>
          <span className={styles.brandLogo}>🔥 Jos Pulse</span>
          <nav className={styles.topNav}>
            <Link className={styles.active} to="/explore">
              Explore
            </Link>
            <Link to="/culture">Culture</Link>
            <Link to="/dining">Restaurants</Link>
            <Link to="/flights">Flights</Link>
            <Link to="/stays">Stays</Link>
            <Link to="/events">Events</Link>
          </nav>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.proBadge}>● PRO MEMBER</span>
          <div className={styles.userInfo}>
            <span className={styles.userAvatar}>
              {profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt="avatar"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                "👤"
              )}
            </span>
            <div className={styles.userNameBlock}>
              <strong className={styles.userName}>
                {currentUser?.firstName
                  ? `${currentUser.firstName} ${currentUser.lastName || ""}`.trim()
                  : "Explorer"}
              </strong>
              <span className={styles.userRole}>Plateau Explorer</span>
            </div>

            <span className={styles.pillBadge} style={{ marginLeft: "12px" }}>
              🟢 {activeExplorers} Explorer{activeExplorers === 1 ? "" : "s"}{" "}
              Online
            </span>
          </div>
          <button
            className={styles.logoutBtn}
            onClick={handleLogout}
            type="button"
          >
            ↪ Log Out
          </button>
        </div>
      </header>

      <div className={styles.mainLayout}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <small className={styles.sidebarLabel}>MAIN CONSOLE</small>
            <button
              className={`${styles.sideBtn} ${activeNav === "Overview" ? styles.sideBtnActive : ""}`}
              onClick={() => {
                changeNav("Overview");
                logBehavior("FILTER_SELECT", { nav: "Overview" });
              }}
            >
              📊 Overview
            </button>
            <button
              className={`${styles.sideBtn} ${activeNav === "Bookings" ? styles.sideBtnActive : ""}`}
              onClick={() => {
                changeNav("Bookings");
                logBehavior("FILTER_SELECT", { nav: "Bookings" });
              }}
            >
              🎟️ My Bookings
            </button>
            <button
              className={`${styles.sideBtn} ${activeNav === "Saved" ? styles.sideBtnActive : ""}`}
              onClick={() => {
                changeNav("Saved");
                logBehavior("FILTER_SELECT", { nav: "Saved" });
              }}
            >
              🔖 Saved Spots
            </button>
            <button
              className={`${styles.sideBtn} ${activeNav === "Profile" ? styles.sideBtnActive : ""}`}
              onClick={() => {
                changeNav("Profile");
                logBehavior("FILTER_SELECT", { nav: "Profile" });
              }}
            >
              ⚙️ Profile Settings
            </button>
            <button
              className={`${styles.sideBtn} ${activeNav === "Feed" ? styles.sideBtnActive : ""}`}
              onClick={() => {
                changeNav("Feed");
                logBehavior("FILTER_SELECT", { nav: "Feed" });
              }}
            >
              📡 Live Feed
            </button>
            <button
              className={`${styles.sideBtn} ${activeNav === "Map" ? styles.sideBtnActive : ""}`}
              onClick={() => {
                changeNav("Map");
                logBehavior("VENUE_VIEW", { nav: "Map" });
              }}
            >
              🗺️ Map Engine
            </button>
          </div>

          <div className={styles.sidebarWidget}>
            <small className={styles.sidebarLabel}>LIVE LOGSTREAM</small>
            <div className={styles.miniLogList}>
              {behaviorStream.length === 0 ? (
                <small className={styles.subtext}>Awaiting events...</small>
              ) : (
                behaviorStream.map((log, i) => (
                  <div key={log._id || i} className={styles.miniLogCard}>
                    <span className={styles.logTag}>{log.eventType}</span>
                    <small
                      style={{
                        fontSize: "11px",
                        color: "#64748B",
                        marginTop: "2px",
                      }}
                    >
                      {log.message || "Explorer activity"}
                    </small>
                    <small style={{ fontSize: "10px", color: "#94A3B8" }}>
                      {log.createdAt
                        ? new Date(log.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Just now"}
                    </small>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={styles.conciergeBox}>
            <strong>🎧 Jos Concierge</strong>
            <p>24/7 Plateau travel & dining assistance available.</p>
            <button
              className={styles.settingsBtn}
              onClick={() => changeNav("Profile")}
            >
              ⚙️ Settings
            </button>
          </div>
        </aside>

        {/* MAIN DISPLAY AREA */}
        <main className={styles.content}>
          {activeNav === "Overview" && (
            <>
              <section className={styles.heroCard}>
                <div className={styles.heroLeft}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span className={styles.pillBadge}>📍 PLATEAU TRAVEL & VIBE PORTAL</span>
                    <span style={{ fontSize: "12px", background: "#DBEAFE", color: "#1E40AF", padding: "2px 8px", borderRadius: "10px", fontWeight: "600" }}>
                      {cityStatus}
                    </span>
                  </div>
                  <h1>{heroGreeting}</h1>
                  <p>
                    You have <strong>{myBookings.length} active pass{myBookings.length === 1 ? '' : 'es'}</strong> ready for check-in and <strong>{savedSpots.length} saved spot{savedSpots.length === 1 ? '' : 's'}</strong> in your Plateau itinerary.
                  </p>
                  <div className={styles.heroStats}>
                    <span>🌐 {userCoords ? `${userCoords.lat.toFixed(2)}°N, ${userCoords.lng.toFixed(2)}°E` : "1,280m Elevation"}</span>
                    <span style={{ cursor: "pointer" }} onClick={() => navigate("/profile")}>
                      ✓ {currentUser?.firstName ? `${currentUser.firstName} (Verified)` : "Guest Account"}
                    </span>
                    <span>🕒 {formattedTime} WAT</span>
                  </div>
                </div>

                <div className={styles.heroWeatherWidget}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <small style={{ fontWeight: "700", letterSpacing: "0.5px" }}>
                      PLATEAU HIGHLANDS INTEL
                      <br />
                      <span style={{ opacity: 0.8, fontWeight: "normal" }}>Jos, Nigeria</span>
                    </small>
                    <span 
                      style={{ 
                        fontSize: "11px", 
                        backgroundColor: "#10B98115", 
                        color: "#10B981", 
                        padding: "2px 8px", 
                        borderRadius: "10px", 
                        fontWeight: "bold" 
                      }}
                    >
                      ● LIVE TELEMETRY
                    </span>
                  </div>

                  <div className={styles.weatherTemp} style={{ margin: "12px 0 6px 0" }}>
                    {weatherData.temp}{" "}
                    <span className={styles.optimaTag} style={{ marginLeft: "6px" }}>
                      {weatherData.condition}
                    </span>
                  </div>

                  <div className={styles.weatherGrid}>
                    <div>
                      <small>BREEZE</small>
                      <br />
                      <strong>{weatherData.breeze}</strong>
                    </div>
                    <div>
                      <small>HUMIDITY</small>
                      <br />
                      <strong>{weatherData.humidity}</strong>
                    </div>
                    <div>
                      <small>UV INDEX</small>
                      <br />
                      <strong>{weatherData.uv}</strong>
                    </div>
                  </div>

                  <div 
                    style={{
                      marginTop: "12px",
                      padding: "8px 10px",
                      backgroundColor: "rgba(255, 255, 255, 0.6)",
                      backdropFilter: "blur(4px)",
                      borderRadius: "8px",
                      border: "1px solid rgba(226, 232, 240, 0.8)",
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#1E293B"
                    }}
                  >
                    {weatherData.recommendation}
                  </div>
                </div>
              </section>

              <section className={styles.twoColumnGrid}>
                <div className={styles.actionCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardIcon}>🧭</span>
                    <small>FEATURED ESCAPES</small>
                  </div>
                  <h3>Explore Plateau Spots</h3>
                  <p>
                    Discover historic and vibrant venues across Rayfield Resort,
                    pristine Shere Hills monoliths, and the legendary Jos National Museum.
                  </p>
                  <div className={styles.tagGroup}>
                    <span 
                      className={styles.subTag} 
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        navigate("/place/rayfield-resort");
                        logBehavior("VENUE_VIEW", { name: "Rayfield Resort" });
                      }}
                    >
                      Rayfield Waters
                    </span>
                    <span 
                      className={styles.subTag} 
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        navigate("/place/shere-hills-rock-climbing");
                        logBehavior("VENUE_VIEW", { name: "Shere Hills" });
                      }}
                    >
                      Shere Peak Trails
                    </span>
                    <span 
                      className={styles.subTag} 
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        navigate("/place/jos-national-museum");
                        logBehavior("VENUE_VIEW", { name: "National Museum" });
                      }}
                    >
                      National Museum
                    </span>
                  </div>
                  <button
                    className={styles.primaryDarkBtn}
                    onClick={() => {
                      logBehavior("SEARCH", { query: "Browse 35+ Local Venues" });
                      navigate("/explore");
                    }}
                  >
                    Browse 35+ Local Venues →
                  </button>
                </div>

                <div className={styles.actionCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardIcon}>✈</span>
                    <small>YAKUBU GOWON JOS</small>
                  </div>
                  <h3>Book Domestic Flights</h3>
                  <p>
                    Connect seamlessly from Lagos (LOS) and Abuja (ABV) to Jos
                    Airport. Track regional highland hops, delays, and arrivals
                    in real time.
                  </p>
                  <div className={styles.tagGroup}>
                    <span 
                      className={styles.subTag}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        logBehavior("BOOKING_ATTEMPT", { flight: "LOS-JOS" });
                        navigate("/flights", { state: { route: "LOS-JOS" } });
                      }}
                    >
                      LOS → JOS
                    </span>
                    <span 
                      className={styles.subTag}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        logBehavior("BOOKING_ATTEMPT", { flight: "ABV-JOS" });
                        navigate("/flights", { state: { route: "ABV-JOS" } });
                      }}
                    >
                      ABV → JOS
                    </span>
                    <span className={styles.subTag}>50 min direct</span>
                  </div>
                  <button
                    className={styles.secondaryLightBtn}
                    onClick={() => {
                      logBehavior("BOOKING_ATTEMPT", { flight: "Schedules Hub" });
                      navigate("/flights");
                    }}
                  >
                    Check Flight Schedules
                  </button>
                </div>
              </section>

              <section className={styles.passSection}>
                <div className={styles.passHeader}>
                  <div>
                    <small>LIVE RESERVATIONS</small>
                    <h2>My Active Travel Passes</h2>
                  </div>
                  <div className={styles.tabToggle}>
                    <button
                      className={
                        activeTab === "Passes"
                          ? styles.activeTabBtn
                          : styles.tabBtn
                      }
                      onClick={() => setActiveTab("Passes")}
                    >
                      🎫 Access Passes (1)
                    </button>
                    <button
                      className={
                        activeTab === "Flights"
                          ? styles.activeTabBtn
                          : styles.tabBtn
                      }
                      onClick={() => setActiveTab("Flights")}
                    >
                      ✈️ Flight Reservations ({myBookings.filter(b => b.bookingType === "Flight Reservation" || (b.provider || "").toLowerCase().includes("flight") || (b.destination || "").toLowerCase().includes("jos")).length})
                    </button>
                  </div>
                </div>

                <div className={styles.ticketGrid}>
                  {activeTab === "Passes" && (
                    <>
                      <div className={styles.ticketMain}>
                        <div className={styles.badgeRow}>
                          <span className={styles.goldBadge}>
                            VIP WEEKEND PASS
                          </span>
                          <span className={styles.activePill}>
                            ● ACTIVE FOR ENTRY
                          </span>
                          <small className={styles.refCode}>
                            Ref: #JP-88219-QR
                          </small>
                        </div>
                        <h2>Rayfield Holiday Resort & Water Park</h2>
                        <p className={styles.locSub}>
                          📍 Rayfield Lake Promenade, Jos South, Plateau State
                        </p>
                        <div className={styles.ticketDetailsRow}>
                          <div>
                            <small>SCHEDULED DATE</small>
                            <p>
                              Sat, Oct 25, 2026
                              <br />
                              10:00 AM WAT
                            </p>
                          </div>
                          <div>
                            <small>PARTY SIZE</small>
                            <p>
                              3 Guests
                              <br />2 Adults, 1 Child
                            </p>
                          </div>
                          <div>
                            <small>TOTAL PAID</small>
                            <p className={styles.priceHighlight}>
                              ₦12,500
                              <br />
                              <small>Instant Clearance</small>
                            </p>
                          </div>
                        </div>
                        <div className={styles.amenitiesBox}>
                          <small>🏷️ INCLUDED PRIVILEGE AMENITIES</small>
                          <p>
                            Full 45-minute Lake Rayfield Boat Cruise, private
                            Lakeside Cabana entry, and complimentary Zobo
                            coolers.
                          </p>
                        </div>
                        <div className={styles.ticketFooter}>
                          <small>
                            🛡️ Valid Government ID required at turnstiles
                          </small>
                          <button
                            className={styles.downloadBtn}
                            onClick={() =>
                              logBehavior("CATEGORY_CLICK", {
                                action: "Download Ticket PDF",
                              })
                            }
                          >
                            📥 Download Pass (PDF)
                          </button>
                        </div>
                      </div>

                      <div className={styles.qrCard}>
                        <div className={styles.qrHeader}>
                          <span>FAST PASS GATE</span>
                          <span>✖</span>
                        </div>
                        <div className={styles.qrFrame}>
                          <svg
                            width="120"
                            height="120"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M2 2H10V10H2V2ZM4 4V8H8V4H4ZM14 2H22V10H14V2ZM16 4V8H20V4H16ZM2 14H10V22H2V14ZM4 16V20H8V16H4ZM12 12H14V14H12V12ZM14 14H16V16H14V14ZM16 12H18V14H16V12ZM18 14H20V16H18V14ZM20 12H22V14H20V12ZM12 16H14V18H12V16ZM14 18H16V20H14V18ZM16 16H18V18H16V16ZM18 18H20V20H18V18ZM20 16H22V18H20V16ZM12 20H14V22H12V20ZM16 20H18V22H16V20ZM20 20H22V22H20V20Z"
                              fill="#0f172a"
                            />
                          </svg>
                        </div>
                        <small className={styles.scanText}>
                          SCAN AT ENTRANCE
                          <br />
                          Gate A • Turnstile #3
                        </small>
                        <button className={styles.presentBtn}>
                          Present Pass on Phone
                        </button>
                      </div>
                    </>
                  )}

                  {activeTab === "Flights" && (
                    <div style={{ gridColumn: "1 / -1" }}>
                      {bookingsLoading ? (
                        <p className={styles.loadingText}>
                          Loading flight reservations...
                        </p>
                      ) : myBookings.filter(
                          (b) =>
                            b.bookingType === "Flight Reservation" ||
                            (b.provider || "")
                              .toLowerCase()
                              .includes("flight") ||
                            (b.destination || "").toLowerCase().includes("jos")
                        ).length === 0 ? (
                        <div
                          style={{ textAlign: "center", padding: "2rem 1rem" }}
                        >
                          <p style={{ color: "#64748b", marginBottom: "1rem" }}>
                            No flight reservations yet.
                          </p>
                          <Link
                            to="/flights"
                            className={styles.primaryDarkBtn}
                            style={{
                              display: "inline-block",
                              textDecoration: "none",
                              padding: "0.65rem 1.5rem",
                            }}
                          >
                            ✈️ Book a Flight to Jos
                          </Link>
                        </div>
                      ) : (
                        <div className={styles.bookingsList}>
                          {myBookings
                            .filter(
                              (b) =>
                                b.bookingType === "Flight Reservation" ||
                                (b.provider || "")
                                  .toLowerCase()
                                  .includes("flight") ||
                                (b.destination || "")
                                  .toLowerCase()
                                  .includes("jos")
                            )
                            .map((booking) => (
                              <div
                                key={booking._id}
                                className={styles.bookingItem}
                              >
                                <div className={styles.bookingItemLeft}>
                                  <span className={styles.bookingIcon}>✈️</span>
                                  <div>
                                    <strong className={styles.bookingVenue}>
                                      {booking.provider || "Flight"}
                                    </strong>
                                    <p className={styles.bookingMeta}>
                                      📅{" "}
                                      {booking.startDate
                                        ? new Date(
                                            booking.startDate
                                          ).toLocaleDateString("en-NG", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                          })
                                        : "—"}
                                      {booking.destination
                                        ? ` · ${booking.destination}`
                                        : ""}
                                    </p>
                                  </div>
                                </div>
                                <div className={styles.bookingItemRight}>
                                  <span
                                    className={`${styles.bookingStatus} ${booking.paymentStatus === "paid" ? styles.bookingStatusPaid : styles.bookingStatusPending}`}
                                  >
                                    {booking.paymentStatus === "paid"
                                      ? "✓ Confirmed"
                                      : "⏳ Pending"}
                                  </span>
                                  <strong className={styles.bookingAmount}>
                                    ₦{(booking.amount || 0).toLocaleString()}
                                  </strong>
                                  {booking.bookingReference && (
                                    <small className={styles.bookingRef}>
                                      #{booking.bookingReference}
                                    </small>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>

              <section className={styles.trendingSection}>
                <div className={styles.trendingHeader}>
                  <div>
                    <small>PLATEAU CURATIONS</small>
                    <h3>Trending Nearby in Jos</h3>
                  </div>
                  <Link to="/explore" className={styles.viewCatalogLink}>
                    View Full City Catalog ›
                  </Link>
                </div>

                <div className={styles.cards3Grid}>
                  <div
                    className={styles.curationCard}
                    onClick={() => {
                      navigate("/place/shere-hills-rock-climbing");
                      logBehavior("VENUE_VIEW", {
                        name: "Shere Hills Rock Climbing",
                      });
                    }}
                  >
                    <div
                      className={styles.curationImgBox}
                      style={{
                        backgroundImage: "url('/images/Shere hills hike.jpg')",
                      }}
                    >
                      <span className={styles.curTag}>HIKING & SCENIC</span>
                      <span className={styles.ratingBadge}>★ 4.9 (84)</span>
                    </div>
                    <h4>Shere Hills Rock Climbing & Trail Trek</h4>
                    <p>
                      Plateau State's highest peak at ~6,000ft — granite
                      formations, caves and challenging ridge trails.
                    </p>
                    <div className={styles.cardFooter}>
                      <small>From ₦3,500 / guide</small>
                      <span>→</span>
                    </div>
                  </div>

                  <div
                    className={styles.curationCard}
                    onClick={() => {
                      navigate("/place/jos-wildlife-park");
                      logBehavior("VENUE_VIEW", { name: "Jos Wildlife Park" });
                    }}
                  >
                    <div
                      className={styles.curationImgBox}
                      style={{
                        backgroundImage: "url('/images/wildlife park.jpg')",
                      }}
                    >
                      <span className={styles.curTag}>NATURE RESERVE</span>
                      <span className={styles.ratingBadge}>★ 4.2 (310)</span>
                    </div>
                    <h4>Jos Wildlife Park</h4>
                    <p>
                      Nigeria's premier nature reserve — vast pine forests,
                      scenic wildlife viewing and habitat conservation.
                    </p>
                    <div className={styles.cardFooter}>
                      <small>From ₦1,500 / entry</small>
                      <span>→</span>
                    </div>
                  </div>

                  <div
                    className={styles.curationCard}
                    onClick={() => {
                      navigate("/place/solomon-lar-amusement-park");
                      logBehavior("VENUE_VIEW", {
                        name: "Solomon Lar Amusement Park",
                      });
                    }}
                  >
                    <div
                      className={styles.curationImgBox}
                      style={{
                        backgroundImage: "url('/images/solomon lar.jpg')",
                      }}
                    >
                      <span className={styles.curTag}>LEISURE & DINING</span>
                      <span className={styles.ratingBadge}>★ 4.4 (185)</span>
                    </div>
                    <h4>Solomon Lar Amusement Park</h4>
                    <p>
                      Serene urban park with artificial lakes, picnic grounds
                      and family entertainment in Jos South.
                    </p>
                    <div className={styles.cardFooter}>
                      <small>Free Public Access</small>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeNav === "Bookings" && (
            <section className={styles.panelSection}>
              <h2 className={styles.panelTitle}>🎟️ My Bookings</h2>
              {bookingsLoading ? (
                <p className={styles.loadingText}>Loading your bookings...</p>
              ) : myBookings.length === 0 ? (
                <p className={styles.emptyText}>
                  No bookings yet. Reserve a pass from any spot's detail page.
                </p>
              ) : (
                <div className={styles.bookingsList}>
                  {myBookings.map((booking) => (
                    <div key={booking._id} className={styles.bookingItem}>
                      <div className={styles.bookingItemLeft}>
                        <span className={styles.bookingIcon}>🎫</span>
                        <div>
                          <strong className={styles.bookingVenue}>
                            {booking.provider || booking.destination || "Venue"}
                          </strong>
                          <p className={styles.bookingMeta}>
                            📅{" "}
                            {booking.startDate
                              ? new Date(booking.startDate).toLocaleDateString(
                                  "en-NG",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "—"}
                            {booking.bookingType
                              ? ` · ${booking.bookingType}`
                              : ""}
                          </p>
                        </div>
                      </div>
                      <div className={styles.bookingItemRight}>
                        <span
                          className={`${styles.bookingStatus} ${booking.paymentStatus === "paid" ? styles.bookingStatusPaid : styles.bookingStatusPending}`}
                        >
                          {booking.paymentStatus === "paid"
                            ? "✓ Paid"
                            : "⏳ Pending"}
                        </span>
                        <strong className={styles.bookingAmount}>
                          {booking.amount === 0
                            ? "Free"
                            : `₦${(booking.amount || 0).toLocaleString()}`}
                        </strong>
                        {booking.bookingReference && (
                          <small className={styles.bookingRef}>
                            #{booking.bookingReference}
                          </small>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeNav === "Feed" && (
            <section className={styles.panelSection}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <h2 style={{ margin: 0, fontSize: "20px" }}>
                  📡 Jos Live Community Feed
                </h2>
                <span
                  style={{
                    fontSize: "12px",
                    backgroundColor: "#FEF3C7",
                    color: "#92400E",
                    padding: "4px 10px",
                    borderRadius: "12px",
                    fontWeight: "bold",
                  }}
                >
                  ● Live Socket Stream Active
                </span>
              </div>

              {/* Live Vibe Indicator Stories Bar */}
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  overflowX: "auto",
                  paddingBottom: "16px",
                  marginBottom: "20px",
                  scrollbarWidth: "none",
                }}
              >
                {/* Reset Filter Button */}
                <div
                  onClick={() => setActiveVibeFilter(null)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                    flexShrink: "0",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: "68px",
                      height: "68px",
                      borderRadius: "50%",
                      padding: "3px",
                      background:
                        activeVibeFilter === null ? "#F97316" : "#CBD5E1",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#1E293B",
                      color: "#FFFFFF",
                      fontSize: "22px",
                    }}
                  >
                    🔥
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#0F172A",
                      maxWidth: "72px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    All Vibes
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "600",
                      color: "#F97316",
                      backgroundColor: "#FEF3C7",
                      padding: "2px 6px",
                      borderRadius: "8px",
                    }}
                  >
                    ✨ Live Feed
                  </span>
                </div>

                {/* Vibe Spot Bubbles */}
                {liveStories.map((story) => {
                  const isSelected = activeVibeFilter === story.name;
                  return (
                    <div
                      key={story.id}
                      onClick={() => {
                        const newFilter = isSelected ? null : story.name;
                        setActiveVibeFilter(newFilter);
                        logBehavior("CATEGORY_CLICK", { vibeSpot: story.name });
                        socket.emit("log_activity", {
                          eventType: "VIBE_CHECK",
                          message: `Filtering live vibes for ${story.name}`,
                        });
                      }}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                        flexShrink: "0",
                        textAlign: "center",
                        opacity: isSelected ? 1 : 0.85,
                        transform: isSelected ? "scale(1.05)" : "scale(1)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div
                        style={{
                          width: "68px",
                          height: "68px",
                          borderRadius: "50%",
                          padding: "3px",
                          background: `linear-gradient(135deg, ${story.statusColor}, #F97316)`,
                          boxShadow: isSelected
                            ? `0 0 0 3px ${story.statusColor}`
                            : "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      >
                        <img
                          src={story.image}
                          alt={story.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            objectFit: "cover",
                            display: "block",
                          }}
                          onError={(e) => {
                            e.target.src = "/images/Rayfield Resort.jpg";
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: "#0F172A",
                          maxWidth: "72px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {story.name}
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: "600",
                          color: story.statusColor,
                          backgroundColor: `${story.statusColor}15`,
                          padding: "2px 6px",
                          borderRadius: "8px",
                        }}
                      >
                        {story.vibeStatus}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Active Filter Notice */}
              {activeVibeFilter && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#F8FAFC",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    marginBottom: "16px",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <small style={{ color: "#334155", fontWeight: "600" }}>
                    🔍 Showing live vibe posts for:{" "}
                    <span style={{ color: "#F97316" }}>{activeVibeFilter}</span>
                  </small>
                  <button
                    onClick={() => setActiveVibeFilter(null)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#64748B",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    Clear Filter ✕
                  </button>
                </div>
              )}

              {/* Post Composer Box */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                  marginBottom: "24px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <textarea
                  value={postInput}
                  onChange={(e) => setPostInput(e.target.value)}
                  placeholder="Share what's happening around Jos (e.g., Rayfield, Shere Hills, Nightlife)..."
                  rows="3"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #CBD5E1",
                    fontSize: "14px",
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                    backgroundColor: "#F8FAFC",
                  }}
                />
                {feedPublishError && (
                  <p className={styles.feedActionError} role="alert">
                    {feedPublishError}
                  </p>
                )}

                {selectedFeedImage && (
                  <div
                    style={{
                      marginTop: "10px",
                      position: "relative",
                      width: "fit-content",
                    }}
                  >
                    <img
                      src={selectedFeedImage}
                      alt="Preview"
                      style={{
                        height: "80px",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      onClick={() => setSelectedFeedImage(null)}
                      style={{
                        position: "absolute",
                        top: "-6px",
                        right: "-6px",
                        background: "#EF4444",
                        color: "#FFF",
                        border: "none",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <div>
                    <input
                      type="file"
                      id="feedImageUpload"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) =>
                            setSelectedFeedImage(ev.target.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label
                      htmlFor="feedImageUpload"
                      style={{
                        fontSize: "13px",
                        color: "#F97316",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      📷 Add Photo
                    </label>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: "12px", color: "#64748B" }}>
                      📍 Tag: {activeVibeFilter || "Jos Central"}
                    </span>
                    <button
                      onClick={publishFeedPost}
                      disabled={feedPublishing}
                      style={{
                        backgroundColor: feedPublishing ? "#94A3B8" : "#F97316",
                        color: "#FFF",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        fontSize: "13px",
                        cursor: feedPublishing ? "wait" : "pointer",
                      }}
                    >
                      {feedPublishing ? "Saving..." : "Broadcast Live 🚀"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Feed Stream */}
              {feedLoadError && (
                <p className={styles.feedActionError} role="status">
                  {feedLoadError}
                </p>
              )}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {filteredFeedPosts.map((post) => (
                  <div
                    key={post.id}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "12px",
                      border: "1px solid #E2E8F0",
                      overflow: "hidden",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "14px 16px",
                        gap: "12px",
                      }}
                    >
                      <img
                        src={post.userAvatar}
                        alt={post.userName}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.src = "/images/John Doe.avif";
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4
                          style={{
                            margin: 0,
                            fontSize: "14px",
                            color: "#0F172A",
                            fontWeight: "700",
                          }}
                        >
                          {post.userName}
                        </h4>
                        <small style={{ color: "#64748B", fontSize: "11px" }}>
                          📍 {post.location} • {post.postTime}
                        </small>
                      </div>
                    </div>

                    {post.postText && (
                      <p
                        style={{
                          padding: "0 16px 12px 16px",
                          margin: 0,
                          fontSize: "14px",
                          color: "#334155",
                          lineHeight: "1.5",
                        }}
                      >
                        {post.postText}
                      </p>
                    )}

                    {post.postImage && (
                      <div
                        style={{
                          width: "100%",
                          maxHeight: "380px",
                          backgroundColor: "#F1F5F9",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={post.postImage}
                          alt="Post attachment"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    )}

                    {renderPostEngagement(post)}
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeNav === "Map" && (
            <section className={styles.panelSection}>
              <h2>🗺️ Plateau Interactive Map</h2>
              <div className={styles.mapContainerBox}>
                <MapContainer
                  center={[9.9285, 8.8921]}
                  zoom={12}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap"
                  />
                  {SPOTS_GEO.map((s) => (
                    <Marker
                      key={s.id}
                      position={[s.lat, s.lng]}
                      eventHandlers={{
                        click: () =>
                          logBehavior("VENUE_VIEW", {
                            placeId: s.id,
                            name: s.name,
                          }),
                      }}
                    >
                      <Popup>
                        <strong>{s.name}</strong>
                        <br />
                        {s.type} • {s.price}
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </section>
          )}

          {activeNav === "Saved" && (
            <section className={styles.panelSection}>
              <h2 className={styles.panelTitle}>🔖 Saved Spots & Stays</h2>
              {savedError && (
                <p className={styles.feedActionError} role="status">
                  {savedError}
                </p>
              )}
              {savedLoading ? (
                <p className={styles.loadingText}>
                  Loading your saved places...
                </p>
              ) : savedSpots.length === 0 ? (
                <p className={styles.emptyText}>
                  No saved spots or stays yet. Tap the heart on any place or
                  stay to save it here.
                </p>
              ) : (
                <div className={styles.savedGrid}>
                  {savedSpots.map((spot) => {
                    const spotId = spot._id || spot.id || spot.slug;
                    const imgSrc =
                      spot.heroImage ||
                      spot.coverImage ||
                      spot.image ||
                      (Array.isArray(spot.images) &&
                        (spot.images[0]?.url || spot.images[0])) ||
                      null;
                    const displayTitle =
                      spot.title || spot.name || "Untitled Venue";
                    const displaySub =
                      spot.category ||
                      spot.location ||
                      spot.neighborhood ||
                      "Jos Plateau";

                    return (
                      <div
                        key={spotId}
                        className={styles.savedCard}
                        onClick={() => {
                          navigate(
                            spot.category === "Stay" || spot.slug
                              ? `/stays/${spot.slug || spotId}`
                              : `/place/${spot.slug || spotId}`
                          );
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={displayTitle}
                            className={styles.savedCardImg}
                          />
                        ) : (
                          <div className={styles.savedCardImgPlaceholder}>
                            📍
                          </div>
                        )}
                        <div className={styles.savedCardOverlay} />
                        <div className={styles.savedCardBody}>
                          <span className={styles.savedCardTitle}>
                            {displayTitle}
                          </span>
                          {displaySub && (
                            <span className={styles.savedCardCategory}>
                              {displaySub}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          className={styles.savedCardRemoveBtn}
                          aria-label="Remove from saved"
                          title="Remove from saved"
                          onClick={(e) => {
                            e.stopPropagation();
                            try {
                              const localSaves = JSON.parse(
                                localStorage.getItem("jos_saved_stays") || "{}"
                              );
                              delete localSaves[spot.slug];
                              delete localSaves[spotId];
                              localStorage.setItem(
                                "jos_saved_stays",
                                JSON.stringify(localSaves)
                              );
                            } catch (err) {
                              console.warn(err);
                            }

                            toggleSaveSpot(spotId)
                              .catch(() => {})
                              .finally(() => {
                                setSavedSpots((prev) =>
                                  prev.filter(
                                    (s) => (s._id || s.id || s.slug) !== spotId
                                  )
                                );
                              });
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {activeNav === "Profile" && (
            <section className={styles.panelSection}>
              <h2 className={styles.panelTitle}>⚙️ Profile Settings</h2>
              {profileLoading ? (
                <p className={styles.loadingText}>Loading...</p>
              ) : (
                <form
                  onSubmit={handleProfileSave}
                  className={styles.profileForm}
                >
                  <div className={styles.profileAvatarRow}>
                    <div className={styles.profileAvatarWrap}>
                      {profileImagePreview ? (
                        <img
                          src={profileImagePreview}
                          alt="Profile"
                          className={styles.profileAvatarImg}
                        />
                      ) : (
                        <div className={styles.profileAvatarPlaceholder}>
                          👤
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        ref={profileImageInputRef}
                        style={{ display: "none" }}
                        onChange={handleProfileImageFile}
                      />
                      <button
                        type="button"
                        className={styles.uploadAvatarBtn}
                        onClick={() => profileImageInputRef.current?.click()}
                      >
                        📷 Upload Photo
                      </button>
                      <p className={styles.avatarHint}>
                        JPG, PNG or WEBP · Max 5MB
                      </p>
                    </div>
                  </div>

                  <div className={styles.profileField}>
                    <label className={styles.profileLabel}>First Name</label>
                    <input
                      type="text"
                      className={styles.profileInput}
                      value={profileData.firstName}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      placeholder="First name"
                    />
                  </div>

                  <div className={styles.profileField}>
                    <label className={styles.profileLabel}>Last Name</label>
                    <input
                      type="text"
                      className={styles.profileInput}
                      value={profileData.lastName}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      placeholder="Last name"
                    />
                  </div>

                  <div className={styles.profileField}>
                    <label className={styles.profileLabel}>Email</label>
                    <input
                      type="email"
                      className={styles.profileInput}
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="Email address"
                    />
                  </div>

                  {profileMsg && (
                    <p
                      className={
                        profileMsg.toLowerCase().includes("success")
                          ? styles.profileMsgSuccess
                          : styles.profileMsgError
                      }
                    >
                      {profileMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={profileSaving}
                    className={styles.primaryDarkBtn}
                  >
                    {profileSaving ? "Saving..." : "Save Profile"}
                  </button>
                </form>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}