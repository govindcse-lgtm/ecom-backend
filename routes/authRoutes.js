const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/authController");
const {
  validateRegister,
  validateLogin,
} = require("../middleware/validateMiddleware");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
router.get("/profile", protect, getUserProfile); // Verification Route

module.exports = router;
