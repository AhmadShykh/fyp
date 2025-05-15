const express = require("express");
const {
  signup,
  login,
  logout,
  getUserData,
} = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", authenticateToken, getUserData);

module.exports = router;
