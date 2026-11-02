// Image URL Helper Utilities - Centralizes image path resolution with fallbacks

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
const DEFAULT_PLACEHOLDER = '/images/Rayfield Resort.jpg';

export const getImageUrl = (item, fallback = DEFAULT_PLACEHOLDER) => {
  if (!item) return fallback;

  const imageFields = ['heroImage', 'coverImage', 'imageUrl', 'image', 'images', 'gallery'];

  for (const field of imageFields) {
    let imagePath = item[field];

    if (Array.isArray(imagePath) && imagePath.length > 0) {
      imagePath = imagePath[0];
    }

    if (imagePath && typeof imagePath === 'string' && imagePath.trim()) {
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
      }
      if (imagePath.startsWith('/uploads/')) {
        return `${BACKEND_URL}${imagePath}`;
      }
      if (imagePath.startsWith('/')) {
        return imagePath;
      }
      return `${BACKEND_URL}/uploads/${imagePath}`;
    }
  }

  return fallback;
};

export const getVenueImageUrl = (venue) => getImageUrl(venue, '/images/Rayfield Resort.jpg');

export const getEventImageUrl = (event) => getImageUrl(event, 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80');

export const getStayImageUrl = (stay) => getImageUrl(stay, '/images/Rayfield Resort.jpg');
