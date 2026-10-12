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

// Optional: Prevents a single user from reviewing the exact same place twice
ReviewSchema.index({ placeId: 1, createdAt: -1 }, { unique: true });

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
