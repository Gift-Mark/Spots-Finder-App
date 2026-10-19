import express from "express";
import cors from "cors";
import helmet from "helmet";

 //Import your existing routes here (e.g., auth, places, bookings, etc.)
 import authRoutes from "./routes/authRoutes.js";
 import placeRoutes from "./routes/placeRoutes.js";
 import bookingRoutes from "./routes/bookingRoutes.js";

 //Import the new JosPulse flight & shuttle routes
import flightRoutes from "./routes/flightRoutes.js";
import shuttleRoutes from "./routes/shuttleRoutes.js";
import amenityRoutes from "./routes/amenityRoutes.js";
import conciergeRoutes from "./routes/conciergeRoutes.js";

import accommodationRoutes from './routes/accommodationRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import travelContentRoutes from './routes/travelContentRoutes.js';

const app = express();

app.use(helmet());
app.use(cors({ 
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173", 
  credentials: true 
}));
app.use(express.json());

// --- MOUNT EXISTING ROUTES ---
 app.use("/api/auth", authRoutes);
 app.use("/api/places", placeRoutes);
 app.use("/api/bookings", bookingRoutes);

// --- MOUNT NEW FLIGHTS & LOGISTICS API ROUTES (/api/v1) ---
app.use("/api/v1/flights", flightRoutes);
app.use("/api/v1/shuttles", shuttleRoutes);
app.use("/api/v1/amenities", amenityRoutes);
app.use("/api/v1/concierge", conciergeRoutes);

// Mount routes under /api/v1
app.use('/api/v1/accommodations', accommodationRoutes);
app.use('/api/v1/accommodation-zones', accommodationRoutes); // or separate zone route if desired
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/faqs', faqRoutes);
app.use('/api/v1/travel-content', travelContentRoutes);

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: err.message || "An unexpected error occurred."
    }
  });
});

export default app;