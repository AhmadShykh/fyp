const express = require("express");
const { authenticateToken, authorizeAdmin, limiter } = require("../middleware/authMiddleware");
const { getAllWebsites, registerWebsite, getUserWebsites } = require("../controllers/historyController");
const router = express.Router();

router.get("/getallwebsites", limiter, authenticateToken, authorizeAdmin, getAllWebsites);
router.post("/registerWebsite", authenticateToken, registerWebsite);
router.get("/getUserWebsites", authenticateToken, getUserWebsites);

module.exports = router;