const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const historyRoutes = require("./routes/historyRoutes");
const scanRoutes = require("./routes/scanRoutes");

const cookieParser = require('cookie-parser');


dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/secure-auth")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/history/functions/" , historyRoutes);
app.use("/api/scan", scanRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
