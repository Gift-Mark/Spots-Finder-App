import mongoose from "mongoose";

const highlightSchema = new mongoose.Schema(
  {
    icon: { type: String, default: "✨" },
    title: { type: String, trim: true },
    desc: { type: String, trim: true },
  },
  { _id: false }
);

const addonSchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String },
    price: { type: Number, default: 0 },
  },
  { _id: false }
);

const pricingSchema = new mongoose.Schema(
  {
    adultRate: { type: Number, default: 0 },
    kidRate: { type: Number, default: 0 },
    addons: [addonSchema],
  },
  { _id: false }
);

const placeSchema = new mongoose.Schema(
  {
    // --- Core identity ---
    name: { type: String, required: true, trim: true, maxlength: 140 },
    title: { type: String, trim: true }, // alias for name used by UI
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },

    // --- Description & content ---
    summary: { type: String, trim: true, maxlength: 500, default: "" },
    description: { type: mongoose.Schema.Types.Mixed, default: [] }, // Array<string> or string
    overviewHeading: { type: String, trim: true, default: "" },

    // --- Taxonomy ---
    category: {
      type: String,
      enum: [
        "restaurant", "nightlife", "nature", "culture", "festival",
        "sports", "golf", "landmark", "hotel", "cafe", "resort", "other",
        'Restaurant & Dining', 
    'Hotel & Resort', 
    'Golf & Sports Club', 
    'Lounge & Nightlife', 
    'Event Center & Arena', // <--- Add this here
    'Leisure',
    'Historical'
      ],
      index: true,
      required: true,
    },
    subcategory: { type: String, trim: true, maxlength: 80, default: "" },
    tags: [{ type: String, trim: true, maxlength: 40 }],
    badge: { type: String, trim: true, default: "" }, // display badge on card

    // --- Media ---
    heroImage: { type: String, trim: true, default: "" },
    coverImage: { type: String, trim: true, default: "" }, // alias
    gallery: [{ type: String }],
    images: [{ type: String }],

    // --- Location ---
    location: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, maxlength: 300, default: "" },
    latitude: { type: Number, default: 9.9085 },
    longitude: { type: Number, default: 8.8921 },

    // --- Ratings & reviews ---
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0, min: 0 },

    // --- Operations ---
    openingHours: { type: String, trim: true, default: "" },
    openingTime: { type: String, trim: true, default: "" },
    closingTime: { type: String, trim: true, default: "" },
    status: { type: String, enum: ["active", "inactive", "maintenance"], default: "active" },
    displayStatus: { type: String, trim: true, default: "Open Now" }, // "Open Now" / "Closed"
    recommendedVisit: { type: String, trim: true, default: "" },

    // --- Pricing ---
    entryPrice: { type: String, trim: true, default: "Free Admission" }, // display string
    entryFee: { type: Number, default: 0 }, // numeric
    pricing: { type: pricingSchema, default: () => ({}) },

    // --- Contact ---
    phone: { type: String, trim: true, default: "" },
    bookingUrl: { type: String, trim: true, maxlength: 1000, default: "" },

    // --- Extras ---
    verified: { type: Boolean, default: false },
    managedBy: { type: String, trim: true, default: "" },
    quote: {
      text: { type: String, trim: true, default: "" },
      author: { type: String, trim: true, default: "" },
    },
    highlights: [highlightSchema],
    visitorTips: [{ type: String }],
    weather: {
      temp: { type: Number, default: 21 },
      condition: { type: String, default: "Pleasant" },
    },

    // --- Relationships ---
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },

    // --- Section tag (for promoted/events sections) ---
    section: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

// Allow querying by title as well as name
placeSchema.index({ name: "text", summary: "text", description: "text" });

const Place = mongoose.model("Place", placeSchema);
export default Place;
