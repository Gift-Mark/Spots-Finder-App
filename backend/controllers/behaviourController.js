const BehaviorLog = require('../models/BehaviorLog');

// @desc    Log user interaction event
// @route   POST /api/behavior/log
exports.logEvent = async (req, res) => {
  try {
    const { sessionId, eventType, payload } = req.body;
    if (!sessionId || !eventType) {
      return res.status(400).json({ success: false, message: 'Missing sessionId or eventType' });
    }

    const log = await BehaviorLog.create({ sessionId, eventType, payload });
    res.status(201).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get aggregated analytics for dashboard (Admin/Tourism insights)
// @route   GET /api/behavior/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const topSearches = await BehaviorLog.aggregate([
      { $match: { eventType: 'SEARCH' } },
      { $group: { _id: '$payload.query', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const popularCategories = await BehaviorLog.aggregate([
      { $match: { eventType: 'CATEGORY_CLICK' } },
      { $group: { _id: '$payload.category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({ success: true, analytics: { topSearches, popularCategories } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};