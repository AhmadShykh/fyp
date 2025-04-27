const express = require("express");
const { scanWebsiteAndGeneratePDF } = require("../controllers/scanController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Route for scanning websites
router.post("/", authenticateToken,scanWebsiteAndGeneratePDF);

module.exports = router;
