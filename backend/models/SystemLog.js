import mongoose from "mongoose";

const systemLogSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      enum: ["info", "warning", "error"],
      required: true,
      index: true,
    },
    action: { type: String, required: true },
    method: { type: String, required: true },
    endpoint: { type: String, required: true },
    statusCode: { type: Number, required: true },
    message: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    durationMs: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

systemLogSchema.index({ timestamp: -1 });

export default mongoose.model("SystemLog", systemLogSchema);
