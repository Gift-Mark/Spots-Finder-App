import mongoose from "mongoose";

const placeSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      default: "",
      maxLength: 6000,
    },
    category: {
      type: String,
      enum: [
        "restaurant",
        "nightlife",
        "nature",
        "culture",
        "festival",
        "sports",
        "golf",
        "landmark",
        "hotel",
        "cafe",
      ],
      index: true,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    openingTime: {
      type: String,
      trim: true,
    },
    closingTime: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"], // Tracks availability status
      default: "active",
    },
    summary: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    subcategory: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "",
    },
    address: { type: String, trim: true, maxlength: 300, default: "" },
    bookingUrl: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    tags: [{ type: String, trim: true, maxlength: 40 }],
    /* featured: { type: Boolean, default: false },
  promoted: { type: Boolean, default: false },
  sourceName: { type: String, trim: true, maxlength: 140, default: '' },
  sourceUrl: { type: String, trim: true, maxlength: 1000, default: '' },
  verifiedAt: { type: Date, default: null },
  status: { type: String, enum: ['draft','published','archived'], default: 'draft', index: true }, */
  },
  { timestamps: true },
);

const Place = mongoose.model("Place", placeSchema);

export default Place;
