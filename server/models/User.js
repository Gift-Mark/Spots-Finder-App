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
    //required:true,
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
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;