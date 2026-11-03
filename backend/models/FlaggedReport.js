import mongoose from "mongoose";

const flaggedReportSchema = new mongoose.Schema(
  {
    contentType: { type: String, enum: ["Comment"], default: "Comment", index: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    commentId: { type: mongoose.Schema.Types.ObjectId, required: true },
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reporterName: { type: String, trim: true, default: "Community member" },
    contentSnippet: { type: String, required: true, maxlength: 1000 },
    reason: { type: String, required: true, trim: true, maxlength: 300 },
    status: {
      type: String,
      enum: ["pending", "resolved", "ignored"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

flaggedReportSchema.index(
  { postId: 1, commentId: 1, reporterId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "pending" } }
);

export default mongoose.model("FlaggedReport", flaggedReportSchema);
