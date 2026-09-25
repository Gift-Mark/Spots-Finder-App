const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 160 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  legacyId: { type: String, trim: true, default: '' },
  summary: { type: String, required: true, trim: true, maxlength: 500 },
  description: { type: String, default: '', maxlength: 8000 },
  category: { type: String, enum: ['festival','sports','music','culture','food','other'], default: 'other', index: true },
  startsAt: { type: Date, default: null, index: true }, endsAt: { type: Date, default: null },
  dateLabel: { type: String, trim: true, maxlength: 80, default: '' },
  recurrenceMonth: { type: Number, min: 1, max: 12, default: null },
  recurrenceDay: { type: Number, min: 1, max: 31, default: null },
  venueName: { type: String, trim: true, maxlength: 160, default: '' }, address: { type: String, trim: true, maxlength: 300, default: '' },
  imageUrl: { type: String, trim: true, maxlength: 1000, default: '' }, priceAmount: { type: Number, min: 0, default: null },
  currency: { type: String, uppercase: true, default: 'NGN', minlength: 3, maxlength: 3 },
  ticketUrl: { type: String, trim: true, maxlength: 1000, default: '' }, organizer: { type: String, trim: true, maxlength: 160, default: '' },
  sourceUrl: { type: String, trim: true, maxlength: 1000, default: '' },
  status: { type: String, enum: ['draft','published','cancelled','archived'], default: 'draft', index: true },
}, { timestamps: true });
schema.index({ name: 'text', summary: 'text', description: 'text', venueName: 'text' });
schema.index({ status: 1, startsAt: 1, category: 1 });
module.exports = mongoose.model('Event', schema);
