import mongoose from "mongoose";

// Account fields shared by registration, login, and admin authorization.
const userSchema = new mongoose.Schema(
  {
    firstName: {
    type: String,
    required: true,
    trim: true,
  },
  middleName: {
    type:String,
    trim:true,
  },
  lastName: {
  type: String,
  required: true,
  trim: true,
},
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "business", "admin"],
      default: "user",
    },
    profileImage: {
      type: String,
      required: false,
      default: ''
    },
    locationPermission: {
      type: Boolean,
    default: false
    },
     latitude: {
    type: Number,
    default: null
  },
  longitude: {
    type: Number,
    default: null
  }
  },
  {
    timestamps: true,
  }
);

// Create a geospatial index so you can search users by distance later
userSchema.index({ location: '2dsphere' });

const User = mongoose.model("User", userSchema);

export default User;