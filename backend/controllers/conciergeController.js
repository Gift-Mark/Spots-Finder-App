import ConciergeEnquiry from "../models/ConciergeEnquiry.js";
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
      bookingReference
    });

    res.status(201).json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
};