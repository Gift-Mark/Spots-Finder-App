import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "node:path";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import User from "./models/User.js";
import Place from "./models/Place.js";
import Claim from "./models/Claim.js";

const app = express();
const PORT = process.env.PORT || 5000;
const proofDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), "uploads", "venue-proofs");
const allowedProofTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);
const claimProofUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!allowedProofTypes.has(file.mimetype)) {
      return callback(new Error("Proof must be a PDF, JPG, or PNG file."));
    }
    callback(null, true);
  },
});

const parseClaimProof = (req, res, next) => {
  claimProofUpload.single("ownershipProof")(req, res, (error) => {
    if (error) return res.status(400).json({ message: error.message || "Could not process proof upload." });
    next();
  });
};

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

app.post("/api/claims/register", parseClaimProof, async (req, res) => {
  let createdUser;
  let savedProofPath;

  try {
    const businessName = String(req.body.businessName || "").trim();
    const category = String(req.body.category || "").trim();
    const address = String(req.body.address || "").trim();
    const ownerName = String(req.body.ownerName || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const phone = String(req.body.phone || "").trim();
    const password = String(req.body.password || "");
    const proof = req.file;

    if (!businessName || !category || !address || !ownerName || !email || !phone || !password || !proof) {
      return res.status(400).json({ message: "Complete all business, owner, account, and proof fields." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Enter a valid business email address." });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "An account already exists for this email. Sign in before claiming a venue." });
    }

    const ownerNameParts = ownerName.split(/\s+/);
    const firstName = ownerNameParts.shift();
    const lastName = ownerNameParts.join(" ") || firstName;
    const passwordHash = await bcrypt.hash(password, 12);

    await mkdir(proofDirectory, { recursive: true });
    const proofExtension = { "application/pdf": ".pdf", "image/jpeg": ".jpg", "image/png": ".png" }[proof.mimetype];
    const proofStorageName = `${randomUUID()}${proofExtension}`;
    savedProofPath = path.join(proofDirectory, proofStorageName);
    await writeFile(savedProofPath, proof.buffer, { flag: "wx" });

    createdUser = await User.create({
      firstName,
      lastName,
      email,
      password: passwordHash,
      role: "business",
      accountStatus: "confirmed",
      businessName,
    });

    const claim = await Claim.create({
      userId: createdUser._id,
      businessName,
      category,
      address,
      ownerName,
      email,
      phone,
      proofFileName: path.basename(proof.originalname),
      proofStorageName,
      proofMimeType: proof.mimetype,
      proofSize: proof.size,
      status: "pending_review",
    });

    const token = process.env.JWT_SECRET
      ? jwt.sign({ userId: createdUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
      : null;
    return res.status(201).json({
      message: "Business account confirmed. Your venue claim was submitted for ownership review.",
      token,
      claimStatus: claim.status,
      user: {
        id: createdUser._id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email,
        role: createdUser.role,
        accountStatus: createdUser.accountStatus,
        businessName: createdUser.businessName,
      },
    });
  } catch (error) {
    if (createdUser) await User.deleteOne({ _id: createdUser._id }).catch(() => {});
    if (savedProofPath) await unlink(savedProofPath).catch(() => {});
    console.error("Venue claim registration failed:", error.message);
    return res.status(500).json({ message: "Could not submit the venue claim. Please try again." });
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
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/jospulse";
    await mongoose.connect(mongoUri);

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