const express = require("express");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const History = require("../models/History");
const User = require("../models/User"); // Assuming User model is required for `/registerWebsite`
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const router = express.Router();

require("dotenv").config();

// Middleware to authenticate JWT from cookies
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

// Middleware to authorize admins
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied. Admins Only." });
  }
  next();
};

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests. Please try again later.",
});

// Get All Websites - Secure
router.get(
  "/getallwebsites",
  limiter,
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const websites = await History.find().select("url name"); // Return only necessary fields
      res.status(200).json(websites);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Register Website
router.post("/registerWebsite", authenticateToken, async (req, res) => {
  const { url, name } = req.body;

  try {
    // Get user ID from token
    const userId = req.user.id;

    // Check if `userId` is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    // Find user by MongoDB `_id` to verify existence
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // Save website to history
    const website = new History({ url, id: userId, name });
    await website.save();

    res.status(201).json({ message: "Website registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
