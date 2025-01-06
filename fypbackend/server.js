const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const historyRoutes = require("./routes/historyRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/secure-auth")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/history/functions/" , historyRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
