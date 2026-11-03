import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import VendorClaim from '../models/VendorClaim.js';
import upload from '../middleware/vendorClaimUploadMiddleware.js';

const router = express.Router();

// 2. Claim & Business Account Registration Endpoint
router.post('/register', upload.single('ownershipProof'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'A proof-of-ownership document is required.',
      });
    }

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

    const claim = await VendorClaim.create({
      userId: newUser._id,
      businessName,
      category,
      address,
      ownerName,
      email,
      phone,
      ownershipProof: req.file.filename,
      originalFileName: req.file.originalname,
      fileMimeType: req.file.mimetype,
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
      claimId: claim._id,
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