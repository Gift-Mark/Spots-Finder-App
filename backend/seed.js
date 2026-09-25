// backend/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Place = require('./models/Place');
const { places } = require('./data/place'); // Standard import from local data

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Place.deleteMany();
    
    // Map existing array items onto schema fields safely
    const formattedPlaces = places.map((item) => ({
      ...item,
      location: item.location || 'Jos, Plateau State',
      badge: item.badge || 'Featured',
      badgeVariant: item.badgeVariant || 'green',
      price: item.price || 'Free',
    }));

    await Place.insertMany(formattedPlaces);
    console.log('Database successfully seeded with local place.js data!');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDB();