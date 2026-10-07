import moongoose from 'mongoose';

const LocationActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Defines this field as a MongoDB ID
    ref: 'User',                          // Links it directly to your 'User' model
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  city: {
    type: String,
    trim: true,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now,                     // Records when this specific ping occurred
    required: true
  },
  permissionGranted: {
    type: Boolean,                         // True/false flag matching your requirements
    required: true
  }
});

// Optional: Creates a compound index on userId and timestamp for blazing fast history lookups
LocationActivitySchema.index({ userId: 1, timestamp: -1 });

const LocationActivity = mongoose.model('LocationActivity', LocationActivitySchema);
