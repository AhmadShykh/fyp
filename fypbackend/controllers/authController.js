const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Controller: User Signup
const signup = async (req, res) => {
  const { name, email, contact, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

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
};

// Controller: User Login
const login = async (req, res) => {
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

    const role = user.isAdmin ? "admin" : "user";

    const token = jwt.sign({ id: user._id, role }, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.status(200).json({ 
      message: "Login successful", 
      user: { id: user._id, name: user.name, email: user.email, contact: user.contact, role } 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { signup, login };
