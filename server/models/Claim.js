import mongoose from "mongoose";

const claimSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    businessName: { type: String, required: true, trim: true, maxlength: 160 },
    category: { type: String, required: true, trim: true, maxlength: 100 },
    address: { type: String, required: true, trim: true, maxlength: 300 },
    ownerName: { type: String, required: true, trim: true, maxlength: 160 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true, maxlength: 40 },
    proofFileName: { type: String, required: true, trim: true },
    proofStorageName: { type: String, required: true, trim: true },
    proofMimeType: { type: String, required: true, trim: true },
    proofSize: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ["pending_review", "approved", "rejected"], default: "pending_review" },
  },
  { timestamps: true }
);

export default mongoose.model("Claim", claimSchema);