import mongoose from "mongoose";
import process from "node:process";
import "dotenv/config";

import Place from "./models/Place.js";
import places from "./data/places.js";

// Replace the collection contents with the local fixture data for development.

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await Place.bulkWrite(
      places.map((place) => ({
        updateOne: {
          filter: { slug: place.slug },
          update: { $set: place },
          upsert: true,
        },
      }))
    );

    console.log("Places added to MongoDB");
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();