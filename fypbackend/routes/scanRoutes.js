const express = require("express");
const { scanWebsite } = require("../controllers/scanController");

const router = express.Router();

// Route for scanning websites
router.post("/", scanWebsite);

module.exports = router;
    