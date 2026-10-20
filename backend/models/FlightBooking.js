import mongoose from "mongoose";

const flightBookingSchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true },
  passengerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  airline: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  departDate: { type: String, required: true },
  cabinClass: { type: String, required: true },
  passengerCount: { type: Number, required: true },
  totalFare: { type: Number, required: true },
  status: { type: String, default: "Confirmed" }
}, { timestamps: true });

export default mongoose.model("FlightBooking", flightBookingSchema);