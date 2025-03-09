const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, "url is required"],
    trim: true,
  },
  id: {
    type: String,
    required: [true, "User Id is required"],
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
});


module.exports = mongoose.model("History", UserSchema);
