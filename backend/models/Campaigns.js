import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Business',                      
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String, // Banner URL or graphic asset link for the ad/promo card
    default: ''
  },
  targetLocation: {
    type: String, // e.g., 'New York, NY', 'All', or a specific neighborhood name
    trim: true,
    default: 'All'
  },
  targetCategory: {
    type: String, // e.g., 'Food & Drinks' to target specific user interest demographics
    trim: true,
    default: 'All'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  budget: {
    type: Number, // Ad spend maximum or promotional allocation cap
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['draft', 'pending_approval', 'active', 'paused', 'completed'],
    default: 'draft'
  }
}, {
  // Configures Mongoose to automatically generate 'createdAt' but omit 'updatedAt'
  timestamps: { createdAt: true, updatedAt: false }
});

// Index to quickly fetch running ads based on current validity dates and status
CampaignSchema.index({ status: 1, startDate: 1, endDate: 1 });

const Campaign = mongoose.model('Campaign', CampaignSchema);

export default Campaign;
