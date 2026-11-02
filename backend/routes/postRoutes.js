import express from 'express';
const router = express.Router();
import Post from '../models/Post.js'

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
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(201).json({ success: true, data: savedPost });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;