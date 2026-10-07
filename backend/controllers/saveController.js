const Save = require('../models/Save');

// @desc    Toggle Save/Unsave a Place
// @route   POST /api/saves/toggle
exports.toggleSavePlace = async (req, res) => {
  const { userId, placeId } = req.body;

  try {
    // Check if the user already saved this place
    const existingSave = await Save.findOne({ userId, placeId });

    if (existingSave) {
      // If it exists, unsave it (remove)
      await Save.findByIdAndDelete(existingSave._id);
      return res.status(200).json({ success: true, message: 'Place removed from saves.' });
    }

    // If it doesn't exist, save it (create)
    const newSave = await Save.create({ userId, placeId });
    res.status(201).json({ success: true, data: newSave, message: 'Place saved successfully!' });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all saved places for a specific user
// @route   GET /api/saves/user/:userId
exports.getUserSaves = async (req, res) => {
  try {
    const saves = await Save.find({ userId: req.params.userId })
      .populate('placeId'); // Pulls in the full details of the saved place
      
    res.status(200).json({ success: true, count: saves.length, data: saves });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
