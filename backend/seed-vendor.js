// Backend/seed-vendor.js
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const VENDOR_EMAIL = (process.env.VENDOR_EMAIL || "vendor@jospulse.com").toLowerCase();
const VENDOR_PASSWORD = process.env.VENDOR_PASSWORD || "vendor123";

const seedVendor = async () => {
  try {
    await connectDB();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(VENDOR_PASSWORD, salt);

    let existing = await User.findOne({ email: VENDOR_EMAIL });
    
    if (existing) {
      existing.role = "business";
      existing.password = hashedPassword;
      await existing.save();
      console.log(`✔ Vendor account updated & password reset: ${VENDOR_EMAIL}`);
    } else {
      await User.create({
        firstName: "Rayfield",
        lastName: "Vendor",
        email: VENDOR_EMAIL,
        password: hashedPassword,
        role: "business",
      });
      console.log(`✔ Vendor account created: ${VENDOR_EMAIL}`);
    }

    console.log(`\n📧 Email: ${VENDOR_EMAIL}`);
    console.log(`🔑 Password: ${VENDOR_PASSWORD}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Vendor seeding failed:", error.message);
    process.exit(1);
  }
};

seedVendor();