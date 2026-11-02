import mongoose from 'mongoose';

const AccommodationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  description: { type: String, required: true },
  propertyType: { 
    type: String, 
    enum: ['Hotel', 'Resort', 'Chalet', 'Lodge', 'Guest House', 'Serviced Apartment'],
    required: true 
  },
  zone: { type: mongoose.Schema.Types.ObjectId, ref: 'AccommodationZone', required: true },
  address: { type: String, required: true },
  neighborhood: { type: String, required: true },
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  images: [{ url: String, caption: String, isPrimary: Boolean }],
  amenities: [{ type: String }],
  startingFare: { type: Number, required: true },
  currency: { type: String, default: 'NGN' },
  maximumOccupancy: { type: Number, default: 4 },
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 0 },
  verificationStatus: { type: String, enum: ['Verified', 'Pending', 'Unverified'], default: 'Verified' },
  verifiedAt: { type: Date, default: Date.now },
  isPublished: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

const Accommodation =
  mongoose.models.Accommodation ||
  mongoose.model('Accommodation', AccommodationSchema);

export default Accommodation;