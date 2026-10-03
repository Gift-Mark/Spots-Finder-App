const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    section: {
      type: String,
      enum: ['tourist_spots', 'trending', 'events', 'heritage', 'sports', 'dining'],
      required: true,
    },
    category: [{ type: String, required: true }], // e.g. ['Sports', 'Hiking'], ['Festivals', 'Culture']
    rating: { type: Number, default: 0.0 },
    reviewsCount: { type: Number, default: 0 },
    location: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    badge: { type: String },
    badgeVariant: { type: String, enum: ['green', 'orange', 'dark', 'blue'], default: 'green' },
    price: { type: String, default: 'Free' },
    cuisine: { type: String, trim: true },
    buttonText: { type: String, trim: true },
    amenities: [{ type: String }],
    dietaryOptions: [{ type: String }],
    openingHours: { type: String, trim: true },
    isOpenNow: { type: Boolean },
    isOpen24Hours: { type: Boolean },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    isFeatured: { type: Boolean, default: false },
    tags: [{ type: String }],
    isPromoted: { type: Boolean, default: false }, // Monetization feature
  },
  { timestamps: true }
);

module.exports = mongoose.model('Place', placeSchema);