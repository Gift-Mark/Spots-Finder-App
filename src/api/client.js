import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

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

export const toggleSaveSpot = async (placeId, placeSnapshot) => {
  const response = await api.post('/saves/toggle', { placeId, placeSnapshot });
  return response.data;
};

// --- PLACES MUTATION API ---
export const createPlace = async (payload) => {
  const response = await api.post('/places', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updatePlace = async (id, payload) => {
  const response = await api.put(`/places/${id}`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
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

export const fetchAllEvents = async (params = {}) => {
  const firstPage = await fetchEvents({ ...params, page: 1, limit: 100 });
  if (!firstPage?.success || !Array.isArray(firstPage.data)) {
    throw new Error(firstPage?.message || 'The events service returned an invalid response.');
  }
  const pages = Math.max(1, Number(firstPage.pages) || 1);
  const remainingPages = await Promise.all(
    Array.from({ length: pages - 1 }, (_, index) =>
      fetchEvents({ ...params, page: index + 2, limit: 100 })
    )
  );
  const uniqueEvents = new Map();
  [firstPage, ...remainingPages].forEach((page) => {
    if (!page?.success || !Array.isArray(page.data)) {
      throw new Error(page?.message || 'The events service returned an invalid page.');
    }
    page.data.forEach((event) => {
      const eventId = event._id || event.id || event.slug;
      if (eventId) uniqueEvents.set(String(eventId), event);
    });
  });
  return Array.from(uniqueEvents.values());
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


export const logUserBehavior = async (sessionId, eventType, payload = {}) => {
  try {
    await api.post('/behavior/log', { sessionId, eventType, payload });
  } catch (err) {
    console.error('Failed to log behavior:', err);
  }
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

// Reviews for bundled/static stays, which have no Mongo ObjectId. The backend
// stores these against `staySlug` instead of `placeId`.
export const postStayReview = async (staySlug, data) => {
  const response = await api.post('/reviews', { staySlug, ...data });
  return response.data;
};

export const fetchStayReviews = async (staySlug) => {
  const response = await api.get('/reviews', { params: { staySlug } });
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

// --- FLIGHTS API ---
export const searchFlights = async (params = {}) => {
  const response = await api.get('/flights/search', { params });
  return response.data;
};

export const askWebsiteSupport = async (messages, sessionId, pagePath) => {
  const response = await fetch('/api/ai/support', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages, // Sends full conversation array
      sessionId,
      pagePath,
    }),
  });

  if (!response.ok) {
    let message = `AI support request failed (${response.status}).`;
    try {
      const errorData = await response.json();
      message = errorData.error || errorData.message || message;
    } catch {
      if (response.status === 429) {
        message = 'Jos Pulse AI is temporarily rate-limited. Please try again later.';
      }
    }
    throw new Error(message);
  }

  const data = await response.json();
  if (data.success === false) {
    throw new Error(data.error || data.message || "AI support could not process the request.");
  }
  return data;
};

export default api;