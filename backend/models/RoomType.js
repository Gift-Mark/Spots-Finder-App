import mongoose from 'mongoose';

const RoomTypeSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Accommodation', required: true, index: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  bedConfiguration: { type: String, required: true },
  maximumAdults: { type: Number, default: 2 },
  maximumChildren: { type: Number, default: 1 },
  nightlyRate: { type: Number, required: true, min: 0 },
  amenities: [{ type: String }],
  inventoryQuantity: { type: Number, default: 5 },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

const RoomType = mongoose.model('RoomType', RoomTypeSchema);
export default RoomType;