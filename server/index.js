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

// Parse JSON requests and allow the Vite frontend to call this API locally.
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Jos Pulse API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

// Get all places from MongoDB
app.get("/api/places", async (req, res) => {
  try {
    // Keep the public list ordered by the stable seed id.
    const places = await Place.find().sort({ id: 1 });

    res.json(places);
  } catch (error) {
    console.error("Could not get places:", error.message);
    res.status(500).json({
      message: "Could not get places",
    });
  }
});

// Get one place using its slug
app.get("/api/places/:slug", async (req, res) => {
  try {
    const place = await Place.findOne({
      slug: req.params.slug,
    });

    if (!place) {
      return res.status(404).json({
        message: "Place not found",
      });
    }

    res.json(place);
  } catch (error) {
    console.error("Could not get this place:", error.message);
    res.status(500).json({
      message: "Could not get this place",
    });
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    // Validate before hashing or writing so incomplete accounts never reach MongoDB.
    const { firstName,lastName,middleName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "First name, last name, email, and password are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters.",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      middleName,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // The token identifies the new account for subsequent protected requests.
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Account created successfully.",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration failed:", error.message);

    res.status(500).json({
      message: "Could not create account.",
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password.",
      });
    }

    // Compare against the hash; the plain-text password is never stored.
    const passwordIsCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordIsCorrect) {
      return res.status(401).json({
        message: "Incorrect email or password.",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
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
        middleName: user.middleName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login failed:", error.message);

    res.status(500).json({
      message: "Could not log in.",
    });
  }
});

async function startServer() {
  try {
    // Start accepting requests only after the database connection is ready.
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(
        `Jos Pulse API running at http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
  }
}

startServer();