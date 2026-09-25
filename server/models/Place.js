const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 140 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  legacyId: { type: String, trim: true, default: '' },
  summary: { type: String, required: true, trim: true, maxlength: 500 },
  description: { type: String, default: '', maxlength: 8000 },
  category: { type: String, required: true, enum: ['restaurant','nightlife','nature','culture','festival','sports','golf','landmark','hotel','cafe'], index: true },
  subcategory: { type: String, trim: true, maxlength: 80, default: '' },
  sports: [{ type: String, trim: true, maxlength: 50 }],
  address: { type: String, trim: true, maxlength: 300, default: '' },
  city: { type: String, trim: true, maxlength: 100, default: 'Jos' },
  state: { type: String, trim: true, maxlength: 100, default: 'Plateau' },
  coordinates: { latitude: { type: Number, min: -90, max: 90 }, longitude: { type: Number, min: -180, max: 180 } },
  images: [{ type: String, trim: true, maxlength: 1000 }],
  priceLevel: { type: Number, min: 1, max: 4 },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviewCount: { type: Number, min: 0, default: 0 },
  websiteUrl: { type: String, trim: true, maxlength: 1000, default: '' },
  bookingUrl: { type: String, trim: true, maxlength: 1000, default: '' },
  openingHours: { type: mongoose.Schema.Types.Mixed, default: {} },
  tags: [{ type: String, trim: true, maxlength: 40 }],
  featured: { type: Boolean, default: false },
  promoted: { type: Boolean, default: false },
  sourceName: { type: String, trim: true, maxlength: 140, default: '' },
  sourceUrl: { type: String, trim: true, maxlength: 1000, default: '' },
  verifiedAt: { type: Date, default: null },
  status: { type: String, enum: ['draft','published','archived'], default: 'draft', index: true },
}, { timestamps: true });
schema.index({ name: 'text', summary: 'text', description: 'text', tags: 'text' });
schema.index({ category: 1, status: 1, featured: -1, rating: -1 });
module.exports = mongoose.model('Place', schema);
