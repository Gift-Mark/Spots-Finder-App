import Accommodation from '../models/Accommodation.js';
import AccommodationZone from '../models/AccommodationZone.js';
import RoomType from '../models/RoomType.js';

// GET /api/v1/accommodations
export const getAccommodations = async (req, res) => {
  try {
    const { category, zone, propertyType, search, minPrice, maxPrice } = req.query;
    let query = { isPublished: true };

    if (propertyType && propertyType !== 'All accommodation') {
      query.propertyType = propertyType;
    }
    if (zone) {
      query.zone = zone;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { neighborhood: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (minPrice || maxPrice) {
      query.startingFare = {};
      if (minPrice) query.startingFare.$gte = Number(minPrice);
      if (maxPrice) query.startingFare.$lte = Number(maxPrice);
    }

    const accommodations = await Accommodation.find(query).populate('zone').sort({ isFeatured: -1, rating: -1 });
    res.status(200).json({ success: true, count: accommodations.length, data: accommodations });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching accommodations', error: err.message });
  }
};

// GET /api/v1/accommodations/featured
export const getFeaturedAccommodations = async (req, res) => {
  try {
    const featured = await Accommodation.find({ isPublished: true, isFeatured: true }).limit(5);
    res.status(200).json({ success: true, count: featured.length, data: featured });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching featured accommodations', error: err.message });
  }
};

// GET /api/v1/accommodations/:slug
export const getAccommodationBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({ success: false, message: 'Accommodation slug is required.' });
    }

    // Allow lookup by slug (normal) or by Mongo id (legacy links).
    const query = /^[0-9a-fA-F]{24}$/.test(slug)
      ? { $or: [{ slug }, { _id: slug }] }
      : { slug };

    const accommodation = await Accommodation.findOne({
      ...query,
      isPublished: true
    }).populate('zone');

    if (!accommodation) {
      return res.status(404).json({ success: false, message: 'Accommodation not found.' });
    }

    // Attach bookable room categories so the detail page can show real rates.
    const roomTypes = await RoomType.find({
      property: accommodation._id,
      isPublished: true
    })
      .select('name nightlyRate')
      .sort({ nightlyRate: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: { ...accommodation.toObject(), roomTypes }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching accommodation details',
      error: err.message
    });
  }
};

// GET /api/v1/accommodation-zones
export const getAccommodationZones = async (req, res) => {
  try {
    const zones = await AccommodationZone.find({ isPublished: true }).sort({ displayPriority: 1 });
    res.status(200).json({ success: true, data: zones });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching accommodation zones', error: err.message });
  }
};