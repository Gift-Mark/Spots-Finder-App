import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../Components/headerNav.jsx";
import Footer from "../Components/Footer.jsx";
import styles from "../CSS/StaysPage.module.css";

// Import all static stay data sources
import { JOS_HOTELS } from "../data/hotelsData.js";
import { JOS_LOUNGES } from "../data/loungesData.js";
import { JOS_STAYS_DIRECTORY } from "../data/accomodationData.js";

import BookingCheckoutModal from "../Components/BookingCheckoutModal.jsx";

import {
  toggleSaveSpot,
  checkIsSaved,
  fetchReviews,
  postReview,
  fetchStayReviews,
  postStayReview,
} from "../api/client.js";
import {
  createStayBooking,
  fetchAccommodationDetails,
} from "../services/api.js";

const SAVED_STAYS_KEY = "jos_saved_stays";
const LOCAL_REVIEWS_KEY = "jos_local_stay_reviews";
const MONGO_ID_PATTERN = /^[0-9a-fA-F]{24}$/;
const DAY_MS = 24 * 60 * 60 * 1000;

const isMongoId = (value) =>
  typeof value === "string" && MONGO_ID_PATTERN.test(value);

const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch (err) {
    console.warn(`Could not read ${key} from localStorage`, err);
    return fallback;
  }
};

const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Could not write ${key} to localStorage`, err);
  }
};

const getToken = () =>
  localStorage.getItem("token") || localStorage.getItem("jos_pulse_token");

const getStoredUser = () =>
  readJSON("user", null) || readJSON("jos_pulse_user", null);

const toImageUrl = (image) => {
  if (!image) return "";
  if (typeof image === "string") return image.trim();
  return image.url || image.src || "";
};

const uniqueImages = (images) => [...new Set(images.map(toImageUrl).filter(Boolean))];

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const toDateInput = (date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const parseDateInput = (value) => {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const calculateNights = (start, end) => {
  const startDate = parseDateInput(start);
  const endDate = parseDateInput(end);
  if (!startDate || !endDate) return 0;
  const diff = Math.round((endDate - startDate) / DAY_MS);
  return diff > 0 ? diff : 0;
};

const todayInput = () => toDateInput(new Date());
const defaultCheckIn = () => toDateInput(addDays(new Date(), 1));
const defaultCheckOut = () => toDateInput(addDays(new Date(), 3));

const formatNaira = (amount) =>
  `₦${Number(amount || 0).toLocaleString("en-NG")}`;

const formatRating = (rating) => {
  const value = Number(rating);
  return Number.isFinite(value) && value > 0 ? value.toFixed(1) : null;
};

// Build one lookup array. JOS_HOTELS is spread first so its entries (which
// include roomTypes) win over the duplicated ids in JOS_STAYS_DIRECTORY.
const buildStaticStays = () => {
  const directory = JOS_STAYS_DIRECTORY || {};
  const allStays = [
    ...JOS_HOTELS,
    ...(Array.isArray(JOS_LOUNGES) ? JOS_LOUNGES : []),
    ...(directory.traditionalHotels || []),
    ...(directory.boutiqueResorts || []),
    ...(directory.servicedApartments || []),
    ...(directory.guestHouses || []),
  ];

  const byKey = new Map();
  allStays.forEach((stay) => {
    const key = String(stay.slug || stay.id || stay._id || stay.name || "").toLowerCase();
    if (!key || byKey.has(key)) return;
    byKey.set(key, stay);
  });

  return Array.from(byKey.values());
};

const ALL_STATIC_STAYS = buildStaticStays();

const findStaticStay = (slug) => {
  const target = String(slug || "").toLowerCase();
  if (!target) return null;

  return (
    ALL_STATIC_STAYS.find((stay) =>
      [stay.id, stay._id, stay.slug]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase() === target)
    ) ||
    ALL_STATIC_STAYS.find((stay) => slugify(stay.name) === target) ||
    null
  );
};

const normaliseRoomTypes = (roomTypes) =>
  (Array.isArray(roomTypes) ? roomTypes : [])
    .map((room) => ({
      type: room.type || room.name || "Room",
      price: Number(room.price ?? room.nightlyRate),
    }))
    .filter((room) => Number.isFinite(room.price) && room.price > 0);

const buildStaticProperty = (stay) => {
  const name = stay.name || stay.title || "Jos Highland Stay";
  const startingFare = Number(
    stay.pricePerNight ?? stay.price ?? stay.startingFare
  );
  const rating = Number(stay.starRating ?? stay.rating);

  return {
    _id: stay._id || stay.id || stay.slug || slugify(name),
    id: stay._id || stay.id || stay.slug || slugify(name),
    slug: stay.slug || stay.id || slugify(name),
    name,
    neighborhood: stay.neighborhood || stay.location || "Jos, Plateau State",
    address:
      stay.address ||
      `${stay.neighborhood || "Jos, Plateau State"}, Plateau State`,
    description:
      stay.description ||
      [
        stay.vibe,
        stay.openingHours ? `Open ${stay.openingHours}.` : "",
      ]
        .filter(Boolean)
        .join(" ") ||
      `${name} is listed in ${stay.neighborhood || "Jos, Plateau State"}. Contact the property directly for full details on rooms and facilities.`,
    startingFare:
      Number.isFinite(startingFare) && startingFare > 0 ? startingFare : 0,
    rating: Number.isFinite(rating) && rating > 0 ? rating : 0,
    amenities: (
      Array.isArray(stay.amenities)
        ? stay.amenities
        : Array.isArray(stay.popularFor)
          ? stay.popularFor
          : []
    ).filter(Boolean),
    images: uniqueImages([
      stay.image,
      stay.heroImage,
      ...(Array.isArray(stay.gallery) ? stay.gallery : []),
    ]),
    phone: stay.phone || "",
    roomTypes: normaliseRoomTypes(stay.roomTypes),
    checkInTime: stay.checkInTime || "",
    verificationStatus: "Verified",
    isVerified: true,
  };
};

const normaliseApiProperty = (raw) => {
  const doc = raw?.accommodation || raw?.property || raw?.stay || raw;

  if (!doc || typeof doc !== "object") return null;
  if (!doc.name && !doc.title) return null;

  const name = doc.name || doc.title;
  const startingFare = Number(
    doc.startingFare ?? doc.pricePerNight ?? doc.price ?? doc.startingPrice
  );
  const rating = Number(doc.rating ?? doc.starRating);
  const verificationStatus = doc.verificationStatus || "Verified";

  return {
    _id: doc._id || doc.id || doc.slug || slugify(name),
    id: doc._id || doc.id || doc.slug || slugify(name),
    slug: doc.slug || slugify(name),
    name,
    neighborhood:
      doc.neighborhood || doc.zone?.name || "Jos, Plateau State",
    address: doc.address || `${doc.neighborhood || "Jos"}, Plateau State`,
    description: doc.description || "",
    startingFare:
      Number.isFinite(startingFare) && startingFare > 0 ? startingFare : 0,
    rating: Number.isFinite(rating) && rating > 0 ? rating : 0,
    amenities: (Array.isArray(doc.amenities) ? doc.amenities : []).filter(Boolean),
    images: uniqueImages([
      ...(Array.isArray(doc.images) ? doc.images : []),
      doc.image,
      doc.heroImage,
    ]),
    phone: doc.phone || "",
    roomTypes: normaliseRoomTypes(doc.roomTypes),
    checkInTime: doc.checkInTime || "",
    verificationStatus,
    isVerified: verificationStatus === "Verified",
  };
};

const buildSavedEntry = (property, rate) => ({
  _id: property._id,
  slug: property.slug,
  name: property.name,
  title: property.name,
  location: property.neighborhood,
  address: property.address,
  image: property.images?.[0] || "",
  heroImage: property.images?.[0] || "",
  price: Number(rate) || property.startingFare || 0,
  category: "Stay",
  rating: property.rating || 0,
});

const persistSavedState = (property, rate, saved) => {
  const localSaves = readJSON(SAVED_STAYS_KEY, {});

  if (saved) {
    localSaves[property.slug] = buildSavedEntry(property, rate);
  } else {
    delete localSaves[property.slug];
    delete localSaves[property._id];
  }

  writeJSON(SAVED_STAYS_KEY, localSaves);
};

const reviewAuthor = (review) => {
  const account = review?.userId && typeof review.userId === "object"
    ? review.userId
    : null;
  const fullName = [account?.firstName, account?.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    fullName ||
    account?.name ||
    review?.guestName ||
    review?.author ||
    review?.user?.name ||
    "Jos Visitor"
  );
};

const reviewTimestamp = (review) => {
  const value = new Date(review?.createdAt || 0).getTime();
  return Number.isNaN(value) ? 0 : value;
};

const mergeReviews = (serverReviews = [], localReviews = []) => {
  const seen = new Set();
  return [...serverReviews, ...localReviews]
    .filter((review) => {
      if (!review) return false;
      const key =
        review._id || `${review.createdAt || ""}|${review.comment || ""}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => reviewTimestamp(b) - reviewTimestamp(a));
};

const extractReviews = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
};

export default function StaysDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Like / Save State
  const [isSaved, setIsSaved] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Tab State ("about" or "amenities")
  const [activeTab, setActiveTab] = useState("about");

  // Booking Form State
  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);

  const [selectedRate, setSelectedRate] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [pendingBookingData, setPendingBookingData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const resolveSavedState = async (stay) => {
      const targetId = stay._id;
      const localSaves = readJSON(SAVED_STAYS_KEY, {});
      let saved = Boolean(localSaves[stay.slug] || localSaves[targetId]);

      if (isMongoId(targetId) && getToken()) {
        try {
          const response = await checkIsSaved(targetId);
          if (cancelled) return;

          const serverSaved =
            typeof response === "boolean" ? response : response?.isSaved;

          if (typeof serverSaved === "boolean") {
            saved = serverSaved;
            persistSavedState(stay, stay.startingFare, serverSaved);
          }
        } catch (err) {
          console.warn("Could not fetch saved state from the API:", err);
        }
      }

      if (!cancelled) setIsSaved(saved);
    };

    const loadReviews = async (stay) => {
      const localReviews = isMongoId(stay._id)
        ? []
        : readJSON(LOCAL_REVIEWS_KEY, {})[stay.slug] || [];

      let serverReviews = [];

      try {
        const response = isMongoId(stay._id)
          ? await fetchReviews(stay._id)
          : await fetchStayReviews(stay.slug);
        serverReviews = extractReviews(response);
      } catch (err) {
        console.warn("Could not fetch reviews:", err);
      }

      if (cancelled) return;
      setReviews(mergeReviews(serverReviews, localReviews));
    };

    const loadDetails = async () => {
      setLoading(true);
      setError(null);
      setProperty(null);
      setReviews([]);
      setBookingSuccess(null);
      setNewComment("");
      setNewRating(5);
      setActiveTab("about");
      setIsSaved(false);

      let stay = null;

      // 1. Try the API first
      try {
        const response = await fetchAccommodationDetails(slug);
        if (response?.success && response.data) {
          stay = normaliseApiProperty(response.data);
        }
      } catch (apiErr) {
        console.warn(
          "API accommodation fetch failed, using static dataset:",
          apiErr
        );
      }

      if (cancelled) return;

      // 2. Fall back to the bundled static dataset
      if (!stay) {
        const staticStay = findStaticStay(slug);
        if (staticStay) stay = buildStaticProperty(staticStay);
      }

      // 3. Never invent a property for an unknown slug
      if (!stay) {
        setProperty(null);
        setError(
          "We couldn't find that stay. It may have been removed, or the link is incorrect."
        );
        setLoading(false);
        return;
      }

      setProperty(stay);
      setSelectedRate(stay.roomTypes[0]?.price || stay.startingFare || 0);
      setLoading(false);

      await Promise.all([resolveSavedState(stay), loadReviews(stay)]);
    };

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleToggleSave = async () => {
    if (!getToken()) {
      alert("Please log in to save properties to your favorites.");
      navigate("/login", {
        state: { redirectTo: `${window.location.pathname}${window.location.search}` },
      });
      return;
    }

    if (!property) return;

    const targetId = property._id;
    const previousState = isSaved;
    const nextState = !isSaved;

    setIsSaved(nextState);
    persistSavedState(property, selectedRate, nextState);

    // Static stays only exist in this browser, so local storage is the store.
    if (!isMongoId(targetId)) return;

    setSavingLoading(true);
    try {
      const response = await toggleSaveSpot(targetId);
      if (typeof response?.isSaved === "boolean") {
        setIsSaved(response.isSaved);
        persistSavedState(property, selectedRate, response.isSaved);
      }
    } catch (err) {
      console.warn("Backend toggle save failed, reverting:", err);
      setIsSaved(previousState);
      persistSavedState(property, selectedRate, previousState);
      alert("Could not update your saved stays. Please try again.");
    } finally {
      setSavingLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!getToken()) {
      navigate("/login", {
        state: { redirectTo: `${window.location.pathname}${window.location.search}` },
      });
      return;
    }

    const comment = newComment.trim();
    if (!comment || !property) return;

    const user = getStoredUser();
    const guestName = [user?.firstName, user?.lastName]
      .filter(Boolean)
      .join(" ");
    const payload = {
      rating: Number(newRating),
      comment,
      ...(guestName ? { guestName } : {}),
    };

    setReviewSubmitting(true);

    try {
      if (isMongoId(property._id)) {
        await postReview(property._id, payload);
        const response = await fetchReviews(property._id);
        setReviews(extractReviews(response));
      } else {
        await postStayReview(property.slug, payload);
        const response = await fetchStayReviews(property.slug);
        const localReviews = readJSON(LOCAL_REVIEWS_KEY, {})[property.slug] || [];
        setReviews(mergeReviews(extractReviews(response), localReviews));
      }

      setNewComment("");
      alert("Review posted successfully!");
    } catch (err) {
      // The API may be unreachable. Keep static-stay reviews on this device
      // instead of silently losing them.
      if (!isMongoId(property._id)) {
        const allLocalReviews = readJSON(LOCAL_REVIEWS_KEY, {});
        const localReview = {
          ...payload,
          _id: `local-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        allLocalReviews[property.slug] = [
          localReview,
          ...(allLocalReviews[property.slug] || []),
        ];
        writeJSON(LOCAL_REVIEWS_KEY, allLocalReviews);
        setReviews((previous) =>
          mergeReviews(allLocalReviews[property.slug], previous)
        );
        setNewComment("");
        alert(
          "Review saved on this device. It will be shared once the server is reachable."
        );
      } else {
        alert(err.response?.data?.message || "Failed to post review.");
      }
    } finally {
      setReviewSubmitting(false);
    }
  };

  const nights = calculateNights(checkIn, checkOut);
  const basePrice = selectedRate || property?.startingFare || 0;
  const totalAmount = basePrice * nights * rooms;
  const minCheckOut = checkIn
    ? toDateInput(addDays(parseDateInput(checkIn) || new Date(), 1))
    : toDateInput(addDays(new Date(), 1));

  const handleCheckInChange = (event) => {
    const value = event.target.value;
    setCheckIn(value);

    if (value && (!checkOut || checkOut <= value)) {
      setCheckOut(toDateInput(addDays(parseDateInput(value) || new Date(), 1)));
    }
  };

  const handleBookingSubmit = (event) => {
    event.preventDefault();

    if (!getToken()) {
      alert("Please log in to reserve a stay.");
      navigate("/login", {
        state: { redirectTo: `${window.location.pathname}${window.location.search}` },
      });
      return;
    }

    if (!property || nights <= 0) {
      alert("Please choose a check-out date after your check-in date.");
      return;
    }

    if (!Number.isFinite(basePrice) || basePrice <= 0) {
      alert("This property does not have a bookable rate yet.");
      return;
    }

    setBookingSuccess(null);
    setPendingBookingData({
      propertyId: isMongoId(property._id) ? property._id : null,
      propertySlug: property.slug,
      propertyName: property.name,
      neighborhood: property.neighborhood,
      checkIn,
      checkOut,
      nights,
      adults,
      rooms,
      basePrice,
      totalAmount,
    });
    setIsCheckoutModalOpen(true);
  };

  const handleConfirmBooking = async (checkoutData) => {
    if (!pendingBookingData) return;

    setSubmitting(true);

    try {
      const response = await createStayBooking({
        propertyId: pendingBookingData.propertyId,
        propertySlug: pendingBookingData.propertySlug,
        propertyName: pendingBookingData.propertyName,
        neighborhood: pendingBookingData.neighborhood,
        checkIn: pendingBookingData.checkIn,
        checkOut: pendingBookingData.checkOut,
        nights: pendingBookingData.nights,
        adults: pendingBookingData.adults,
        rooms: pendingBookingData.rooms,
        nightlyRate: pendingBookingData.basePrice,
        totalAmount: checkoutData.grandTotal,
        paymentMethod: checkoutData.paymentMethod,
      });

      if (!response?.success || !response.data) {
        throw new Error(response?.message || "Failed to complete reservation.");
      }

      setBookingSuccess(response.data);
      setIsCheckoutModalOpen(false);
      setPendingBookingData(null);
      alert(`Reservation received! Reference: ${response.data.bookingReference}`);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to complete reservation."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.staysPageContainer}>
        <Header />
        <div
          style={{
            textAlign: "center",
            padding: "6rem",
            fontSize: "1.1rem",
            color: "#64748b",
            fontWeight: "600",
          }}
        >
          Loading sanctuary details...
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className={styles.staysPageContainer}>
        <Header />
        <div style={{ textAlign: "center", padding: "6rem 1.5rem" }}>
          <h2 style={{ color: "#0b132b", marginBottom: "1rem" }}>
            {error || "Property Not Found"}
          </h2>
          <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
            Browse our verified Plateau stays to find another option.
          </p>
          <button
            type="button"
            onClick={() => navigate("/stays")}
            className={styles.searchSubmitBtn}
          >
            ← Return to Stays Portal
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const heroBg = property.images[0] || "";
  const heroBackground = heroBg
    ? `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.75)), url("${heroBg.replace(/"/g, "%22")}")`
    : "linear-gradient(to bottom, rgba(0,0,0,0.65), rgba(0,0,0,0.9))";
  const galleryImages = property.images.slice(1, 3);
  const roomTypes = property.roomTypes;

  return (
    <div
      className={styles.staysPageContainer}
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
        paddingBottom: "4rem",
      }}
    >
      <Header />

      <main className={styles.stayDetailMain}>
        {/* 1. DARK HERO BANNER */}
        <div
          className={styles.stayDetailHero}
          style={{
            backgroundImage: heroBackground,
            backgroundColor: "#0b132b",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "3rem",
            }}
          >
            <Link
              to="/stays"
              style={{
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(6px)",
                color: "#fff",
                padding: "0.5rem 1rem",
                borderRadius: "2rem",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "0.85rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              ← Back to Stays
            </Link>

            <button
              type="button"
              onClick={handleToggleSave}
              disabled={savingLoading}
              aria-label={
                isSaved ? "Remove from saved stays" : "Save this stay"
              }
              aria-pressed={isSaved}
              title={isSaved ? "Remove from saved stays" : "Save this stay"}
              style={{
                background: "rgba(255,255,255,0.9)",
                border: "none",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                cursor: savingLoading ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                transition: "transform 0.2s ease",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill={isSaved ? "#f43f5e" : "none"}
                stroke={isSaved ? "#f43f5e" : "#1e293b"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>

          <div style={{ maxWidth: "800px" }}>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                marginBottom: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  background: "#f97316",
                  color: "#fff",
                  padding: "3px 10px",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                }}
              >
                Stay
              </span>
              {property.isVerified && (
                <span
                  style={{
                    background: "rgba(22, 163, 74, 0.85)",
                    color: "#fff",
                    padding: "3px 10px",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                  }}
                >
                  ✓ {property.verificationStatus || "Verified Venue"}
                </span>
              )}
            </div>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: "800",
                margin: "0 0 0.5rem 0",
                lineHeight: "1.2",
              }}
            >
              {property.name}
            </h1>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                fontSize: "0.95rem",
                color: "#e2e8f0",
                alignItems: "center",
                marginBottom: "0.75rem",
              }}
            >
              <span>
                {formatRating(property.rating)
                  ? `⭐ ${formatRating(property.rating)}`
                  : "☆ No guest rating yet"}{" "}
                ({reviews.length} review{reviews.length === 1 ? "" : "s"})
              </span>
              <span>•</span>
              <span>{property.neighborhood}</span>
            </div>
            <p style={{ color: "#cbd5e1", fontSize: "0.9rem", margin: 0 }}>
              📍 {property.address}
            </p>
          </div>
        </div>

        {/* 2. AMENITIES PILLS ROW */}
        {property.amenities.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              marginBottom: "1.5rem",
            }}
          >
            {property.amenities.map((amenity, idx) => (
              <span
                key={`${amenity}-${idx}`}
                style={{
                  background: "#fff",
                  border: "1px solid #cbd5e1",
                  color: "#334155",
                  padding: "6px 14px",
                  borderRadius: "2rem",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                }}
              >
                {amenity}
              </span>
            ))}
          </div>
        )}

        {/* 3. QUICK INFO GRID */}
        <div className={styles.stayDetailQuickInfoGrid}>
          <div
            style={{
              background: "#fff",
              padding: "1.25rem",
              borderRadius: "0.75rem",
              border: "1px solid #e2e8f0",
            }}
          >
            <small
              style={{
                color: "#64748b",
                fontWeight: "700",
                textTransform: "uppercase",
                fontSize: "0.7rem",
              }}
            >
              Check-In Policy
            </small>
            <div style={{ fontWeight: "700", color: "#0b132b", marginTop: "0.25rem" }}>
              {property.checkInTime
                ? `${property.checkInTime} Onward`
                : "Contact property"}
            </div>
          </div>
          <div
            style={{
              background: "#fff",
              padding: "1.25rem",
              borderRadius: "0.75rem",
              border: "1px solid #e2e8f0",
            }}
          >
            <small
              style={{
                color: "#64748b",
                fontWeight: "700",
                textTransform: "uppercase",
                fontSize: "0.7rem",
              }}
            >
              Starting Rate
            </small>
            <div style={{ fontWeight: "700", color: "#f97316", marginTop: "0.25rem" }}>
              {basePrice > 0 ? `${formatNaira(basePrice)} / night` : "Contact property"}
            </div>
          </div>
          <div
            style={{
              background: "#fff",
              padding: "1.25rem",
              borderRadius: "0.75rem",
              border: "1px solid #e2e8f0",
            }}
          >
            <small
              style={{
                color: "#64748b",
                fontWeight: "700",
                textTransform: "uppercase",
                fontSize: "0.7rem",
              }}
            >
              Direct Hotline
            </small>
            <div style={{ fontWeight: "700", color: "#0b132b", marginTop: "0.25rem" }}>
              {property.phone || "Available at reception"}
            </div>
          </div>
        </div>

        {/* 4. TABS ROW */}
        <div
          role="tablist"
          aria-label="Property details"
          style={{
            display: "flex",
            gap: "2rem",
            borderBottom: "2px solid #e2e8f0",
            marginBottom: "2rem",
          }}
        >
          <button
            type="button"
            role="tab"
            id="about-tab"
            aria-selected={activeTab === "about"}
            aria-controls="about-panel"
            onClick={() => setActiveTab("about")}
            style={{
              background: "none",
              border: "none",
              fontSize: "1rem",
              fontWeight: "700",
              paddingBottom: "0.75rem",
              cursor: "pointer",
              color: activeTab === "about" ? "#f97316" : "#64748b",
              borderBottom:
                activeTab === "about" ? "2px solid #f97316" : "none",
              marginBottom: "-2px",
            }}
          >
            About the Spot
          </button>
          <button
            type="button"
            role="tab"
            id="amenities-tab"
            aria-selected={activeTab === "amenities"}
            aria-controls="amenities-panel"
            onClick={() => setActiveTab("amenities")}
            style={{
              background: "none",
              border: "none",
              fontSize: "1rem",
              fontWeight: "700",
              paddingBottom: "0.75rem",
              cursor: "pointer",
              color: activeTab === "amenities" ? "#f97316" : "#64748b",
              borderBottom:
                activeTab === "amenities" ? "2px solid #f97316" : "none",
              marginBottom: "-2px",
            }}
          >
            Highlights & Amenities
          </button>
        </div>

        {/* 5. MAIN CONTENT & SIDEBAR GRID */}
        <div className={styles.stayDetailContentGrid}>
          {/* Left Column */}
          <div>
            {activeTab === "about" ? (
              <div
                id="about-panel"
                role="tabpanel"
                aria-labelledby="about-tab"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "1rem",
                  padding: "2.25rem",
                  marginBottom: "2rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "800",
                    color: "#0b132b",
                    marginBottom: "1rem",
                  }}
                >
                  About {property.name}
                </h2>
                <p
                  style={{
                    color: "#475569",
                    lineHeight: "1.8",
                    fontSize: "1rem",
                    margin: "0 0 1.5rem 0",
                  }}
                >
                  {property.description ||
                    "Detailed property information is being updated. Contact the property directly for full details."}
                </p>

                {galleryImages.length > 0 && (
                  <div
                    className={styles.stayDetailGalleryGrid}
                    style={{
                      gridTemplateColumns:
                        galleryImages.length > 1 ? "1fr 1fr" : "1fr",
                    }}
                  >
                    {galleryImages.map((image, idx) => (
                      <img
                        key={`${image}-${idx}`}
                        src={image}
                        alt={`${property.name} photo ${idx + 2}`}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "180px",
                          objectFit: "cover",
                          borderRadius: "0.75rem",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div
                id="amenities-panel"
                role="tabpanel"
                aria-labelledby="amenities-tab"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "1rem",
                  padding: "2.25rem",
                  marginBottom: "2rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "800",
                    color: "#0b132b",
                    marginBottom: "0.5rem",
                  }}
                >
                  Highlights & Featured Amenities
                </h2>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "0.9rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  Key facilities, experience add-ons, and visitor comforts available at {property.name}:
                </p>

                {property.amenities.length === 0 ? (
                  <p style={{ color: "#64748b", fontStyle: "italic" }}>
                    Amenity details have not been provided for this property yet.
                  </p>
                ) : (
                  <div className={styles.stayDetailAmenitiesGrid}>
                    {property.amenities.map((amenity, idx) => (
                      <div
                        key={`${amenity}-${idx}`}
                        style={{
                          background: "#fff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "0.75rem",
                          padding: "1.25rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                        }}
                      >
                        <span style={{ fontSize: "1.5rem" }} aria-hidden="true">
                          ✨
                        </span>
                        <div
                          style={{
                            fontWeight: "700",
                            color: "#0b132b",
                            fontSize: "0.95rem",
                          }}
                        >
                          {amenity}
                        </div>
                        <div
                          style={{
                            color: "#64748b",
                            fontSize: "0.8rem",
                            lineHeight: "1.4",
                          }}
                        >
                          Listed by the property for guest use.
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* REVIEWS SECTION */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "1rem",
                padding: "2.25rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
              }}
            >
              <h3
                style={{
                  fontSize: "1.35rem",
                  fontWeight: "800",
                  color: "#0b132b",
                  marginBottom: "1.5rem",
                }}
              >
                Guest Reviews & Ratings ({reviews.length})
              </h3>

              <form
                onSubmit={handleReviewSubmit}
                style={{
                  marginBottom: "2rem",
                  background: "#f8fafc",
                  padding: "1.25rem",
                  borderRadius: "0.75rem",
                  border: "1px solid #e2e8f0",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 0.75rem 0",
                    fontSize: "0.95rem",
                    color: "#1e293b",
                  }}
                >
                  Leave your rating & comment
                </h4>

                <div style={{ marginBottom: "0.75rem" }}>
                  <label
                    htmlFor="review-rating"
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      fontWeight: "700",
                      color: "#475569",
                      marginBottom: "0.3rem",
                    }}
                  >
                    Rating
                  </label>
                  <select
                    id="review-rating"
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #cbd5e1",
                      background: "#fff",
                      fontWeight: "600",
                    }}
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5 - Exceptional)</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5 - Great)</option>
                    <option value={3}>⭐⭐⭐ (3/5 - Good)</option>
                    <option value={2}>⭐⭐ (2/5 - Fair)</option>
                    <option value={1}>⭐ (1/5 - Poor)</option>
                  </select>
                </div>

                <div style={{ marginBottom: "0.75rem" }}>
                  <label
                    htmlFor="review-comment"
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      fontWeight: "700",
                      color: "#475569",
                      marginBottom: "0.3rem",
                    }}
                  >
                    Comment
                  </label>
                  <textarea
                    id="review-comment"
                    rows="3"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your experience..."
                    required
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #cbd5e1",
                      background: "#fff",
                      fontSize: "0.9rem",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  style={{
                    background: "#0b132b",
                    color: "#fff",
                    border: "none",
                    padding: "0.6rem 1.25rem",
                    borderRadius: "0.5rem",
                    fontWeight: "700",
                    fontSize: "0.85rem",
                    cursor: reviewSubmitting ? "wait" : "pointer",
                  }}
                >
                  {reviewSubmitting ? "Posting..." : "Submit Review →"}
                </button>
              </form>

              {reviews.length === 0 ? (
                <p
                  style={{
                    color: "#64748b",
                    fontStyle: "italic",
                    fontSize: "0.9rem",
                  }}
                >
                  No reviews yet. Be the first guest to leave feedback!
                </p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  {reviews.map((review, index) => {
                    const stars = Math.max(
                      1,
                      Math.min(5, Math.round(Number(review.rating) || 5))
                    );
                    const createdAt = new Date(review.createdAt || 0);

                    return (
                      <div
                        key={review._id || `${review.createdAt || "review"}-${index}`}
                        style={{
                          padding: "1rem",
                          borderRadius: "0.75rem",
                          border: "1px solid #e2e8f0",
                          background: "#fff",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "0.35rem",
                            gap: "1rem",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: "700",
                              color: "#0b132b",
                              fontSize: "0.9rem",
                            }}
                          >
                            {reviewAuthor(review)}
                          </span>
                          <span
                            style={{ color: "#f59e0b", fontSize: "0.85rem" }}
                            aria-label={`${stars} out of 5 stars`}
                          >
                            {"⭐".repeat(stars)}
                          </span>
                        </div>
                        <p
                          style={{
                            color: "#475569",
                            fontSize: "0.85rem",
                            margin: 0,
                          }}
                        >
                          {review.comment || review.text}
                        </p>
                        {!Number.isNaN(createdAt.getTime()) &&
                          createdAt.getTime() > 0 && (
                            <small
                              style={{
                                display: "block",
                                color: "#94a3b8",
                                fontSize: "0.75rem",
                                marginTop: "0.4rem",
                              }}
                            >
                              {createdAt.toLocaleDateString("en-NG", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </small>
                          )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Reservation Sidebar */}
          <aside
            className={styles.stayDetailSidebar}
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "1rem",
              padding: "2rem",
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: "1.25rem",
                borderBottom: "1px solid #f1f5f9",
                paddingBottom: "1rem",
                gap: "1rem",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "800",
                    color: "#0b132b",
                  }}
                >
                  {basePrice > 0 ? formatNaira(basePrice) : "Contact property"}
                </span>
                {basePrice > 0 && (
                  <span
                    style={{
                      color: "#64748b",
                      fontSize: "0.8rem",
                      marginLeft: "4px",
                    }}
                  >
                    / night
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: basePrice > 0 ? "#16a34a" : "#b45309",
                  fontWeight: "700",
                  background: basePrice > 0 ? "#dcfce7" : "#fef3c7",
                  padding: "3px 8px",
                  borderRadius: "20px",
                }}
              >
                {basePrice > 0 ? "Request to Book" : "Rates on Request"}
              </span>
            </div>

            <form
              onSubmit={handleBookingSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {roomTypes.length > 0 && (
                <div className={styles.searchField}>
                  <label
                    htmlFor="room-category"
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: "700",
                      color: "#475569",
                      marginBottom: "0.3rem",
                      display: "block",
                    }}
                  >
                    Select Room Category
                  </label>
                  <select
                    id="room-category"
                    onChange={(e) => setSelectedRate(Number(e.target.value))}
                    value={selectedRate}
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #cbd5e1",
                      fontWeight: "600",
                    }}
                  >
                    {roomTypes.map((room, idx) => (
                      <option key={`${room.type}-${idx}`} value={room.price}>
                        {room.type} - {formatNaira(room.price)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <label
                    htmlFor="check-in-date"
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: "700",
                      color: "#475569",
                      marginBottom: "0.3rem",
                      display: "block",
                    }}
                  >
                    Check-in
                  </label>
                  <input
                    id="check-in-date"
                    type="date"
                    value={checkIn}
                    min={todayInput()}
                    onChange={handleCheckInChange}
                    required
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "0.4rem",
                      border: "1px solid #cbd5e1",
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="check-out-date"
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: "700",
                      color: "#475569",
                      marginBottom: "0.3rem",
                      display: "block",
                    }}
                  >
                    Check-out
                  </label>
                  <input
                    id="check-out-date"
                    type="date"
                    value={checkOut}
                    min={minCheckOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "0.4rem",
                      border: "1px solid #cbd5e1",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <label
                    htmlFor="adults-select"
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: "700",
                      color: "#475569",
                      marginBottom: "0.3rem",
                      display: "block",
                    }}
                  >
                    Adults
                  </label>
                  <select
                    id="adults-select"
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "0.4rem",
                      border: "1px solid #cbd5e1",
                    }}
                  >
                    <option value={1}>1 Adult</option>
                    <option value={2}>2 Adults</option>
                    <option value={3}>3 Adults</option>
                    <option value={4}>4 Adults</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="rooms-select"
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: "700",
                      color: "#475569",
                      marginBottom: "0.3rem",
                      display: "block",
                    }}
                  >
                    Rooms
                  </label>
                  <select
                    id="rooms-select"
                    value={rooms}
                    onChange={(e) => setRooms(Number(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "0.4rem",
                      border: "1px solid #cbd5e1",
                    }}
                  >
                    <option value={1}>1 Room</option>
                    <option value={2}>2 Rooms</option>
                    <option value={3}>3 Rooms</option>
                  </select>
                </div>
              </div>

              {basePrice > 0 ? (
                <div
                  style={{
                    background: "#f8fafc",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #e2e8f0",
                    fontSize: "0.85rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.4rem",
                      color: "#64748b",
                      gap: "1rem",
                    }}
                  >
                    <span>
                      {formatNaira(basePrice)} × {nights} night
                      {nights === 1 ? "" : "s"} ({rooms} room
                      {rooms === 1 ? "" : "s"})
                    </span>
                    <span>{formatNaira(totalAmount)}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "800",
                      color: "#0b132b",
                      borderTop: "1px solid #cbd5e1",
                      paddingTop: "0.5rem",
                      marginTop: "0.4rem",
                      gap: "1rem",
                    }}
                  >
                    <span>Estimated Total</span>
                    <span style={{ color: "#f97316" }}>
                      {formatNaira(totalAmount)}
                    </span>
                  </div>
                  <small
                    style={{
                      display: "block",
                      color: "#94a3b8",
                      marginTop: "0.5rem",
                    }}
                  >
                    A 5% platform service fee is added at checkout.
                  </small>
                </div>
              ) : (
                <div
                  style={{
                    background: "#f8fafc",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #e2e8f0",
                    fontSize: "0.85rem",
                    color: "#475569",
                    lineHeight: "1.5",
                  }}
                >
                  <strong style={{ color: "#0b132b" }}>
                    Rates available on request.
                  </strong>{" "}
                  This stay has not published a nightly rate yet. Contact the
                  property directly to confirm pricing and availability.
                </div>
              )}

              {nights <= 0 && (
                <p
                  style={{
                    margin: 0,
                    color: "#b91c1c",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                  }}
                >
                  Check-out must be after check-in.
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || nights <= 0 || basePrice <= 0}
                style={{
                  background: "#f97316",
                  color: "#fff",
                  border: "none",
                  padding: "0.9rem",
                  borderRadius: "0.5rem",
                  fontWeight: "700",
                  fontSize: "0.95rem",
                  cursor:
                    submitting || nights <= 0 || basePrice <= 0
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    submitting || nights <= 0 || basePrice <= 0 ? 0.6 : 1,
                  width: "100%",
                  textAlign: "center",
                }}
              >
                {submitting
                  ? "Processing..."
                  : basePrice > 0
                    ? "Reserve Your Stay"
                    : "Rates on Request"}
              </button>

              {bookingSuccess && (
                <div
                  style={{
                    background: "#dcfce7",
                    color: "#166534",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.8rem",
                    textAlign: "center",
                  }}
                >
                  <strong>Reservation received!</strong> Ref:{" "}
                  <code>{bookingSuccess.bookingReference}</code>
                  <div style={{ marginTop: "0.35rem" }}>
                    The property will confirm availability shortly.
                  </div>
                </div>
              )}
            </form>
          </aside>
        </div>
      </main>

      <BookingCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => {
          if (submitting) return;
          setIsCheckoutModalOpen(false);
          setPendingBookingData(null);
        }}
        bookingData={pendingBookingData}
        onConfirmBooking={handleConfirmBooking}
      />

      <Footer />
    </div>
  );
}
