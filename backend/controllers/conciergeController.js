import ConciergeEnquiry from "../models/ConciergeEnquiry.js";
import { sendConciergeNotification } from "../utils/emailService.js";
import crypto from "crypto";

export const submitEnquiry = async (req, res, next) => {
  try {
    const { name, email, phone, category, message, bookingReference } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Name, email and message are required." } });
    }

    const reference = `JOS-CON-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
    const enquiry = await ConciergeEnquiry.create({
      reference,
      name,
      email,
      phone,
      category: category || "General Air Support",
      message,
      bookingReference,
      status: "open",
      assignedTo: "Unassigned"
    });

    // 📧 Trigger automated notifications asynchronously
    sendConciergeNotification({ name, email, phone, category: enquiry.category, message, reference });

    res.status(201).json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
};

// 👉 Retrieve enquiries for admin view (with optional status filter)
export const getConciergeEnquiries = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const enquiries = await ConciergeEnquiry.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries
    });
  } catch (error) {
    next(error);
  }
};

// 👉 Add this function to update enquiry status and assignment
export const updateConciergeStatus = async (req, res, next) => {
  try {
    const { reference } = req.params;
    const { status, assignedTo } = req.body;

    // Validate status if provided
    if (status && !["open", "in-progress", "closed"].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        error: { code: "VALIDATION_ERROR", message: "Invalid status value. Must be open, in-progress, or closed." } 
      });
    }

    const updatedEnquiry = await ConciergeEnquiry.findOneAndUpdate(
      { reference },
      { 
        ...(status && { status }),
        ...(assignedTo && { assignedTo })
      },
      { new: true, runValidators: true }
    );

    if (!updatedEnquiry) {
      return res.status(404).json({ 
        success: false, 
        error: { code: "NOT_FOUND", message: "Enquiry reference not found." } 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Enquiry updated successfully", 
      data: updatedEnquiry 
    });
  } catch (error) {
    next(error);
  }
};