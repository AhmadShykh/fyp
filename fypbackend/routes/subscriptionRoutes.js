const express = require("express");
const { subscribeUser, stripeWebhook, cancelSubscription } = require("../controllers/subscriptionController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Route to subscribe user (Stripe Checkout)
router.post("/subscribe", authenticateToken, subscribeUser);

// Stripe Webhook to handle payment events
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

// Route to cancel subscription
router.post("/cancel", authenticateToken, cancelSubscription);

module.exports = router;
