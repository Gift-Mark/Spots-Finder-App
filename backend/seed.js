import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Import All 12 Models
import User from "./models/User.js"; 
import Place from "./models/Place.js";
import Event from "./models/Events.js";
import CheckIn from "./models/Checkins.js";
import Interaction from "./models/interactions.js";
import ChatbotMessage from "./models/chatbot.js";
import Campaign from "./models/Campaigns.js";
import Business from "./models/Businesses.js";
import Booking from "./models/Booking.js";
import BehaviorLog from "./models/BehaviorLog.js";
import Newsletter from "./models/Newsletter.js"; // Newsletter model
import Save from "./models/Save.js"; // Saved items model

dotenv.config();

const seedAllCollections = async () => {
  try {
    await connectDB();
    console.log("🌱 Starting complete collection initialization...");

    // 1. Seed User
    const sampleUser = await User.create({
      firstName: "Test",
      lastName: "User",
      email: `testuser_${Date.now()}@jospulse.com`,
      password: "password123",
      role: "user",
    });
    console.log("✔ Users collection initialized");

    // 2. Seed Business
    const sampleBusiness = await Business.create({
      ownerId: sampleUser._id,
      businessName: "Highland Bistro Jos",
      description: "Premier dining experience in Rayfield.",
      category: "Restaurant",
      address: "12 Rayfield Resort Road",
      city: "Jos",
      state: "Plateau",
      latitude: 9.8965,
      longitude: 8.8583,
      status: "active",
      verification: {
        status: "verified",
      },
    });
    console.log("✔ Businesses collection initialized");

    // 3. Seed Place
    const samplePlace = await Place.create({
      businessId: sampleBusiness._id,
      name: "Rayfield Resort",
      slug: `rayfield-resort-${Date.now()}`,
      category: "nature",
      description: "Scenic lakeside resort in Jos South.",
      summary: "A scenic lakeside resort in Jos South.",
      address: "Rayfield, Jos",
      latitude: 9.8402,
      longitude: 8.9103,
      status: "active",
    });
    console.log("✔ Places collection initialized");

    // 4. Seed Event
    const sampleEvent = await Event.create({
      placeId: samplePlace._id,
      title: "Jos Plateau Music & Cultural Festival",
      description: "Annual cultural celebration and music concert.",
      eventDate: new Date(Date.now() + 86400000 * 14),
      startTime: "16:00",
      endTime: "23:00",
      category: "Festival",
      ticketPrice: 2000,
      availableTickets: 500,
      slug: `jos-fest-${Date.now()}`,
      status: "upcoming",
      sourceUrl: "https://events.scoutsity.com/event/seed-demo",
      ticketUrl: "https://events.scoutsity.com/event/seed-demo",
    });
    console.log("✔ Events collection initialized");

    // 5. Seed CheckIn
    await CheckIn.create({
      userId: sampleUser._id,
      placeId: samplePlace._id,
      latitude: 9.8402,
      longitude: 8.9103,
      checkInTime: new Date(),
    });
    console.log("✔ CheckIns collection initialized");

    // 6. Seed Interaction
    await Interaction.create({
      userId: sampleUser._id,
      placeId: samplePlace._id,
      interactionType: "click",
      category: "Resort",
      timestamp: new Date(),
    });
    console.log("✔ Interactions collection initialized");

    // 7. Seed ChatbotMessage
    await ChatbotMessage.create({
      userId: sampleUser._id,
      sessionId: "seed_chat_session_01",
      message: "What are the best places to visit in Jos?",
      sender: "user",
      intent: "find_restaurant",
      timestamp: new Date(),
    });
    console.log("✔ ChatbotMessages collection initialized");

    // 8. Seed Campaign
    await Campaign.create({
      businessId: sampleBusiness._id,
      title: "Rayfield Weekend Special Promo",
      description: "20% discount on all family platters.",
      targetLocation: "Jos",
      targetCategory: "Restaurant",
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000 * 30),
      budget: 50000,
      status: "active",
    });
    console.log("✔ Campaigns collection initialized");

    // 9. Seed Booking
    await Booking.create({
      userId: sampleUser._id,
      bookingType: "Resort Ticket",
      provider: "Rayfield Resort",
      destination: "Jos South",
      bookingReference: `JOS-SEED-${Math.floor(1000 + Math.random() * 9000)}`,
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000),
      amount: 15000,
      paymentStatus: "paid",
      status: "confirmed",
    });
    console.log("✔ Bookings collection initialized");

    // 10. Seed BehaviorLog
    await BehaviorLog.create({
      sessionId: "seed_behavior_session_01",
      eventType: "VENUE_VIEW",
      payload: { placeId: samplePlace._id, category: "Resort" },
      timestamp: new Date(),
    });
    console.log("✔ BehaviorLogs collection initialized");

    // 11. Seed Newsletter subscriber
    await Newsletter.create({
      email: `subscriber_${Date.now()}@jospulse.com`,
      subscriptionStatus: "subscribed",
    });
    console.log("✔ Subscribers collection initialized");

    // 12. Seed Save
    await Save.create({
      userId: sampleUser._id,
      placeId: samplePlace._id,
    });
    console.log("✔ Saves collection initialized");

    console.log("\n🚀 Success! All 12 collections populated in MongoDB.");
    console.log("Open MongoDB Compass and click Refresh (Cmd+R / Ctrl+R) to view them!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedAllCollections();
