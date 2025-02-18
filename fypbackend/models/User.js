const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const SubscriptionSchema = new mongoose.Schema({
  plan: {
    type: String,
    enum: ["basic", "advanced", "premium"],
    default: "basic", // Default plan is free
  },
  status: {
    type: String,
    enum: ["active", "cancelled"],
    default: "active",
  },
  expiresAt: {
    type: Date,
    default: null, // No expiration for the free plan
  },
  stripeSubscriptionId: {
    type: String,
    default: null, // Will be populated for paid plans
  },
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Please provide a valid email"],
  },
  contact: {
    type: String,
    required: [true, "Contact is required"],
    match: [/^\d{10}$/, "Contact must be a valid 10-digit number"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  isAdmin: {
    type: Boolean,
    default: false, // Default value for new users
  },
  subscription: {
    type: SubscriptionSchema,
    default: () => ({ plan: "basic", status: "active" }), // Default to free plan
  },
});

// Hash the password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
