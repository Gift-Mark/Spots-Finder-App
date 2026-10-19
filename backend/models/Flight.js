/* import mongoose from "mongoose";

const flightSchema = new mongoose.Schema({
  flightNumber: { type: String, required: true, unique: true },
  airline: { type: String, required: true },
  airlineCode: { type: String, required: true },
  origin: { type: String, required: true },       // e.g., 'LOS', 'ABV'
  destination: { type: String, required: true },  // e.g., 'JOS'
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  duration: { type: String, required: true },
  economyPrice: { type: Number, required: true },
  businessPrice: { type: Number, required: true },
  availableSeats: { type: Number, default: 10 },
  status: { type: String, default: "On Time" },
}, { timestamps: true });

export default mongoose.model("Flight", flightSchema); */
import mongoose from "mongoose";

const flightSchema = new mongoose.Schema({
  flightNumber: { type: String, required: true, index: true },
  airline: { type: String, required: true },
  originAirport: { type: String, required: true, uppercase: true },
  destinationAirport: { type: String, required: true, uppercase: true },
  scheduledDeparture: { type: Date, required: true },
  scheduledArrival: { type: Date, required: true },
  terminal: { type: String, default: "Main Terminal" },
  gate: { type: String, default: "Gate 01" },
  status: { type: String, enum: ["Landed On Time", "Approaching Plateau", "Scheduled", "Boarding", "Delayed", "Cancelled"], default: "Scheduled" },
  isDemo: { type: Boolean, default: true },
  lastSyncedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Flight", flightSchema);