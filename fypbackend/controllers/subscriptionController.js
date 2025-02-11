const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/User");

// Subscribe User (Create Checkout Session)
exports.subscribeUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { plan } = req.body; // "basic", "advanced", "premium"
    let priceId;

    if (plan === "basic") {
      priceId = process.env.PRICE_ID_BASIC; // Free plan (No Stripe Checkout)
      user.subscription = { plan: "basic", status: "active", expiresAt: null };
      await user.save();
      return res.status(200).json({ message: "Subscribed to Basic (Free) Plan", user });
    } else if (plan === "advanced") {
      priceId = process.env.PRICE_ID_ADVANCED;
    } else if (plan === "premium") {
      priceId = process.env.PRICE_ID_PREMIUM;
    } else {
      return res.status(400).json({ message: "Invalid subscription plan" });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ message: "Error subscribing", error: error.message });
  }
};

// Stripe Webhook to Handle Payment Events
exports.stripeWebhook = async (req, res) => {
  let event;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], endpointSecret);
  } catch (err) {
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const user = await User.findOne({ email: session.customer_email });

    if (user) {
      user.subscription = {
        plan: session.amount_total === parseInt(process.env.ADVANCED_PRICE) ? "advanced" : "premium",
        status: "active",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        stripeSubscriptionId: session.subscription,
      };
      await user.save();
    }
  }

  res.json({ received: true });
};

// Cancel Subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.subscription?.stripeSubscriptionId) {
      return res.status(400).json({ message: "No active subscription found" });
    }

    // Cancel Subscription in Stripe
    await stripe.subscriptions.del(user.subscription.stripeSubscriptionId);

    user.subscription = { plan: "free", status: "cancelled", expiresAt: null, stripeSubscriptionId: null };
    await user.save();

    res.status(200).json({ message: "Subscription cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling subscription", error: error.message });
  }
};
