import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    placeId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Place", 
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    eventDate: {
      type: Date, // Stores the specific date of the event
      required: true,
    },
    startTime: {
      type: String, // e.g., "19:00" or "07:00 PM"
      required: true,
      trim: true,
    },
    endTime: {
      type: String, // e.g., "22:00" or "10:00 PM"
      required: true,
      trim: true,
    },
    category: {
      type: String, // e.g., 'Concert', 'Workshop', 'Networking'
      required: true,
      trim: true,
    },
    image: {
      type: String, // Single image URL or file path for the event banner
      default: "",
    },
    ticketPrice: {
      type: Number,
      required: true,
      min: 0, // Enforces that prices cannot be negative (0 means it's a free event)
    },
    availableTickets: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    recurrenceMonth: {
      type: Number,
      min: 1,
      max: 12,
      default: null,
    },
    recurrenceDay: {
      type: Number,
      min: 1,
      max: 31,
      default: null,
    },
    currency: {
      type: String,
      uppercase: true,
      default: "NGN",
      minlength: 3,
      maxlength: 6,
    },
    ticketUrl: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    organizer: {
      type: String,
      trim: true,
      maxlength: 160,
      default: "",
    },
    sourceUrl: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
  },
  { timestamps: true },
);
schema.index({
  name: "text",
  summary: "text",
  description: "text",
  venueName: "text",
});
schema.index({ status: 1, startsAt: 1, category: 1 });


const Event = mongoose.model("Event", EventSchema);

export default Event;
