const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, pathNext) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      return pathNext();
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, token failed" });
    }
  }
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }
};

exports.adminOnly = (req, res, pathNext) => {
  if (req.user && req.user.role === "admin") {
    pathNext();
  } else {
    res
      .status(403)
      .json({ success: false, message: "Access denied: Admin resource" });
  }
};
