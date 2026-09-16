import mongoose from "mongoose";

// Events are embedded because they belong only to their parent place.
const eventSchema = new mongoose.Schema(
  {
    title: String,
    date: String,
    time: String,
  },
  { _id: false }
);

const placeSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },

    section: String,

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
    },

    image: String,
    location: String,
    address: String,

    category: [String],

    rating: Number,
    reviews: Number,
    percent: String,

    open: String,
    close: String,
    phone: String,

    description: String,

    badgeClass: String,
    showMapButton: Boolean,

    latitude: Number,
    longitude: Number,

    gallery: [String],

    events: [eventSchema],
  },
  {
    timestamps: true,
  }
);

const Place = mongoose.model("Place", placeSchema);

export default Place;