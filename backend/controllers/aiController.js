const Place = require('../models/Place');

// @desc    Process query and give AI-guided response
// @route   POST /api/ai/recommend
exports.getAIRecommendation = async (req, res) => {
  try {
    const { prompt } = req.body;
    const query = prompt ? prompt.toLowerCase() : '';

    let matchedCategory = null;
    if (query.includes('sport') || query.includes('hike') || query.includes('outdoor')) {
      matchedCategory = 'Sports';
    } else if (query.includes('festival') || query.includes('culture') || query.includes('landmark')) {
      matchedCategory = 'Culture';
    } else if (query.includes('drink') || query.includes('lounge') || query.includes('night')) {
      matchedCategory = 'Nightlife';
    }

    let recommendations = [];
    if (matchedCategory) {
      recommendations = await Place.find({ category: { $in: [matchedCategory] } }).limit(3);
    } else {
      recommendations = await Place.find({ isPromoted: true }).limit(3);
    }

    res.status(200).json({
      success: true,
      reply: `Here are some recommendations based on your interest:`,
      recommendations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};