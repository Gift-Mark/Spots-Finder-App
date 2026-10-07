import mongoose from 'mongoose';

const businessSchema = new mongoose.schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    businessName: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      maxLength: 140,
      trim: true,
      required: true
    },
    category: {
      type:String,
      required:true,
      trim:true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type:String,
      required:true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim:true
    },
    latitude: {
      type: Number,
      required:true
    },
    longitude: {
      type: Number,
      required: true
    },
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    images: [{
      type: String
    }],
    openingHours: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'pending'
    },
    verification: {
    cacDocument: { type: String, default: '' },       // URL to uploaded CAC PDF/Image
    utilityBill: { type: String, default: '' },       // URL to uploaded Utility Bill
    businessPermit: { type: String, default: '' },    // URL to uploaded Business Permit
    status: {
      type: String,
      enum: ['unverified', 'pending_review', 'verified', 'rejected'],
      default: 'pending_review'                        // Automatically goes into review on upload
    },
    rejectionReason: {
       type: String, 
       default: '' },   // Admin notes if rejected
    submittedAt: { 
      type: Date, 
      default: Date.now 
    }
  }
  },
  {
    timestamps: true
  }
);

const Business = mongoose.model("Business", businessSchema);

export default Business;
