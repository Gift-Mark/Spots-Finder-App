import mongoose from 'mongoose';

const RecommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Defines this field as a MongoDB ID
    ref: 'User',                          // Links it directly to your 'User' model
    required: true
  },
  placeId: {
    type: mongoose.Schema.Types.ObjectId, // Defines this field as a MongoDB ID
    ref: 'Place',                         // Links it directly to your 'Place' model
    required: true
  },
  reason: {
    type: String, // e.g., "Because you visited similar coffee shops" or "Popular near you"
    required: true,
    trim: true
  },
  score: {
    type: Number, // Ranking score (e.g., 0.95 or 87.4) used to sort recommendations
    required: true
  },
  algorithmVersion: {
    type: String, // e.g., "v1.0.0", "collaborative-filtering-v2" (helps track performance)
    required: true,
    trim: true
  }
}, {
  // Configures Mongoose to automatically generate 'createdAt' but omit 'updatedAt'
  timestamps: { createdAt: true, updatedAt: false }
});

// Compound index to quickly pull up a user's recommendations sorted by highest score
RecommendationSchema.index({ userId: 1, score: -1 });

const Recommendation = mongoose.model('Recommendation', RecommendationSchema);
