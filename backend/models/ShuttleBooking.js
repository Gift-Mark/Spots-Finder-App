import mongoose from "mongoose";

const shuttleBookingSchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true, index: true },
  customerName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  pickupLocation: { type: String, required: true },
  destination: { type: String, required: true, default: "Jos City Centre / Rayfield" },
  pickupDateTime: { type: Date, required: true },
  passengerCount: { type: Number, required: true, min: 1, max: 15 },
  luggageDetails: { type: String, default: "Standard 20kg bags" },
  fareAmount: { type: Number, required: true }, // in minor currency units or standard NGN
  currency: { type: String, default: "NGN" },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  bookingStatus: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
  specialInstructions: { type: String, trim: true },
  idempotencyKey: { type: String, sparse: true, unique: true }
}, { timestamps: true });

export default mongoose.model("ShuttleBooking", shuttleBookingSchema);