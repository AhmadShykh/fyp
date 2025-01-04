const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
require("dotenv").config();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Register User
router.post("/signup", async (req, res) => {
  const { name, email, contact, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Include isAdmin as false for all new users
    const user = new User({ 
      name, 
      email, 
      contact, 
      password, 
      isAdmin: false // Default to non-admin user
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Determine role based on isAdmin field
    const role = user.isAdmin ? "admin" : "user";

    // Include role in the token payload
    const token = jwt.sign({ id: user._id, role }, JWT_SECRET, { expiresIn: "1h" });

    // Set token as an HTTP-only cookie
    res.cookie("accessToken", token, {
      httpOnly: true, // Prevent access from JavaScript
      secure: process.env.NODE_ENV === "development", // Use secure cookies in production
      sameSite: "strict", // Prevent cross-site request forgery (CSRF)
      maxAge: 3600000, // 1 hour in milliseconds
    });

    res.status(200).json({ 
      message: "Login successful", 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        contact: user.contact, 
        role 
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
