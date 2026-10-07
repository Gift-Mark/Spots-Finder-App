import mongoose from 'mongoose'

const ReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',                          
    required: true
  },
  placeId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Place',                         
    required: true
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
  }
}, {
  timestamps: true 
});

// Optional: Prevents a single user from reviewing the exact same place twice
ReviewSchema.index({ userId: 1, placeId: 1 }, { unique: true });

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
