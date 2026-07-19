const express = require("express");
const router = express.Router();

// 1. Destructure the exact function handles exported from your payment controller
const {
  createRazorpayOrder,
  verifyPaymentSignature,
  getMyOrders,
  getAdminDashboardMetrics,
} = require("../controllers/paymentController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// 2. Mount validation parameters and verify handlers are valid functions
router.post("/checkout", protect, createRazorpayOrder);
router.post("/verify", protect, verifyPaymentSignature);
router.get("/myorders", protect, getMyOrders);
router.get("/admin/metrics", protect, adminOnly, getAdminDashboardMetrics);

module.exports = router;
