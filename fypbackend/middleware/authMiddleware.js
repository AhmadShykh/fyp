const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.cookies?.accessToken; // Get the token from cookies
  if (!token)
    return res.status(401).json({ message: "Access Denied. No Token Provided." });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.error("Error verifying token:", err); // Log the error for debugging
    res.status(403).json({ message: "Invalid Token" });
  }
};

// Admin Authorization Middleware
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied. Admins Only." });
  }
  next();
};

// Rate Limiter Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests. Please try again later.",
});

module.exports = { authenticateToken, authorizeAdmin, limiter };
