const mongoose = require('mongoose');

const behaviorLogSchema = new mongoose.Schema(
  {
    sessionId: { 
      type: String, 
      required: true,
      index: true // Fast lookup for session history
    },
    eventType: {
      type: String,
      enum: ['SEARCH', 'CATEGORY_CLICK', 'VENUE_VIEW', 'BOOKING_ATTEMPT', 'FILTER_SELECT', 'AI_CHAT'],
      required: true,
    },
    payload: { 
      type: mongoose.Schema.Types.Mixed 
    }, // Dynamic metadata (e.g., query text, venue ID)
    timestamp: { 
      type: Date, 
      default: Date.now 
    },
  },
  { timestamps: true }
);

// --- PRODUCTION DATABASE INDEXES FOR REAL-WORLD PERFORMANCE --- //

// 1. Compound Index for Fast Aggregation Pipelines (Filtering eventType + sorting time)
behaviorLogSchema.index({ eventType: 1, createdAt: -1 });

// 2. Index for Payload Fields used in Aggregations
behaviorLogSchema.index({ 'payload.query': 1 });
behaviorLogSchema.index({ 'payload.category': 1 });

// 3. TTL (Time-To-Live) Optional Retention: Auto-delete raw logs older than 90 days to conserve database space
// behaviorLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

module.exports = mongoose.model('BehaviorLog', behaviorLogSchema);