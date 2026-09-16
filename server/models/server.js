import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Place from "./models/Place.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Extract and verify the bearer token before protected handlers run.
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Authentication alone is not enough; place-management routes require admin role.
const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin rights required." });
    }
    next();
  } catch {
    res.status(500).json({ message: "Authorization check failed" });
  }
};

// --- AUTH ROUTES ---
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    res.status(500).json({ message: "Could not log in." });
  }
});

// --- PUBLIC PLACE ROUTES ---
app.get("/api/places", async (req, res) => {
  try {
    const places = await Place.find().sort({ id: -1 });
    res.json(places);
  } catch {
    res.status(500).json({ message: "Could not get places" });
  }
});

app.get("/api/places/:id", async (req, res) => {
  try {
    const place = await Place.findOne({
      $or: [{ slug: req.params.id }, { id: req.params.id }],
    });
    if (!place) return res.status(404).json({ message: "Place not found" });
    res.json(place);
  } catch {
    res.status(500).json({ message: "Could not get place" });
  }
});

// --- PROTECTED ADMIN PLACE ROUTES ---

// Create Place
app.post("/api/places", authMiddleware, adminOnly, async (req, res) => {
  try {
    // Seed data uses numeric ids, so new records continue that sequence.
    const nextId = (await Place.countDocuments()) + 1;
    const newPlace = new Place({ ...req.body, id: nextId });
    await newPlace.save();
    res.status(201).json(newPlace);
  } catch (error) {
    res.status(400).json({ message: "Failed to create spot", error: error.message });
  }
});

// Update Place
app.put("/api/places/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const updated = await Place.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { id: req.params.id }] },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Spot not found" });
    res.json(updated);
  } catch {
    res.status(400).json({ message: "Failed to update spot" });
  }
});

// Delete Place
app.delete("/api/places/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const deleted = await Place.findOneAndDelete({
      $or: [{ _id: req.params.id }, { id: req.params.id }],
    });
    if (!deleted) return res.status(404).json({ message: "Spot not found" });
    res.json({ message: "Spot deleted successfully" });
  } catch {
    res.status(500).json({ message: "Failed to delete spot" });
  }
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(PORT, () => console.log(`Jos Pulse API running on port ${PORT}`));
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
}

startServer();