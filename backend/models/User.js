// backend/models/User.js
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'business', 'admin'], default: 'user' },
  subscription: {
    status: { type: String, enum: ['inactive', 'active'], default: 'inactive' },
    plan: { type: String, enum: ['free', 'annual_tier'], default: 'free' },
    expiresAt: Date
  },
  ownedPlaces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Place' }]
});