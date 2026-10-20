import mongoose from 'mongoose';

const AccommodationZoneSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  description: { type: String, required: true },
  displayPriority: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

const AccommodationZone = mongoose.model('AccommodationZone', AccommodationZoneSchema);

export default AccommodationZone;