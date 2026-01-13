const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

dotenv.config();

const verifyAndFixAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    // Check if admin exists
    let admin = await User.findOne({ email: "admin@gmail.com" });

    if (!admin) {
      console.log("❌ Admin user not found. Creating...");
      const hashedPassword = await bcrypt.hash("admin123", 10);
      admin = await User.create({
        name: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin"
      });
      console.log("✅ Admin user created!");
    } else {
      console.log("✅ Admin user found");
      
      // Check and fix role
      if (admin.role !== "admin") {
        console.log("⚠️  Admin role is incorrect. Fixing...");
        admin.role = "admin";
        await admin.save();
        console.log("✅ Admin role fixed!");
      } else {
        console.log("✅ Admin role is correct");
      }

      // Verify password
      const isPasswordCorrect = await bcrypt.compare("admin123", admin.password);
      if (!isPasswordCorrect) {
        console.log("⚠️  Admin password is incorrect. Updating...");
        admin.password = await bcrypt.hash("admin123", 10);
        await admin.save();
        console.log("✅ Admin password updated!");
      } else {
        console.log("✅ Admin password is correct");
      }
    }

    console.log("\n📋 Admin User Details:");
    console.log("   Email:", admin.email);
    console.log("   Role:", admin.role);
    console.log("   ID:", admin._id);
    console.log("\n✅ Admin verification complete!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

verifyAndFixAdmin();
