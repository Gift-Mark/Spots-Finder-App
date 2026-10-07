import mongoose from 'mongoose';

const InteractionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',                          
    required: true
  },
  placeId: {
    type: mongoose.Schema.Types.ObjectId, // Defines this field as a MongoDB ID
    ref: 'Place',                         
    default: null
  },
  interactionType: {
    type: String, // e.g., 'click', 'view', 'search', 'share', 'call_button_clicked'
    required: true,
    trim: true
  },
  searchQuery: {
    type: String, // Stores the raw search string if the interaction type was a 'search'
    default: '',
    trim: true
  },
  category: {
    type: String, // e.g., 'Restaurant', 'Event Space' (helps track user interests)
    trim: true,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now,                     // Automatically logs the exact moment of interaction
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,     // Allows storing flexible, unstructured JSON data
    default: {}
  }
});

// Indexing for analytics query performance (sorting by most recent logs)
InteractionSchema.index({ userId: 1, timestamp: -1 });
InteractionSchema.index({ interactionType: 1, timestamp: -1 });

const Interaction = mongoose.model('Interaction', InteractionSchema);

export default Interaction;
