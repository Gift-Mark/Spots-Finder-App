import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId, // Defines this field as a MongoDB ID
    ref: 'Business',                      // Links it directly to your 'Business' model
    required: true
  },
  plan: {
    type: String, // e.g., 'Basic', 'Premium', 'Enterprise'
    required: true,
    trim: true
  },
  amount: {
    type: Number, // The monetary charge amount
    required: true,
    min: 0
  },
  billingCycle: {
    type: String, 
    enum: ['monthly', 'yearly', 'one-time'], // Enforces specific payment frequencies
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'unpaid', 'failed', 'refunded'],
    default: 'unpaid'
  },
  transactionReference: {
    type: String, // External gateway transaction ID (e.g., Stripe/Paystack reference string)
    required: true,
    unique: true, // Prevents duplicate ledger entries for the same transaction
    trim: true
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Index to quickly determine if a business has a currently active premium subscription
SubscriptionSchema.index({ businessId: 1, paymentStatus: 1, endDate: 1 });

const Subscription = mongoose.model('Subscription', SubscriptionSchema);

export default Subscription;