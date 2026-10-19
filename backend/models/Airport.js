import mongoose from "mongoose";

const airportSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  iataCode: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
  icaoCode: { type: String, uppercase: true, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  country: { type: String, default: "Nigeria", trim: true },
  elevationMeters: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  dataSource: { type: String, default: "verified" },
  verifiedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Airport", airportSchema);