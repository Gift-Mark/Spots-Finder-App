import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

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

dotenv.config();

// Connect to MongoDB
connectDB().catch((err) => {
  console.error("⚠️ Database connection error:", err.message);
});

const app = express();

// Create HTTP server wrapping Express for Socket.io
const server = http.createServer(app);

// Initialize Socket.io with CORS settings
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach Socket.io instance to req so controllers can emit real-time updates
app.use((req, res, next) => {
  req.io = io;
  next();
});

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

// Root Endpoint
app.get("/", (req, res) => {
  res.send("Jos Pulse API Engine Running with Real-Time WebSockets... 🏔️");
});

// Start the Scoutsity Cron Scheduler
initEventCronJob();

// Real-time WebSockets Engine
io.on("connection", (socket) => {
  console.log(`⚡ [Real-time Engine] Client Connected: ${socket.id}`);

  // Client joins a specific location/place channel
  socket.on("join_location", (locationId) => {
    socket.join(`place_${locationId}`);
    console.log(`📍 Client ${socket.id} joined location channel: place_${locationId}`);
  });

  // Real-time behavior or check-in broadcasts
  socket.on("send_behavior_update", (data) => {
    io.emit("behavior_updated", data);
  });

  socket.on("disconnect", () => {
    console.log(`❌ [Real-time Engine] Client Disconnected: ${socket.id}`);
  });
});

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found - ${req.originalUrl}`,
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

// Listen on HTTP server (HTTP + Socket.io)
server.listen(PORT, () => {
  console.log(`🚀 Server executing in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
