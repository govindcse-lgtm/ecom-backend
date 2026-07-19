require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

const app = express();

// Initialize DB Cluster Connection
connectDB();

// Global Shield Security Middlewares
app.use(helmet());
app.use(cors());

// Rate Limiter configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many connections requested from this IP address network.",
  },
});
app.use("/api/", apiLimiter);

// Payload Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Core Routing Matrices
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));

// 404 Fallback
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Resource URL Not Found" }),
);

// Global Error Catch Barrier
app.use((err, req, res, next) => {
  console.error(`💥 Execution Fault Exception: ${err.message}`);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🔒 Production API Gateway online at port: ${PORT}`),
);
