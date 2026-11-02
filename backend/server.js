import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from "./config/db.js";
import { initEventCronJob } from "./jobs/eventCronJob.js";

// Import Route Handlers
import placeRoutes from "./routes/placeRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import checkInRoutes from "./routes/checkInRoutes.js";
import interactionRoutes from "./routes/interactionRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import behaviorRoutes from "./routes/behaviorRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import businessRoutes from "./routes/businessRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import saveRoutes from "./routes/saveRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import claimRoutes from './routes/claimRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import flightRoutes from './routes/flightRoutes.js';
import shuttleRoutes from './routes/shuttleRoutes.js';
import conciergeRoutes from './routes/conciergeRoutes.js';
import amenityRoutes from './routes/amenityRoutes.js';
import accommodationRoutes from './routes/accommodationRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import travelContentRoutes from './routes/travelContentRoutes.js';
import postRoutes from './routes/postRoutes.js';
import Post from './models/Post.js';

dotenv.config();

// Connect to MongoDB
connectDB().catch((err) => {
  console.error("⚠️ Database connection error:", err.message);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Global Middlewares
app.use(cors());
app.use(express.json({ limit: "8mb" }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API Routes
app.use("/api/places", placeRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/checkins", checkInRoutes);
app.use("/api/interactions", interactionRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/behavior", behaviorRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/saves", saveRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/users", userRoutes);
app.use('/api/claims', claimRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/v1/flights", flightRoutes);
app.use("/api/v1/shuttles", shuttleRoutes);
app.use("/api/v1/concierge", conciergeRoutes);
app.use("/api/v1/amenities", amenityRoutes);
app.use("/api/v1/accommodations", accommodationRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/faqs", faqRoutes);
app.use("/api/v1/travel-content", travelContentRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
  res.send("Jos Pulse API Engine Running with Real-Time WebSockets... 🏔️");
});

initEventCronJob();

// Auto-seed initial demo posts into MongoDB if empty
async function seedInitialPosts() {
  try {
    const count = await Post.countDocuments();
    if (count === 0) {
      await Post.insertMany([
        {
          userName: "Alex Rivera",
          userAvatar: "/images/Alex Rivera.avif",
          location: "THE NET RAYFIELD",
          postText: "Weekend vibes in Rayfield. The weather is perfect tonight. 🍹 J-Town rocks!",
          postImage: "/images/The net bar.avif",
          likes: "1200",
          comments: "48",
        },
        {
          userName: "Jordan K.",
          userAvatar: "/images/Jordan K.avif",
          location: "CRISPAN SUITES",
          postText: "The party at Crispan is wild! Plateau state energy is unmatched. 🎧✨",
          postImage: "/images/Crispan Suites.avif",
          likes: "854",
          comments: "12",
        }
      ]);
      console.log("🌱 Initial demo posts seeded successfully into MongoDB.");
    }
  } catch (err) {
    console.error("Error seeding initial posts:", err);
  }
}
setTimeout(seedInitialPosts, 2000);

let activeUsersCount = 0;

// Real-time WebSockets Engine
io.on("connection", (socket) => {
  console.log(`⚡ [Real-time Engine] Client Connected: ${socket.id}`);
  
  // Track active explorers count
  activeUsersCount++;
  io.emit("active_explorers_count", activeUsersCount);

  // 1. Create Post
  socket.on("create_post", async (postData = {}, acknowledge) => {
    try {
      const postToSave = new Post({
        userName: postData.user || postData.userName || "Explorer",
        userAvatar: postData.userAvatar || "/images/John Doe.avif",
        location: postData.location || "Jos Central",
        postText: postData.content || postData.postText || "",
        postImage: postData.postImage || null,
      });

      const savedPost = await postToSave.save();

      const broadcastPayload = {
        id: savedPost._id.toString(),
        _id: savedPost._id.toString(),
        userName: savedPost.userName,
        userAvatar: savedPost.userAvatar,
        location: savedPost.location,
        postText: savedPost.postText,
        postImage: savedPost.postImage,
        postTime: "Just now",
        likes: savedPost.likes,
        comments: savedPost.comments,
      };

      io.emit("post_published", broadcastPayload);
      acknowledge?.({ success: true, post: broadcastPayload });
      console.log(`📡 [Live Feed] Post broadcasted by ${savedPost.userName}`);
    } catch (err) {
      console.error("Failed to persist post to MongoDB:", err);
      acknowledge?.({
        success: false,
        message: "Could not save your post. Please try again.",
      });
    }
  });

  // 2. Like Post
  socket.on("like_post", async (payload = {}, acknowledge) => {
    try {
      const { postId, userId } = payload;
      if (
        !/^[a-f\d]{24}$/i.test(postId || "") ||
        typeof userId !== "string" ||
        !userId ||
        userId.length > 120
      ) {
        acknowledge?.({ success: false, message: "Invalid post or user." });
        return;
      }

      const post = await Post.findById(postId);
      if (!post) {
        acknowledge?.({ success: false, message: "Post not found." });
        return;
      }

      const likedBy = Array.isArray(post.likedBy) ? post.likedBy : [];
      const alreadyLiked = likedBy.includes(userId);
      post.likedBy = alreadyLiked
        ? likedBy.filter((likedUserId) => likedUserId !== userId)
        : [...likedBy, userId];
      const currentLikes = Number.parseInt(post.likes, 10);
      post.likes = String(
        Math.max(0, (Number.isFinite(currentLikes) ? currentLikes : 0) + (alreadyLiked ? -1 : 1))
      );
      await post.save();
      io.emit("post_updated", {
        postId: post._id.toString(),
        likes: post.likes,
        comments: post.comments,
        likedBy: post.likedBy,
        commentItems: post.commentItems,
      });
      acknowledge?.({ success: true });
    } catch (err) {
      console.error("Error updating like:", err);
      acknowledge?.({ success: false, message: "Could not update this like." });
    }
  });

  // 3. Add Comment
  socket.on("add_comment", async (payload = {}, acknowledge) => {
    try {
      const { postId, userId, userName, userAvatar, commentText } = payload;
      const text = typeof commentText === "string" ? commentText.trim() : "";
      if (
        !/^[a-f\d]{24}$/i.test(postId || "") ||
        typeof userId !== "string" ||
        !userId ||
        userId.length > 120 ||
        !text ||
        text.length > 1000
      ) {
        acknowledge?.({ success: false, message: "Enter a comment of up to 1000 characters." });
        return;
      }

      const post = await Post.findById(postId);
      if (!post) {
        acknowledge?.({ success: false, message: "Post not found." });
        return;
      }

      post.commentItems.push({
        userId,
        userName:
          typeof userName === "string" && userName.trim()
            ? userName.trim().slice(0, 80)
            : "Explorer",
        userAvatar: typeof userAvatar === "string" ? userAvatar.slice(0, 500) : undefined,
        text,
      });
      const currentComments = Number.parseInt(post.comments, 10);
      post.comments = String(
        (Number.isFinite(currentComments) ? currentComments : 0) + 1
      );
      await post.save();
      io.emit("post_updated", {
        postId: post._id.toString(),
        likes: post.likes,
        comments: post.comments,
        likedBy: post.likedBy,
        commentItems: post.commentItems,
      });
      acknowledge?.({ success: true });
    } catch (err) {
      console.error("Error adding comment:", err);
      acknowledge?.({ success: false, message: "Could not publish your comment." });
    }
  });

  // Location room joining
  socket.on("join_location", (locationId) => {
    socket.join(`place_${locationId}`);
  });

  socket.on("send_behavior_update", (data) => {
    io.emit("behavior_updated", data);
  });

  socket.on("disconnect", () => {
    console.log(`❌ [Real-time Engine] Client Disconnected: ${socket.id}`);
    activeUsersCount = Math.max(0, activeUsersCount - 1);
    io.emit("active_explorers_count", activeUsersCount);
  });

  // Handle Real-Time Activity Broadcasting for Sidebar Ticker
  socket.on("log_activity", (activityData) => {
    const formattedLog = {
      _id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      eventType: activityData.eventType || "USER_ACTION",
      message: activityData.message || "New activity detected",
      createdAt: new Date().toISOString(),
    };

    // Broadcast to all active clients
    io.emit("realtime_behavior_logged", formattedLog);
  });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found - ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server executing in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});