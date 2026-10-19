import request from "supertest";
import mongoose from "mongoose";
import app from "../App.js";
import Airport from "../models/Airport.js";
import Route from "../models/Route.js";
import ShuttleBooking from "../models/ShuttleBooking.js";

beforeAll(async () => {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/jospulse_test";
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("JosPulse Flights & Shuttle API Tests", () => {
  test("GET /api/v1/flights/airports returns active airports", async () => {
    await Airport.create({ name: "Yakubu Gowon", iataCode: "JOS", city: "Jos", state: "Plateau" });
    const res = await request(app).get("/api/v1/flights/airports");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test("POST /api/v1/shuttles/bookings creates a verified shuttle booking", async () => {
    const payload = {
      customerName: "Nanven Gofwan",
      email: "nanven@jospulse.ng",
      phone: "+2348030000000",
      pickupLocation: "Yakubu Gowon Airport (JOS)",
      destination: "Rayfield Resort Zone",
      pickupDateTime: new Date(Date.now() + 86400000).toISOString(),
      passengerCount: 2
    };

    const res = await request(app).post("/api/v1/shuttles/bookings").send(payload);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.reference).toBeDefined();
    expect(res.body.data.fareAmount).toBe(15000); // 7500 * 2
  });

  test("GET /api/v1/shuttles/bookings/:reference securely retrieves booking", async () => {
    const booking = await ShuttleBooking.create({
      reference: "JOS-TEST-REF",
      customerName: "Test User",
      email: "test@jospulse.ng",
      phone: "+2348000000000",
      pickupLocation: "JOS Airport",
      pickupDateTime: new Date(),
      passengerCount: 1,
      fareAmount: 7500
    });

    const res = await request(app).get(`/api/v1/shuttles/bookings/${booking.reference}`);
    expect(res.status).toBe(200);
    expect(res.body.data.customerName).toBe("Test User");
  });
});