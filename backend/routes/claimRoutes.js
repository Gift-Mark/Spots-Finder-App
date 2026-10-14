import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Ensure 'uploads' directory exists programmatically
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 1. Configure Multer for handling file uploads (ownershipProof)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure an 'uploads' directory exists in /Backend
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// 2. Claim & Business Account Registration Endpoint
router.post('/register', upload.single('ownershipProof'), async (req, res) => {
  try {
    const {
      businessName,
      category,
      address,
      ownerName,
      email,
      phone,
      password,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email?.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user account with this email already exists.',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Split names safely
    const nameParts = ownerName ? ownerName.trim().split(' ') : ['Owner'];
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || 'Manager';

    // Create business user account in MongoDB
    const newUser = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'business',
    });

    // Create JWT Token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    // 3. Return 201 Created with JSON payload (Fixes 204 No Content error)
    return res.status(201).json({
      success: true,
      message: 'Venue claim submitted and account created successfully!',
      token,
      claimStatus: 'pending',
      user: {
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        businessName: businessName,
        accountStatus: 'confirmed',
      },
    });
  } catch (error) {
    console.error('Claim Venue Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error processing venue claim.',
    });
  }
});

export default router;