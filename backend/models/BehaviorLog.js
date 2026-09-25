const mongoose = require('mongoose');

const behaviorLogSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    eventType: {
      type: String,
      enum: ['SEARCH', 'CATEGORY_CLICK', 'VENUE_VIEW', 'BOOKING_ATTEMPT', 'FILTER_SELECT'],
      required: true,
    },
    payload: { type: mongoose.Schema.Types.Mixed }, // Dynamic metadata (e.g., query text, venue ID)
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BehaviorLog', behaviorLogSchema);