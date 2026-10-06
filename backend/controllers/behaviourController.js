const BehaviorLog = require('../models/BehaviorLog');

// @desc    Log user interaction event & broadcast in real time
// @route   POST /api/behavior/log
exports.logEvent = async (req, res) => {
  try {
    const { sessionId, eventType, payload } = req.body;
    
    if (!sessionId || !eventType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing sessionId or eventType' 
      });
    }

    // 1. Save log to database
    const log = await BehaviorLog.create({ sessionId, eventType, payload });

    // 2. REAL-TIME EMISSION (Socket.io)
    if (req.io) {
      // Global real-time stream for Admin/Analytics dashboards
      req.io.emit('realtime_behavior_logged', {
        id: log._id,
        sessionId,
        eventType,
        payload,
        createdAt: log.createdAt || new Date()
      });

      // Optional: Channel-specific broadcast (e.g., specific venue or AI topic)
      if (payload?.placeId) {
        req.io.to(`place_${payload.placeId}`).emit('place_activity_update', log);
      }
    }

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get aggregated analytics for dashboard (Admin/Tourism insights)
// @route   GET /api/behavior/analytics
exports.getAnalytics = async (req, res) => {
  try {
    // Filter out empty/null query string aggregations safely
    const topSearches = await BehaviorLog.aggregate([
      { 
        $match: { 
          eventType: 'SEARCH', 
          'payload.query': { $exists: true,$ne: '' } 
        } 
      },
      { $group: { _id: '$payload.query', count: {$sum: 1 } } },
      { $sort: { count: -1 } },       {$limit: 10 }
    ]);

    const popularCategories = await BehaviorLog.aggregate([
      { 
        $match: { 
          eventType: 'CATEGORY_CLICK', 
          'payload.category': { $exists: true,$ne: null } 
        } 
      },
      { $group: { _id: '$payload.category', count: {$sum: 1 } } },
      { $sort: { count: -1 } },       {$limit: 10 }
    ]);

    const aiSupportUsage = await BehaviorLog.aggregate([
      { $match: { eventType: 'AI_CHAT' } },
      {
        $group: {
          _id: { 
            intent: { $ifNull: ['$payload.intent', 'GENERAL'] }, 
            pagePath: { $ifNull: ['$payload.pagePath', '/'] } 
          },
          count: { $sum: 1 },
          resolvedCount: { $sum: {$cond: [{ $eq: ['$payload.resolved', true] }, 1, 0] } }
        }
      },
      { $sort: { count: -1 } },       {$limit: 15 }
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        topSearches,
        popularCategories,
        aiSupportUsage
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};