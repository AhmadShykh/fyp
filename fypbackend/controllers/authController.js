const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET ;

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
      expires: new Date(Date.now() + 3600000),
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

// Controller: User Logout
const logout = (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Middleware to check if user is logged in
const getUserData = async (req, res, next) => {
  try {
    const user = req.user;
    
    res.status(200).json({ 
      message: "Login successful", 
      user: { id: user.id, name: user.name, email: user.email, contact: user.contact,role: user.role,subsPlan:user.subscription } 
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token. Please log in again." });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};



module.exports = { signup, login, logout ,getUserData };
