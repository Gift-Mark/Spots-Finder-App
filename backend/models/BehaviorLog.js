import mongoose from "mongoose";

const behaviorLogSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true, // Fast lookup for session history
    },
    eventType: {
      type: String,
      enum: [
        "SEARCH",
        "CATEGORY_CLICK",
        "VENUE_VIEW",
        "BOOKING_ATTEMPT",
        "FILTER_SELECT",
        "AI_CHAT",
      ],
      required: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
    }, // Dynamic metadata (e.g., query text, venue ID)
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Indexes for Aggregation Performance
behaviorLogSchema.index({ eventType: 1, createdAt: -1 });
behaviorLogSchema.index({ "payload.query": 1 });
behaviorLogSchema.index({ "payload.category": 1 });

const BehaviorLog = mongoose.model("BehaviorLog", behaviorLogSchema);

export default BehaviorLog;