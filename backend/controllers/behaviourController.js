import BehaviorLog from "../models/BehaviorLog.js";

/**
 * @desc    Log user interaction event & broadcast in real time via Socket.io
 * @route   POST /api/behavior/log
 * @access  Public (Guest & User tracking via sessionId)
 */
export const logEvent = async (req, res) => {
  try {
    const { sessionId, eventType, payload } = req.body;

    if (!sessionId || !eventType) {
      return res.status(400).json({
        success: false,
        message: "Missing sessionId or eventType",
      });
    }

    // 1. Save log to database
    const log = await BehaviorLog.create({ sessionId, eventType, payload });

    // 2. REAL-TIME EMISSION (Socket.io)
    if (req.io) {
      // Global real-time stream for Admin/Analytics dashboards
      req.io.emit("realtime_behavior_logged", {
        id: log._id,
        sessionId,
        eventType,
        payload,
        createdAt: log.createdAt || new Date(),
      });

      // Optional: Channel-specific broadcast (e.g., specific venue or AI topic)
      if (payload?.placeId) {
        req.io.to(`place_${payload.placeId}`).emit("place_activity_update", log);
      }
    }

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get aggregated behavior analytics (Admin / Tourism insights)
 * @route   GET /api/behavior/analytics
 * @access  Private (Admin Only)
 */
export const getAnalytics = async (req, res) => {
  try {
    // Filter out empty/null query string aggregations safely
    const topSearches = await BehaviorLog.aggregate([
      {
        $match: {
          eventType: "SEARCH",
          "payload.query": { $exists: true,$ne: "" },
        },
      },
      { $group: { _id: "$payload.query", count: { $sum: 1 } } },
      { $sort: { count: -1 } },       {$limit: 10 },
    ]);

    const popularCategories = await BehaviorLog.aggregate([
      {
        $match: {
          eventType: "CATEGORY_CLICK",
          "payload.category": { $exists: true,$ne: null },
        },
      },
      { $group: { _id: "$payload.category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },       {$limit: 10 },
    ]);

    const aiSupportUsage = await BehaviorLog.aggregate([
      { $match: { eventType: "AI_CHAT" } },
      {
        $group: {
          _id: {
            intent: { $ifNull: ["$payload.intent", "GENERAL"] },
            pagePath: { $ifNull: ["$payload.pagePath", "/"] },
          },
          count: { $sum: 1 },
          resolvedCount: {
            $sum: {$cond: [{ $eq: ["$payload.resolved", true] }, 1, 0] },
          },
        },
      },
      { $sort: { count: -1 } },       {$limit: 15 },
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        topSearches,
        popularCategories,
        aiSupportUsage,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get logs for a specific session
 * @route   GET /api/behavior/session/:sessionId
 * @access  Public
 */
export const getSessionHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Leverages behaviorLogSchema.index({ sessionId: 1 })
    const logs = await BehaviorLog.find({ sessionId }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};