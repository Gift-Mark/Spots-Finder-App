const Place = require('../models/Place');

// @desc    Get all places with optional filtering by section/category
// @route   GET /api/places
exports.getPlaces = async (req, res) => {
  try {
    const { section, category, search } = req.query;
    let query = {};

    if (section) query.section = section;
    if (category && category !== 'all') query.category = { $in: [category] };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const places = await Place.find(query).sort({ isPromoted: -1, createdAt: -1 });
    res.status(200).json({ success: true, count: places.length, data: places });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new spot, venue, or event
// @route   POST /api/places
exports.createPlace = async (req, res) => {
  try {
    const newPlace = await Place.create(req.body);
    res.status(201).json({ success: true, data: newPlace });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};