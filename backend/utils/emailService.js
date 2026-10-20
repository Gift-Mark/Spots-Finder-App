import nodemailer from "nodemailer";

// Safely access process.env without throwing a ReferenceError in browser bundles
const getEnv = (key, fallback) => {
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key];
  }
  return fallback;
};

const transporter = nodemailer.createTransport({
  host: getEnv("EMAIL_HOST", "smtp.mailtrap.io"),
  port: Number(getEnv("EMAIL_PORT", 2525)),
  auth: {
    user: getEnv("EMAIL_USER", "your_user"),
    pass: getEnv("EMAIL_PASS", "your_password")
  }
});

export const sendConciergeNotification = async ({ name, email, phone, category, message, reference }) => {
  try {
    // 1. Email to Airport Concierge Team[cite: 5]
    await transporter.sendMail({
      from: '"Jos Pulse Portal" <noreply@jospulse.ng>',
      to: "concierge@jospulse.ng",
      subject: `🚨 New Concierge Request: [${reference}] - ${category}`,
      html: `
        <h3>New Airport Concierge Enquiry</h3>
        <p><strong>Reference:</strong> ${reference}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    });

    // 2. Acknowledgment Email to the Traveller[cite: 5]
    await transporter.sendMail({
      from: '"Jos Pulse Concierge" <concierge@jospulse.ng>',
      to: email,
      subject: `We've received your request (${reference}) - Jos Pulse`,
      html: `
        <h3>Hello ${name},</h3>
        <p>Thank you for reaching out to the Jos Pulse Airport Concierge team. We have received your inquiry regarding <strong>${category}</strong>.</p>
        <p>Your tracking reference is: <strong>${reference}</strong></p>
        <p>A concierge representative will review your details and get back to you shortly.</p>
        <br/>
        <p>Warm regards,<br/><strong>Jos Pulse Team</strong></p>
      `
    });

    console.log(`Concierge notification emails sent successfully for ref: ${reference}`);
  } catch (error) {
    console.error("Failed to send concierge notification email:", error);
  }
};