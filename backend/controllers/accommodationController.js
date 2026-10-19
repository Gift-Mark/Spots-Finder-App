const Accommodation = require('../models/Accommodation');
const AccommodationZone = require('../models/AccommodationZone');

// GET /api/v1/accommodations
exports.getAccommodations = async (req, res) => {
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
exports.getFeaturedAccommodations = async (req, res) => {
  try {
    const featured = await Accommodation.find({ isPublished: true, isFeatured: true }).limit(5);
    res.status(200).json({ success: true, count: featured.length, data: featured });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching featured accommodations', error: err.message });
  }
};

// GET /api/v1/accommodation-zones
exports.getAccommodationZones = async (req, res) => {
  try {
    const zones = await AccommodationZone.find({ isPublished: true }).sort({ displayPriority: 1 });
    res.status(200).json({ success: true, data: zones });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching accommodation zones', error: err.message });
  }
};