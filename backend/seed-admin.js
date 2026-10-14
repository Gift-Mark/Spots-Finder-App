import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

// Credentials can be overridden from .env (SUPERADMIN_EMAIL / SUPERADMIN_PASSWORD)
// so the real password never has to live in code.
const ADMIN_EMAIL = (process.env.SUPERADMIN_EMAIL || "superadmin@jospulse.com").toLowerCase();
const ADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD || "SuperAdmin@123";
const ADMIN_FIRST_NAME = process.env.SUPERADMIN_FIRST_NAME || "Super";
const ADMIN_LAST_NAME = process.env.SUPERADMIN_LAST_NAME || "Admin";

const seedSuperAdmin = async () => {
  try {
    await connectDB();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    // Idempotent: create the admin, or promote/reset an existing account.
    let existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      existing.role = "admin";
      existing.password = hashedPassword;
      existing.firstName = ADMIN_FIRST_NAME;
      existing.lastName = ADMIN_LAST_NAME;
      await existing.save();
      console.log(`✔ Existing account updated and promoted to admin: ${ADMIN_EMAIL}`);
    } else {
      await User.create({
        firstName: ADMIN_FIRST_NAME,
        lastName: ADMIN_LAST_NAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
      });
      console.log(`✔ Superadmin created: ${ADMIN_EMAIL}`);
    }

    console.log("\n🔐 Superadmin credentials");
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log("\nLog in at /login — admins are redirected straight to the SuperAdmin dashboard (/SuperAdmin).");
    process.exit(0);
  } catch (error) {
    console.error("❌ Superadmin seeding failed:", error.message);
    process.exit(1);
  }
};

seedSuperAdmin();
