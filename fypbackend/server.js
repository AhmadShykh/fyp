const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const historyRoutes = require("./routes/historyRoutes");
const scanRoutes = require("./routes/scanRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes.js");

const cookieParser = require('cookie-parser');


dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/history/functions/" , historyRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/subscription", subscriptionRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
