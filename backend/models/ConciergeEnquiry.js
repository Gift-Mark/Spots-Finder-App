import mongoose from "mongoose";

const conciergeEnquirySchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  category: { type: String, required: true, default: "General Air Support" },
  message: { type: String, required: true },
  bookingReference: { type: String, trim: true },
  status: { type: String, enum: ["open", "in-progress", "closed"], default: "open" },
  assignedTo: { type: String, default: "Unassigned" }
}, { timestamps: true });

export default mongoose.model("ConciergeEnquiry", conciergeEnquirySchema);