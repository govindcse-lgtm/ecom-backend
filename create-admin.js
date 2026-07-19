require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

const createAdminAccount = async () => {
  // Define your secure master admin credentials here
  const adminEmail = "admin@myecom.com";
  const adminPassword = "SuperSecureAdminPassword123!"; // Make this very strong
  const adminName = "Master Admin";

  try {
    await connectDB();

    // Check if admin already exists
    const adminExists = await User.findOne({ email: adminEmail });
    if (adminExists) {
      console.log(
        "⚠️ An administrator account with this email already exists!",
      );
      process.exit(0);
    }

    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Securely force insert the record with admin privileges
    await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "admin", // Forced server-side bypass
    });

    console.log("\n=======================================================");
    console.log("🎉 SUCCESS! Admin account created securely.");
    console.log("=======================================================");
    console.log(`📧 Email:    ${adminEmail}`);
    console.log(`🔒 Password: ${adminPassword}`);
    console.log("=======================================================\n");

    process.exit(0);
  } catch (error) {
    console.error(`❌ Failed to create admin: ${error.message}`);
    process.exit(1);
  }
};

createAdminAccount();
