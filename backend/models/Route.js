import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
  originAirport: { type: mongoose.Schema.Types.ObjectId, ref: "Airport", required: true },
  destinationAirport: { type: mongoose.Schema.Types.ObjectId, ref: "Airport", required: true },
  slug: { type: String, required: true, unique: true, index: true },
  airline: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  startingFare: { type: Number, required: true },
  currency: { type: String, default: "NGN" },
  isFeatured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
  dataSource: { type: String, default: "verified" },
  verifiedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Route", routeSchema);