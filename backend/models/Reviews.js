import mongoose from 'mongoose'

const ReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',                          
    required: false
  },
  guestName: {
    type: String,
    trim: true,
    default: 'Anonymous Vibe Seeker'
  },
  guestHandle: {
    type: String,
    trim: true
  },
  placeId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Place',                         
    required: false
  },
  // Static/bundled stays have no Mongo id, so they are keyed by slug instead.
  staySlug: {
    type: String,
    trim: true,
    index: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1, 
    max: 5  
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  photos: [{
    type: String // Array of photo URLs uploaded by guests
  }],
  isGuest: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true 
});

// Optional: speeds up per-place and per-stay review lookups
ReviewSchema.index({ placeId: 1, staySlug: 1, createdAt: -1 });

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
