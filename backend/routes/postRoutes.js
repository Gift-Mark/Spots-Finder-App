import express from 'express';
const router = express.Router();
import mongoose from 'mongoose';
import Post from '../models/Post.js'
import FlaggedReport from '../models/FlaggedReport.js';
import { protect } from '../middleware/authMiddleware.js';

// GET /api/posts - Fetch all posts (sorted by newest first)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/posts - Save a new post to the database
router.post("/", async (req, res) => {
  try {
    const newPost = new Post({ ...req.body, userId: null });
    const savedPost = await newPost.save();
    res.status(201).json({ success: true, data: savedPost });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid post id." });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found." });
    }

    if (post.userId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You can only delete your own posts." });
    }

    await post.deleteOne();
    req.io.emit("post_deleted", { postId: post._id.toString() });
    res.status(200).json({ success: true, message: "Post deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/:postId/comments/:commentId/report", protect, async (req, res) => {
  try {
    if (
      !mongoose.isValidObjectId(req.params.postId) ||
      !mongoose.isValidObjectId(req.params.commentId)
    ) {
      return res.status(400).json({ success: false, message: "Invalid post or comment id." });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found." });
    }

    const comment = post.commentItems.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found." });
    }

    const reason = typeof req.body.reason === "string" ? req.body.reason.trim().slice(0, 300) : "";
    if (!reason) {
      return res.status(400).json({ success: false, message: "A report reason is required." });
    }

    const report = await FlaggedReport.create({
      postId: post._id,
      commentId: comment._id,
      reporterId: req.user._id,
      reporterName: `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim() || "Community member",
      contentSnippet: comment.text,
      reason,
    });
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "You have already reported this comment." });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;