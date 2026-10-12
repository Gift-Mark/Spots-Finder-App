/**
 * Seed Script — populates the MongoDB `places` collection
 * with the spots shown on the Discover page.
 *
 * Run: node backend/seed/seedPlaces.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

import Place from "../models/Place.js";

const places = [
  {
    name: "Rayfield Holiday Resort & Water Park",
    title: "Rayfield Holiday Resort & Water Park",
    slug: "rayfield-resort",
    category: "resort",
    subcategory: "water sports",
    summary: "A beloved lakeside resort nestled in the historic suburb of Rayfield, Jos.",
    description: [
      "Tucked away inside the historic suburb of Rayfield, Jos, the Rayfield Holiday Resort stands as one of Plateau State's most cherished recreation treasures.",
      "With its shimmering lake, powerboat rides, jet ski rentals, and lakeside grill, it's the perfect family getaway.",
    ],
    overviewHeading: "An Oasis of Waters & Granite Hills",
    heroImage: "/images/Rayfield resort 3.webp",
    coverImage: "/images/Rayfield resort 3.webp",
    gallery: [
      "/images/Rayfield Resort.jpg",
      "/images/Rayfield resort 1.webp",
      "/images/Rayfield Resort 2.webp",
      "/images/Rayfield resort 3.webp",
    ],
    location: "Rayfield, Jos South",
    address: "Rayfield Resort Boulevard, Old Airport Road Axis, Jos South, Plateau State",
    latitude: 9.8547,
    longitude: 8.8612,
    rating: 4.8,
    reviewsCount: 132,
    verified: true,
    managedBy: "Plateau Tourism Authority & Partner",
    displayStatus: "Open Now",
    openingHours: "8:00 AM - 6:30 PM",
    entryPrice: "₦500 Adults / ₦300 Kids",
    entryFee: 500,
    recommendedVisit: "4:00 PM - 6:30 PM (Golden Hour Sunset)",
    phone: "+234 703 123 4567",
    tags: ["Family Friendly", "Boating & Water Sports", "Outdoor Dining"],
    badge: "Resort & Water Sports",
    pricing: { adultRate: 500, kidRate: 300, addons: [{ id: "cruise", name: "30-Min Lake Cruise", price: 2000 }] },
    highlights: [
      { icon: "🚤", title: "30-Min Lake Cruise", desc: "Guided powerboat and pontoon rides around Rayfield Lake." },
      { icon: "🏖️", title: "Waterfront Cabanas", desc: "Private shaded lakeside huts for family picnics & social groups." },
      { icon: "🍽️", title: "Lakeside Grill & Bar", desc: "Fresh suya, grilled fish, chapman drinks, and local dining." },
      { icon: "🅿️", title: "Secured Vehicle Parking", desc: "Monitored parking bay with on-site security." },
      { icon: "🏄", title: "Jet Ski Rentals", desc: "High-speed water sport rentals for thrill seekers." },
      { icon: "🎡", title: "Children's Play Zone", desc: "Dedicated slides, swings, and safe recreation lawns." },
    ],
    visitorTips: [
      "Bring a Light Cardigan for cool evening winds.",
      "Lifejackets are mandatory for all boat rides.",
    ],
    quote: {
      text: "There is no sunset in Jos quite like watching the gold rays bounce off the granite hills and reflect across Rayfield Lake.",
      author: "JOS PULSE GUIDE",
    },
    weather: { temp: 22, condition: "Crisp & Breezy" },
    section: "recommended",
  },
  {
    name: "Kurra Falls & Hydro-Power Eco Sanctuary",
    title: "Kurra Falls & Hydro-Power Eco Sanctuary",
    slug: "kurra-falls",
    category: "nature",
    subcategory: "waterfall",
    summary: "Multi-tiered natural waterfalls plunging through rugged granite canyons in Barkin Ladi.",
    description: [
      "Nestled deep within the lush green highlands of Barkin Ladi, Kurra Falls is one of Plateau State's most breathtaking natural wonders.",
      "The area features natural lakes, cascading waterfalls plunging through rugged granite canyons, and serene forest paths ideal for daytime hiking and photography.",
    ],
    overviewHeading: "Cascading Waters & Granite Canyons",
    heroImage: "/images/Kurra-Falls.jpg",
    coverImage: "/images/Kurra-Falls.jpg",
    gallery: ["/images/Kurra-Falls.jpg", "/images/Rayfield Resort.jpg"],
    location: "Barkin Ladi, Plateau State",
    address: "Gashish District, Barkin Ladi LGA, Plateau State, Nigeria",
    latitude: 9.5333,
    longitude: 8.9,
    rating: 4.9,
    reviewsCount: 98,
    verified: true,
    managedBy: "Plateau State Tourism Board & NESCO Partner",
    displayStatus: "Open Daily",
    openingHours: "7:00 AM - 5:30 PM",
    entryPrice: "₦1,000 Adults / ₦500 Students",
    entryFee: 1000,
    recommendedVisit: "10:00 AM - 3:30 PM (Daytime Trekking)",
    phone: "+234 802 345 6789",
    tags: ["Waterfall Treks", "Eco-Tourism", "Historic Dam", "Scenic Hiking"],
    badge: "Nature & Adventure",
    pricing: { adultRate: 1000, kidRate: 500, addons: [{ id: "guided-trek", name: "Guided Canyon Trek", price: 2500 }] },
    highlights: [
      { icon: "🌊", title: "Cascading Waterfalls", desc: "Multi-tiered natural rock waterfalls." },
      { icon: "🥾", title: "Guided Canyon Trails", desc: "Marked routes across granite formations." },
      { icon: "📸", title: "Scenic Photography Ledges", desc: "Unmatched vantage points for nature photography." },
      { icon: "⚡", title: "Historic Hydro Dam View", desc: "Heritage hydro-electricity installations." },
    ],
    visitorTips: [
      "Sturdy Footwear Required: Rock surfaces near streams can be slippery.",
      "Group Excursions: Hire a local guide at the gate for waterfall canyon hikes.",
    ],
    quote: {
      text: "Standing atop the granite ledges at Kurra Falls while mist from the roaring cascades cools the air is the quintessential Plateau adventure.",
      author: "JOS PULSE ECO-DISCOVERY GUIDE",
    },
    weather: { temp: 19, condition: "Cool & Highland Breeze" },
    section: "recommended",
  },
  {
    name: "Jos National Museum & Complex",
    title: "Jos National Museum & Complex",
    slug: "jos-museum",
    category: "culture",
    subcategory: "heritage",
    summary: "One of the oldest museums in West Africa, home to ancient Nok terracotta artifacts.",
    description: [
      "Established in 1952 by Bernard Fagg, the Jos Museum stands as one of the oldest and most historic museum institutions in West Africa. Famous for its priceless collection of ancient Nok terracotta heads and pottery artifacts dating back to 500 BC.",
      "The compound also houses the Museum of Traditional Nigerian Architecture (MOTNA), featuring life-sized replicas of historic palaces and mosques from Kano, Zaria, and Benin City.",
    ],
    overviewHeading: "Nigeria's Pioneer Museum of Ancient Pottery & Nok Art",
    heroImage: "/images/Jos Museum.jpg",
    coverImage: "/images/Jos Museum.jpg",
    gallery: ["/images/Jos Museum.jpg"],
    location: "Jos City Centre",
    address: "Museum Hill, Jos City Centre, Jos North LGA, Plateau State",
    latitude: 9.9218,
    longitude: 8.8906,
    rating: 4.5,
    reviewsCount: 19,
    verified: true,
    managedBy: "National Commission for Museums and Monuments",
    displayStatus: "Open Daily",
    openingHours: "9:00 AM - 5:00 PM",
    entryPrice: "₦500 Adults / ₦200 Students",
    entryFee: 500,
    recommendedVisit: "10:00 AM - 1:00 PM",
    phone: "+234 700 000 0000",
    tags: ["Nok Terracotta", "Architectural Museum", "Heritage Exhibits", "Family Friendly"],
    badge: "Heritage & Culture",
    pricing: { adultRate: 500, kidRate: 200, addons: [{ id: "guide", name: "Guided Heritage Tour", price: 1000 }] },
    highlights: [
      { icon: "🏺", title: "Nok Terracotta Vaults", desc: "Centuries-old ancient pottery artifacts." },
      { icon: "🏛️", title: "MOTNA Architecture Park", desc: "Full-sized replica structures of pre-colonial Nigeria." },
      { icon: "🎧", title: "Audio Guided Tours", desc: "Curated historical narrative headsets." },
    ],
    visitorTips: [
      "Visit in the morning for cooler temperatures.",
      "Photography is allowed in outdoor areas; ask staff about indoor rules.",
    ],
    weather: { temp: 21, condition: "Pleasant" },
    section: "recommended",
  },
  {
    name: "Tasty Fingers Restaurant",
    title: "Tasty Fingers Restaurant",
    slug: "tasty-fingers",
    category: "restaurant",
    subcategory: "fine dining",
    summary: "Modern fine dining blending African flavors with international continental dishes and panoramic Jos views.",
    description: [
      "Tasty Fingers Restaurant offers a modern culinary experience blending African flavors with international continental dishes. Situated at an elevated vantage point, guests enjoy sweeping panoramic night views of Jos while dining in a relaxed atmosphere.",
    ],
    overviewHeading: "Fine Dining with Panoramic Views of Jos",
    heroImage: "/images/Tasty Fingers.webp",
    coverImage: "/images/Tasty Fingers.webp",
    gallery: ["/images/Tasty Fingers.webp"],
    location: "Rayfield Road Axis",
    address: "Rayfield Road Axis, Jos South, Plateau State",
    latitude: 9.8601,
    longitude: 8.8677,
    rating: 4.6,
    reviewsCount: 45,
    verified: true,
    managedBy: "Tasty Fingers Culinary Group",
    displayStatus: "Open Now",
    openingHours: "10:00 AM - 10:30 PM",
    entryPrice: "Free Admission / Pay per Order",
    entryFee: 0,
    recommendedVisit: "6:00 PM - 9:30 PM (Dinner & City Skyline View)",
    phone: "+234 812 345 6789",
    tags: ["Fine Dining", "City View", "Grill & Continental", "Bar & Lounge"],
    badge: "Dining & Fine Cuisine",
    pricing: {
      adultRate: 0,
      kidRate: 0,
      addons: [
        { id: "vip-table", name: "VIP Window Table Reservation", price: 5000 },
        { id: "chapman", name: "Welcome Drink (Special Chapman)", price: 1500 },
      ],
    },
    highlights: [
      { icon: "🍷", title: "VIP Window Seating", desc: "Tables overlooking the Jos skyline." },
      { icon: "🥩", title: "Continental & Local Grill", desc: "Premium steaks, suya platters, and seafood." },
      { icon: "🍹", title: "Signature Cocktail Lounge", desc: "Handcrafted mocktails, chapman, and drinks." },
    ],
    visitorTips: [
      "Book a VIP window table in advance for weekend evenings.",
      "Pair the grilled fish with the house chapman for the full experience.",
    ],
    weather: { temp: 23, condition: "Pleasant" },
    section: "recommended",
  },
];

async function seedPlaces() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hotspots");
    console.log("✅ MongoDB connected for seeding...");

    // Clear existing place records to avoid duplicates
    await Place.deleteMany({});
    console.log("🗑️  Cleared existing places collection.");

    const inserted = await Place.insertMany(places);
    console.log(`🌱 Seeded ${inserted.length} places successfully!`);

    inserted.forEach((p) => console.log(`   ↳ ${p.name}  [/${p.slug}]`));
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected.");
  }
}

seedPlaces();
