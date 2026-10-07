import mongoose from 'mongoose';

const CheckInSchema = new mongoose.Schema({
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
  checkInTime: {
    type: Date,
    default: Date.now,                    // Captures the exact moment the check-in occurred
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  }
}, {
  // Configures Mongoose to automatically generate 'createdAt' but omit 'updatedAt'
  timestamps: { createdAt: true, updatedAt: false }
});

const CheckIn = mongoose.model('CheckIn', CheckInSchema);

export default CheckIn;