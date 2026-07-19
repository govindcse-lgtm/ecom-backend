const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
    },
    images: [
      {
        type: String, // Ensures it accepts a simple array of URL strings
      },
    ],
    category: {
      type: String,
      required: [true, "Product category is required"],
    },
    stock: {
      type: Number,
      required: [true, "Product stock count is required"],
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", ProductSchema);
