const express = require("express");
const { scanWebsiteAndGeneratePDF } = require("../controllers/scanController");

const router = express.Router();

// Route for scanning websites
router.post("/", scanWebsiteAndGeneratePDF);

module.exports = router;
