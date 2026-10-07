import mongoose from 'mongoose';

const SaveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Defines this field as a MongoDB ID
    ref: 'User',                          // Links it directly to your 'User' model
    required: true
  },
  placeId: {
    type: mongoose.Schema.Types.ObjectId, // Defines this field as a MongoDB ID
    ref: 'Place',                         // Links it directly to your 'Place' model
    required: true
  }
}, {
  // Configures Mongoose to automatically generate 'createdAt' but omit 'updatedAt'
  timestamps: { createdAt: true, updatedAt: false }
});

// Enforces that a user can only save a specific place once
SaveSchema.index({ userId: 1, placeId: 1 }, { unique: true });

const Save = mongoose.model('Save', SaveSchema);

export default Save;