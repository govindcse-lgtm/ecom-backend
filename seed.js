require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Product = require("./models/Product");

// Sample real-world dummy product data
const dummyProducts = [
  {
    title: "Wireless Noise-Cancelling Headphones",
    description:
      "Premium over-ear headphones with active noise cancellation, 40-hour battery life, and crystal-clear sound quality for music enthusiasts.",
    price: 14999,
    images: ["https://unsplash.com"],
    category: "Electronics",
    stock: 25,
  },
  {
    title: "Minimalist Leather Backpack",
    description:
      "Water-resistant, genuine leather backpack featuring a 15-inch laptop compartment and ergonomic straps for ultimate daily comfort.",
    price: 4599,
    images: ["https://unsplash.com"],
    category: "Fashion",
    stock: 15,
  },
  {
    title: "Ergonomic Mechanical Keyboard",
    description:
      "RGB backlit mechanical keyboard with hot-swappable tactile switches and a premium aluminum frame for developers and gamers.",
    price: 7999,
    images: ["https://unsplash.com"],
    category: "Electronics",
    stock: 40,
  },
  {
    title: "Stainless Steel Insulated Water Bottle",
    description:
      "Double-walled vacuum insulated flask keeping drinks cold for 24 hours or hot for 12 hours. Sleek matte black finish.",
    price: 1299,
    images: ["https://unsplash.com"],
    category: "Home & Kitchen",
    stock: 100,
  },
  {
    title: "Smart Fitness Running Watch",
    description:
      "Track your workouts, heart rate, sleep cycles, and outdoor runs with built-in GPS and a lightweight vibrant AMOLED display.",
    price: 11499,
    images: ["https://unsplash.com"],
    category: "Electronics",
    stock: 30,
  },
];

const seedDatabase = async () => {
  try {
    // 1. Establish secure database connection
    await connectDB();

    // 2. Clear out any existing products to prevent massive duplication
    console.log("Clearing existing product collection...");
    await Product.deleteMany({});

    // 3. Insert the brand new array of items
    console.log("Inserting dummy product data...");
    await Product.insertMany(dummyProducts);

    console.log("🎉 Data successfully seeded into MongoDB Atlas!");
    process.exit(0); // Exit gracefully
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1); // Exit with error code
  }
};

// Fire the function execution
seedDatabase();
