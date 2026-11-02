import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

// Attach the auth token to every request. Booking and other protected
// endpoints require it, and this instance previously had no interceptor.
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("jos_pulse_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- PLACES & VENUE MANAGEMENT (Admin Dashboard) ---
export const fetchPlaces = async () => {
  const res = await api.get("/places");
  return res.data;
};

export const createPlace = async (formData) => {
  const res = await api.post("/places", formData, {
    headers: { "Content-Type": undefined } // Allows browser to correctly set multipart/form-data boundary
  });
  return res.data;
};

export const updatePlace = async (id, formData) => {
  const res = await api.put(`/places/${id}`, formData, {
    headers: { "Content-Type": undefined } // Allows browser to correctly set multipart/form-data boundary
  });
  return res.data;
};

export const deletePlace = async (id) => {
  const res = await api.delete(`/places/${id}`);
  return res.data;
};

// --- FLIGHTS & TRAVEL SERVICES (Existing) ---
export const fetchAirports = async () => {
  const res = await api.get("/flights/airports");
  return res.data;
};

export const fetchPublishedRoutes = async () => {
  const res = await api.get("/flights/routes/published");
  return res.data;
};

export const fetchAirportFlights = async (airportCode, direction = "arrivals") => {
  const res = await api.get(`/flights/airports/${airportCode}/flights?direction=${direction}`);
  return res.data;
};

export const createShuttleBooking = async (bookingData) => {
  const res = await api.post("/shuttles/bookings", bookingData);
  return res.data;
};

export const fetchAmenities = async () => {
  const res = await api.get("/amenities");
  return res.data;
};

export const submitConciergeEnquiry = async (enquiryData) => {
  const res = await api.post("/concierge/enquiries", enquiryData);
  return res.data;
};


// --- STAYS & ACCOMMODATIONS (Newly Added) ---

// Fetch published accommodations with optional category/search filters
export const fetchAccommodations = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const res = await api.get(`/accommodations?${params.toString()}`);
  return res.data;
};

// Fetch curated featured accommodations for Section 3
export const fetchFeaturedAccommodations = async () => {
  const res = await api.get("/accommodations/featured");
  return res.data;
};

// Fetch individual property details by slug
export const fetchAccommodationDetails = async (slug) => {
  const res = await api.get(`/accommodations/${encodeURIComponent(slug)}`);
  return res.data;
};

// Fetch Plateau geographic accommodation zones for Section 5
export const fetchAccommodationZones = async () => {
  const res = await api.get("/accommodation-zones");
  return res.data;
};

// Fetch Stays knowledge base FAQs for Section 7
export const fetchFAQs = async () => {
  const res = await api.get("/faqs");
  return res.data;
};

// Fetch Highland climate and travel guide content for Section 6
export const fetchTravelContent = async (slug) => {
  const res = await api.get(`/travel-content/${slug}`);
  return res.data;
};

// Create a secure stay reservation booking
export const createStayBooking = async (bookingData) => {
  const res = await api.post("/bookings", bookingData);
  return res.data;
};

// Post flight booking request to MongoDB
export async function createFlightBooking(bookingData) {
  try {
    const response = await fetch("http://localhost:5000/api/v1/flights/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating flight booking:", error);
    throw error;
  }
}

export default api;