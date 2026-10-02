import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchPlaces = async (params = {}) => {
  const response = await axios.get(`${API_BASE_URL}/places`, { params });
  return response.data;
};

export const fetchPlaceBySlug = async (slug) => {
  const response = await axios.get(`${API_BASE_URL}/places/${slug}`);
  return response.data;
};

export const askWebsiteSupport = async (prompt, sessionId, pagePath) => {
  const response = await axios.post(`${API_BASE_URL}/ai/support`, { prompt, sessionId, pagePath });
  return response.data;
};

export const logUserBehavior = async (sessionId, eventType, payload = {}) => {
  try {
    await axios.post(`${API_BASE_URL}/behavior/log`, { sessionId, eventType, payload });
  } catch (err) {
    console.error('Failed to log behavior:', err);
  }
};