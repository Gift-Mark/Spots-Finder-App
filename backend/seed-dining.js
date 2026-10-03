const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Place = require('./models/Place');
const { diningPlaces } = require('./data/diningPlaces');

dotenv.config();

const seedDining = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jospulse';
    await mongoose.connect(mongoUri);

    await Place.bulkWrite(
      diningPlaces.map((place) => ({
        updateOne: {
          filter: { section: 'dining', title: place.title },
          update: { $set: place },
          upsert: true,
        },
      }))
    );

    console.log(`Seeded ${diningPlaces.length} dining places without replacing other places.`);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Dining seed failed:', error);
    await mongoose.disconnect();
    process.exitCode = 1;
  }
};

seedDining();