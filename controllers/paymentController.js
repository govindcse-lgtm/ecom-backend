const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const Product = require("../models/Product");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Create Order Controller
exports.createRazorpayOrder = async (req, res, next) => {
  const { amount, items, shippingAddress } = req.body;
  // 💡 Diagnostic Check: Verify that the JWT token is being decoded successfully
  console.log(
    "👤 BACKEND RECIEVED CHECKOUT REQUEST FROM USER ID:",
    req.user?._id,
  );
  console.log("📦 PAYLOAD INCOMING DATA:", { amount, items, shippingAddress });
  try {
    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const rzpOrder = await razorpay.orders.create(options);

    const structuredOrderItems = items.map((item) => ({
      product: item.product,
      name: item.name,
      qty: Number(item.qty),
      image: item.image,
      price: Number(item.price),
    }));

    const newOrder = await Order.create({
      user: req.user.id,
      orderItems: structuredOrderItems,
      shippingAddress: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country || "India",
      },
      razorpayOrderId: rzpOrder.id,
      totalPrice: amount,
    });

    res.status(201).json({ success: true, rzpOrder, orderId: newOrder._id });
  } catch (error) {
    next(error);
  }
};

// 2. Verify Payment Signature Controller (The missing piece causing your crash)
exports.verifyPaymentSignature = async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  try {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Transaction signature mismatch!" });
    }

    const targetOrder = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
    });
    if (!targetOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order reference map missing" });
    }

    if (targetOrder.paymentStatus === "Paid") {
      return res.json({
        success: true,
        message: "Payment already updated previously",
      });
    }

    // Secure Stock Management Loop
    for (const item of targetOrder.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty },
      });
    }

    targetOrder.paymentStatus = "Paid";
    await targetOrder.save();

    res.json({
      success: true,
      message: "Payment successfully captured, inventory stock decremented!",
    });
  } catch (error) {
    next(error);
  }
};

// 3. Get User Orders Controller
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort("-createdAt");
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// 4. Get Admin Analytics Metrics Controller
exports.getAdminDashboardMetrics = async (req, res, next) => {
  try {
    const metrics = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
          totalSalesVolume: { $sum: 1 },
        },
      },
    ]);

    const result = metrics[0] || { totalRevenue: 0, totalSalesVolume: 0 };
    res.json({
      success: true,
      revenue: result.totalRevenue,
      totalOrders: result.totalSalesVolume,
    });
  } catch (error) {
    next(error);
  }
};
