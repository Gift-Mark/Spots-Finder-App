import mongoose from "mongoose";

const amenitySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, enum: ["Location", "Transport", "Lounge", "Tourism"], required: true },
  location: { type: String, required: true },
  availabilityStatus: { type: String, default: "Available" },
  isPublished: { type: Boolean, default: true },
  dataSource: { type: String, default: "verified" },
  lastVerifiedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Amenity", amenitySchema);