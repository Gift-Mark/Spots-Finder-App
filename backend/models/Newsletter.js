import mongoose from 'mongoose';

const NewsletterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',                          
    required: false,                      
    default: null
  },
  email: {
    type: String,
    required: true,
    unique: true,                         // Prevents duplicate newsletter entries
    lowercase: true,
    trim: true
  },
  subscriptionStatus: {
    type: String,
    enum: ['subscribed', 'unsubscribed'],
    default: 'subscribed'
  },
  subscribedAt: {
    type: Date,
    default: Date.now,                     // Captures the exact moment they opted in
    required: true
  },
  unsubscribedAt: {
    type: Date,
    default: null                          // Remains null until they click an unsubscribe link
  }
});

// Index to quickly look up active subscribers for email blasts
NewsletterSchema.index({ subscriptionStatus: 1, email: 1 });

const Newsletter = mongoose.model('Newsletter', NewsletterSchema);

export default Newsletter;
