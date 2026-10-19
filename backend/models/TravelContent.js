import mongoose from 'mongoose';

const TravelContentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  description: { type: String, required: true },
  category: { type: String, default: 'Climate & Travel' },
  verifiedSource: { type: String, default: 'Jos Pulse Meteorological Desk' },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

const TravelContent = mongoose.model('TravelContent', TravelContentSchema);
export default TravelContent;