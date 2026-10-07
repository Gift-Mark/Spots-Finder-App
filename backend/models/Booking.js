import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',                          
    required: true
  },
  bookingType: {
    type: String,
    required: true,
    trim: true
  },
  provider: {
    type: String, // The company fulfilling the service (e.g., 'Delta Airlines', 'Hilton Hotels')
    required: true,
    trim: true
  },
  destination: {
    type: String, // e.g., 'Paris, FR', 'Room 302', 'Main Auditorium'
    required: true,
    trim: true
  },
  bookingReference: {
    type: String, // The confirmation code (e.g., PNR number or unique voucher string)
    required: true,
    unique: true, // Prevents duplicate booking record creation
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  amount: {
    type: Number, // Cost of the booking
    required: true,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['confirmed', 'pending_confirmation', 'cancelled', 'completed'],
    default: 'pending_confirmation'
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Index to quickly look up a specific user's upcoming active bookings
BookingSchema.index({ userId: 1, startDate: 1, status: 1 });

const Booking = mongoose.model('Booking', BookingSchema);

export default Booking;
