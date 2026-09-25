const mongoose = require('mongoose');
const env = require('../src/config/env');
const Place = require('../src/models/Place');
const Event = require('../src/models/Event');
const { places } = require('../src/data/places');

const slugify = (value) => value.normalize('NFKD').toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/[\s-]+/g, '-');
const monthNumber = { JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6, JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12 };
const sourceName = 'Existing Spots Finder places.js import';

async function seed() {
  await mongoose.connect(env.mongoUri);
  const placeRows = places.filter((item) => item.section !== 'events');
  const eventRows = places.filter((item) => item.section === 'events');

  for (const item of placeRows) {
    const labels = Array.isArray(item.category) ? item.category : [item.category];
    const category = labels.includes('Sports') ? 'sports' : labels.includes('Cultural Landmarks') ? 'landmark' : labels.includes('Culture') || labels.includes('Heritage') ? 'culture' : 'nature';
    const numericRating = Number(item.rating);
    const numericReviews = Number(item.reviewsCount);
    await Place.updateOne({ slug: slugify(item.title) }, { $set: {
      name: item.title,
      slug: slugify(item.title),
      legacyId: item.id,
      summary: String(item.description || item.title).slice(0, 500),
      description: item.description || '',
      category,
      subcategory: labels.filter((label) => !['Sports','Cultural Landmarks','Culture','Heritage'].includes(label)).join(', '),
      sports: category === 'sports' ? labels.filter((label) => label.toLowerCase() !== 'sports') : [],
      images: item.image ? [item.image] : [],
      rating: Number.isFinite(numericRating) ? numericRating : 0,
      reviewCount: Number.isFinite(numericReviews) ? numericReviews : 0,
      tags: labels,
      sourceName,
      status: 'draft',
      verifiedAt: null,
    } }, { upsert: true, runValidators: true });
  }

  for (const item of eventRows) {
    const month = monthNumber[String(item.month || '').toUpperCase()] || null;
    const day = Number.parseInt(item.day, 10) || null;
    await Event.updateOne({ slug: slugify(item.title) }, { $set: {
      name: item.title,
      slug: slugify(item.title),
      legacyId: item.id,
      summary: `Festival listing at ${item.location || 'a Jos-area venue'}. Verify the event date and details before publishing.`,
      category: 'festival',
      dateLabel: [item.month, item.day].filter(Boolean).join(' '),
      recurrenceMonth: month,
      recurrenceDay: day,
      venueName: item.location || '',
      imageUrl: item.image || '',
      priceAmount: item.price === 'Free' ? 0 : null,
      sourceName,
      status: 'draft',
    } }, { upsert: true, runValidators: true });
  }

  console.log(`Imported ${placeRows.length} draft places and ${eventRows.length} draft festivals. Verify content, image paths, and event years before publishing.`);
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error('Import failed:', error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
