const User = require("../models/User");
const bcrypt = require("bcryptjs");

const initAdmin = async () => {
  try {
    // Check if admin user already exists
    const adminExists = await User.findOne({ email: "admin@gmail.com" });

    if (!adminExists) {
      // Create admin user
      const hashedPassword = await bcrypt.hash("admin123", 10);
      
      const admin = await User.create({
        name: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin"
      });

      console.log("✅ Admin user created successfully!");
      console.log("   Email: admin@gmail.com");
      console.log("   Password: admin123");
      console.log("   Role: admin");
      console.log("   ID:", admin._id);
    } else {
      // Update existing admin user to ensure role and password are correct
      let needsUpdate = false;
      
      if (adminExists.role !== "admin") {
        adminExists.role = "admin";
        needsUpdate = true;
        console.log("⚠️  Admin role was incorrect, updating...");
      }
      
      // Verify password is correct
      const isPasswordCorrect = await bcrypt.compare("admin123", adminExists.password);
      if (!isPasswordCorrect) {
        adminExists.password = await bcrypt.hash("admin123", 10);
        needsUpdate = true;
        console.log("⚠️  Admin password was incorrect, updating...");
      }
      
      if (needsUpdate) {
        await adminExists.save();
        console.log("✅ Admin user updated successfully!");
      } else {
        console.log("✅ Admin user already exists and is correct");
      }
      
      console.log("   Email: admin@gmail.com");
      console.log("   Password: admin123");
      console.log("   Role:", adminExists.role);
      console.log("   ID:", adminExists._id);
    }
  } catch (error) {
    console.error("❌ Error initializing admin user:", error.message);
    console.error("Full error:", error);
  }
};

module.exports = initAdmin;
