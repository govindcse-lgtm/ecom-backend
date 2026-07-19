const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", protect, adminOnly, upload.array("images", 5), createProduct);

module.exports = router;
