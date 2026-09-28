// backend/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Place = require('./models/Place');
const { places } = require('./data/places.js');

dotenv.config();

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jospulse';
    await mongoose.connect(mongoUri);
    await Place.deleteMany();

    const formattedPlaces = places.map((item) => ({
      title: item.title || 'Untitled Place',
      section: item.section || 'tourist_spots',
      category: Array.isArray(item.category) ? item.category : ['General'],
      rating: Number(item.rating) || 0,
      reviewsCount: Number(item.reviewsCount) || 0,
      location: item.location || 'Jos, Plateau State',
      description: item.description || 'A notable destination in Jos, Plateau State.',
      image: item.image || '/images/default-place.jpg',
      badge: item.badge || 'Featured',
      badgeVariant: item.badgeVariant || 'green',
      price: item.price || 'Free',
      tags: Array.isArray(item.tags) ? item.tags : [],
      isPromoted: Boolean(item.isPromoted),
      ...item,
    }));

    await Place.insertMany(formattedPlaces);
    console.log('Database successfully seeded with local places.js data!');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDB();