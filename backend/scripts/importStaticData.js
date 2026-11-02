import mongoose from 'mongoose';
import Place from '../models/Place.js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from backend/.env
config({ path: join(__dirname, '..', '.env') });

// Import static data files
import { JOS_BARS_DIRECTORY } from '../data/barsData.js';
import { TOURIST_SPOTS } from '../data/attractionsData.js';
import { JOS_CLUBS } from '../data/clubsData.js';
import { JOS_LATE_NIGHT_EATS } from '../data/lateNightEats.js';
import { JOS_LIVE_MUSIC_GARDENS } from '../data/LiveMusicData.js';

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Helper function to create slug from name
const createSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Helper function to map category to section
const getCategorySection = (category) => {
  const catLower = category?.toLowerCase() || '';
  
  const categoryMap = {
    'restaurant': 'dining',
    'dining': 'dining',
    'cafe': 'dining',
    'hotel': 'stays',
    'resort': 'stays',
    'accommodation': 'stays',
    'lounge': 'nightlife',
    'bar': 'nightlife',
    'club': 'nightlife',
    'nightlife': 'nightlife',
    'music': 'nightlife',
    'live music': 'nightlife',
    'event': 'events',
    'golf': 'golf',
    'sports': 'golf',
    'culture': 'culture',
    'landmark': 'culture',
    'museum': 'culture',
    'attraction': 'attractions',
    'nature': 'attractions',
  };

  for (const [key, section] of Object.entries(categoryMap)) {
    if (catLower.includes(key)) {
      return section;
    }
  }

  return 'explore';
};

// Import function
const importData = async () => {
  try {
    await connectDB();

    console.log('\n📦 Starting data import...\n');

    // Combine all data arrays
    const allData = [
      ...(TOURIST_SPOTS || []).map(v => ({ ...v, category: 'nature', dataSource: 'attractionsData.js' })),
      ...(JOS_BARS_DIRECTORY || []).map(v => ({ ...v, category: 'nightlife', dataSource: 'barsData.js' })),
      ...(JOS_CLUBS || []).map(v => ({ ...v, category: 'Lounge & Nightlife', dataSource: 'clubsData.js' })),
      ...(JOS_LATE_NIGHT_EATS || []).map(v => ({ ...v, category: 'Restaurant & Dining', dataSource: 'lateNightEats.js' })),
      ...(JOS_LIVE_MUSIC_GARDENS || []).map(v => ({ ...v, category: 'Lounge & Nightlife', dataSource: 'LiveMusicData.js' })),
    ];

    console.log(`📊 Total venues to import: ${allData.length}`);

    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const venue of allData) {
      try {
        const slug = createSlug(venue.name || venue.title || '');
        
        // Check if venue already exists
        const existing = await Place.findOne({ slug });
        
        if (existing) {
          console.log(`⏭️  Skipped: ${venue.name} (already exists)`);
          skippedCount++;
          continue;
        }

        // Prepare venue data
        const venueData = {
          name: venue.name || venue.title,
          title: venue.name || venue.title,
          slug,
          description: venue.description || venue.vibe || venue.summary || `Visit ${venue.name} - ${venue.category}`,
          summary: venue.summary || venue.vibe || venue.description?.slice(0, 150) || `${venue.name} in Jos`,
          category: venue.category || venue.subCategory || 'General',
          subcategory: venue.subcategory || venue.subCategory || '',
          section: getCategorySection(venue.category),
          location: venue.location || venue.neighborhood || venue.address || 'Jos, Plateau State',
          address: venue.address || venue.location || 'Jos, Plateau State',
          latitude: venue.latitude || 9.9085,
          longitude: venue.longitude || 8.8921,
          heroImage: venue.heroImage || venue.image || venue.imageUrl || '/images/default-venue.jpg',
          coverImage: venue.coverImage || venue.image || venue.imageUrl || '/images/default-venue.jpg',
          images: venue.images || [venue.heroImage || venue.image || '/images/default-venue.jpg'],
          rating: venue.rating || 0,
          reviewsCount: venue.reviewsCount || 0,
          openingHours: venue.openingHours || '',
          openingTime: venue.openingTime || '',
          closingTime: venue.closingTime || '',
          phone: venue.phone || '',
          status: 'active',
          displayStatus: venue.displayStatus || 'Open Now',
          entryPrice: venue.entryPrice || venue.priceRange || 'Free Admission',
          priceRange: venue.priceRange || '₦₦',
          tags: venue.tags || venue.popularFor || [],
          verified: venue.verified || false,
          managedBy: venue.managedBy || '',
          visitorTips: venue.visitorTips || '',
        };

        // Create new venue
        await Place.create(venueData);
        console.log(`✅ Imported: ${venue.name} → /${venueData.section}`);
        importedCount++;

      } catch (err) {
        console.error(`❌ Error importing ${venue.name}:`, err.message);
        errorCount++;
      }
    }

    console.log('\n📊 Import Summary:');
    console.log(`   ✅ Imported: ${importedCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📦 Total: ${allData.length}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
};

// Run import
importData();
