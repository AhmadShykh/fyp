const express = require("express");
const { subscribeUser, stripeWebhook, cancelSubscription } = require("../controllers/subscriptionController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// Route to subscribe user (Stripe Checkout)
router.post("/subscribe", authMiddleware, subscribeUser);

// Stripe Webhook to handle payment events
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

// Route to cancel subscription
router.post("/cancel", authMiddleware, cancelSubscription);

module.exports = router;
