import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create an Axios instance with automatic Auth Header insertion
const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('jos_pulse_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- PLACES API ---
export const fetchPlaces = async (params = {}) => {
  const response = await api.get('/places', { params });
  return response.data;
};

export const fetchPlaceBySlug = async (slug) => {
  const response = await api.get(`/places/${slug}`);
  return response.data;
};

// --- BOOKINGS API ---
export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const fetchMyBookings = async () => {
  const response = await api.get('/bookings/my-bookings');
  return response.data;
};

// --- EVENTS API ---
export const fetchEvents = async (params = {}) => {
  const response = await api.get('/events', { params });
  return response.data;
};

export const fetchEventByIdentifier = async (identifier) => {
  const response = await api.get(`/events/${identifier}`);
  return response.data;
};

// --- CHECK-INS API ---
export const createCheckIn = async (checkInData) => {
  const response = await api.post('/checkins', checkInData);
  return response.data;
};

// --- NEWSLETTER API ---
export const subscribeNewsletter = async (name, email) => {
  const response = await api.post('/newsletter/subscribe', { name, email });
  return response.data;
};

// --- AUTH API ---
export const registerUser = async (user) => {
  const response = await api.post('/auth/register', user);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerVenueClaim = async (claimFormData) => {
  const response = await api.post('/claims/register', claimFormData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// --- AI & BEHAVIOR LOGS ---
export const askWebsiteSupport = async (prompt, sessionId, pagePath) => {
  const response = await api.post('/ai/support', { prompt, sessionId, pagePath });
  return response.data;
};

export const logUserBehavior = async (sessionId, eventType, payload = {}) => {
  try {
    await api.post('/behavior/log', { sessionId, eventType, payload });
  } catch (err) {
    console.error('Failed to log behavior:', err);
  }
};

// --- PLACES MUTATION API ---
export const createPlace = async (payload) => {
  const response = await api.post('/places', payload);
  return response.data;
};

export const updatePlace = async (id, payload) => {
  const response = await api.put(`/places/${id}`, payload);
  return response.data;
};

// --- REVIEWS API ---
// Backend route: POST /api/reviews  (placeId goes in the request body)
export const postReview = async (placeId, data) => {
  const response = await api.post('/reviews', { placeId, ...data });
  return response.data;
};

export const fetchReviews = async (placeId) => {
  const response = await api.get('/reviews', { params: { placeId } });
  return response.data;
};

// --- SAVES API ---
export const toggleSaveSpot = async (placeId) => {
  const response = await api.post('/saves/toggle', { placeId });
  return response.data;
};

export const getMySavedSpots = async () => {
  const response = await api.get('/saves/my-saves');
  return response.data;
};

export const checkIsSaved = async (placeId) => {
  const response = await api.get(`/saves/check/${placeId}`);
  return response.data;
};

// --- USER PROFILE API ---
export const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

export const updateUserProfile = async (data) => {
  const response = await api.put('/users/profile', data);
  return response.data;
};

// --- VENDOR & BUSINESS API ---
export const fetchVendorProfile = async () => {
  const response = await api.get('/businesses/vendor/profile');
  return response.data;
};

export const fetchVendorEvents = async () => {
  const response = await api.get('/events/vendor/my-events');
  return response.data;
};

export const createVendorEvent = async (eventData) => {
  const response = await api.post('/events', eventData);
  return response.data;
};

export const fetchVendorStats = async () => {
  const response = await api.get('/businesses/vendor/stats');
  return response.data;
};

// --- PLACES MUTATION API (Add Delete) ---
export const deletePlace = async (id) => {
  const response = await api.delete(`/places/${id}`);
  return response.data;
};

export default api;