import User from "../models/User.js";
import SystemLog from "../models/SystemLog.js";
import VendorClaim from "../models/VendorClaim.js";
import FlaggedReport from "../models/FlaggedReport.js";
import Post from "../models/Post.js";
import path from "path";
import { vendorClaimUploadDir } from "../middleware/vendorClaimUploadMiddleware.js";

// @desc    Get all registered users for admin dashboard
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role (promote/demote)
// @route   PATCH /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { role }, 
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete user account
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get flagged content for admin moderation overview
// @route   GET /api/admin/flagged-content
// @access  Private/Admin
export const getFlaggedContent = async (req, res) => {
  try {
    const reports = await FlaggedReport.find({ status: "pending" })
      .populate("reporterId", "firstName lastName email")
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reviewFlaggedComment = async (req, res) => {
  try {
    const { action } = req.body;
    if (!["remove_comment", "dismiss"].includes(action)) {
      return res.status(400).json({ success: false, message: "Choose remove_comment or dismiss." });
    }

    const report = await FlaggedReport.findOne({ _id: req.params.id, status: "pending" });
    if (!report) {
      return res.status(404).json({ success: false, message: "Pending comment report not found." });
    }

    if (action === "remove_comment") {
      const post = await Post.findById(report.postId);
      if (post) {
        const commentExists = post.commentItems.some(
          (comment) => comment._id.toString() === report.commentId.toString()
        );
        if (commentExists) {
          post.commentItems.pull({ _id: report.commentId });
          const currentCount = Number.parseInt(post.comments, 10);
          post.comments = String(Math.max(0, (Number.isFinite(currentCount) ? currentCount : 1) - 1));
          await post.save();
          req.io?.emit("post_updated", {
            postId: post._id.toString(),
            likes: post.likes,
            comments: post.comments,
            likedBy: post.likedBy,
            commentItems: post.commentItems,
          });
        }
      }
    }

    if (action === "dismiss") {
      report.status = "ignored";
      await report.save();
    } else {
      await FlaggedReport.updateMany(
        { postId: report.postId, commentId: report.commentId, status: "pending" },
        { status: "resolved" }
      );
    }
    res.status(200).json({
      success: true,
      message: action === "dismiss" ? "Comment report dismissed." : "Reported comment removed.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVendorClaims = async (req, res) => {
  try {
    const claims = await VendorClaim.find({})
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({ success: true, count: claims.length, data: claims });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reviewVendorClaim = async (req, res) => {
  try {
    const { status, reviewNote = "" } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be approved or rejected." });
    }

    const claim = await VendorClaim.findOneAndUpdate(
      { _id: req.params.id, status: "pending" },
      { status, reviewNote: String(reviewNote).slice(0, 1000), reviewedAt: new Date() },
      { new: true, runValidators: true }
    ).populate("userId", "firstName lastName email");

    if (!claim) {
      return res.status(404).json({ success: false, message: "Pending vendor claim not found." });
    }

    if (status === "approved") {
      await User.findByIdAndUpdate(claim.userId._id || claim.userId, { role: "vendor" });
    }

    res.status(200).json({ success: true, data: claim });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVendorClaimDocument = async (req, res) => {
  try {
    const claim = await VendorClaim.findById(req.params.id).select("ownershipProof originalFileName fileMimeType");
    if (!claim) {
      return res.status(404).json({ success: false, message: "Vendor claim not found." });
    }

    res.setHeader("Content-Type", claim.fileMimeType);
    const safeFileName = path.basename(claim.originalFileName).replace(/["\\\r\n]/g, "_");
    res.setHeader("Content-Disposition", `inline; filename="${safeFileName}"`);
    res.sendFile(path.join(vendorClaimUploadDir, path.basename(claim.ownershipProof)), (error) => {
      if (error && !res.headersSent) {
        res.status(error.statusCode === 404 ? 404 : 500).json({
          success: false,
          message: error.statusCode === 404 ? "Uploaded document is missing." : "Could not open the uploaded document.",
        });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all ad campaigns for admin management
// @route   GET /api/admin/ads
// @access  Private/Admin
export const getAds = async (req, res) => {
  try {
    // Return empty array or query your Ads model if you have one created
    res.status(200).json({ success: true, count: 0, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new ad campaign
// @route   POST /api/admin/ads
// @access  Private/Admin
export const createAd = async (req, res) => {
  try {
    res.status(201).json({ success: true, message: "Ad created successfully", data: req.body });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete ad campaign
// @route   DELETE /api/admin/ads/:id
// @access  Private/Admin
export const deleteAd = async (req, res) => {
  try {
    res.status(200).json({ success: true, message: "Ad deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get system audit logs
// @route   GET /api/admin/logs
// @access  Private/Admin
export const getSystemLogs = async (req, res) => {
  try {
    const parsedLimit = Number.parseInt(req.query.limit, 10);
    const limit = Number.isFinite(parsedLimit)
      ? Math.min(Math.max(parsedLimit, 1), 500)
      : 200;
    const logs = await SystemLog.find({})
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();
    res.status(200).json({ success: true, count: logs.length, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clear system audit logs
// @route   DELETE /api/admin/logs
// @access  Private/Admin
export const clearSystemLogs = async (req, res) => {
  try {
    await SystemLog.deleteMany({});
    res.status(200).json({ success: true, message: "System logs cleared successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};