const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/User");

// Subscribe User (Create Checkout Session)
exports.subscribeUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { plan } = req.body; // "basic", "advanced", "premium"

    // Check if the user is already subscribed to the selected plan
    if (
      user.subscription?.plan === plan &&
      user.subscription?.status === "active"
    ) {
      return res
        .status(200)
        .json({ message: `You are already subscribed to the ${plan} plan.` });
    }

    let priceId;

    if (plan === "basic") {
      if (
        user.subscription?.plan != "basic" &&
        user.subscription?.status === "active" &&
        user.subscription?.stripeSubscriptionId
      ) {
        // Cancel the existing subscription before assigning the new one
        try {
          await stripe.subscriptions.cancel(
            user.subscription.stripeSubscriptionId
          );
        } catch (error) {
          console.error(
            "Error canceling previous subscription:",
            error.message
          );
        }
      }
      priceId = process.env.PRICE_ID_BASIC; // Free plan (No Stripe Checkout)
      user.subscription = { plan: "basic", status: "active", expiresAt: null };
      await user.save();
      // Check if user already has an active subscription (other than the new one)
      
      return res
        .status(200)
        .json({ message: "Subscribed to Basic (Free) Plan", user });
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
    res
      .status(500)
      .json({ message: "Error subscribing", error: error.message });
  }
};

// Stripe Webhook to Handle Payment Events
exports.stripeWebhook = async (req, res) => {
  let event;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      endpointSecret
    );
  } catch (err) {
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const subscriptionId = session.subscription; // Subscription ID from Stripe
    const customerEmail = session.customer_email;

    if (!subscriptionId) {
      return res
        .status(400)
        .json({ message: "No subscription ID found in session" });
    }

    // Retrieve the full subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    if (!subscription || !subscription.items.data.length) {
      return res
        .status(400)
        .json({ message: "Failed to fetch subscription details" });
    }

    // Get the Price ID of the subscribed plan
    const priceId = subscription.items.data[0].price.id;

    // Determine the plan based on Price ID
    let plan;
    if (priceId === process.env.PRICE_ID_ADVANCED) {
      plan = "advanced";
    } else if (priceId === process.env.PRICE_ID_PREMIUM) {
      plan = "premium";
    } else {
      return res.status(400).json({ message: "Unknown subscription plan" });
    }

    // Find user by email
    const user = await User.findOne({ email: customerEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user already has an active subscription (other than the new one)
    if (
      user.subscription?.plan != "basic" &&
      user.subscription?.status === "active" &&
      user.subscription?.stripeSubscriptionId
    ) {
      // Cancel the existing subscription before assigning the new one
      try {
        await stripe.subscriptions.cancel(user.subscription.stripeSubscriptionId);
      } catch (error) {
        console.error("Error canceling previous subscription:", error.message);
      }
    }

    // Update user subscription in database
    user.subscription = {
      plan,
      status: "active",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      stripeSubscriptionId: subscriptionId,
    };

    await user.save();

    console.log(`User ${customerEmail} subscribed to ${plan} plan.`);
  }

  res.json({ received: true });
};

// Cancel Subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.subscription?.stripeSubscriptionId) {
      return res.status(400).json({ message: "Only Free subscription found" });
    }

    // Cancel Subscription in Stripe
    await stripe.subscriptions.cancel(user.subscription.stripeSubscriptionId);

    user.subscription = {
      plan: "free",
      status: "active",
      expiresAt: null,
      stripeSubscriptionId: null,
    };
    await user.save();

    res.status(200).json({ message: "Subscription cancelled successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error cancelling subscription", error: error.message });
  }
};
