const History = require("../models/History");
const mongoose = require("mongoose");
const User = require("../models/User");

// Controller: Get All Websites (Admin Only)
const getAllWebsites = async (req, res) => {
  try {
    const websites = await History.find().select("url name"); // Return only necessary fields
    res.status(200).json(websites);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Controller: Register Website
const registerWebsite = async (req, res) => {
  const { url, name } = req.body;
  try {
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
};

// Controller: Get User Websites
const getUserWebsites = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if `userId` is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    // Find websites saved by the user
    const websites = await History.find({ id: userId }).select("url name");

    if (!websites || websites.length === 0) {
      return res.status(404).json({ message: "No websites found for this user" });
    }

    res.status(200).json(websites);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getAllWebsites, registerWebsite, getUserWebsites };
