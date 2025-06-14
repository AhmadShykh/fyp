// src/pages/SubscriptionPlans.js
import axios from "axios";
import React, { useEffect, useState } from "react";

const plans = [
  { name: "basic", price: "Free", features: ["Limited scans"], color: "#ccc" },
  {
    name: "advanced",
    price: "$9.99/month",
    features: ["More scans", "Priority support"],
    color: "#00bcd4",
  },
  {
    name: "premium",
    price: "$19.99/month",
    features: ["Unlimited scans", "Advanced reporting"],
    color: "#8e44ad",
  },
];

const SubscriptionPlans = () => {
  const [loading, setLoading] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedPlan = localStorage.getItem("currentPlan");
    if (storedPlan) {
      setCurrentPlan(storedPlan);
    }
  }, []);

  const subscribe = async (plan) => {
    setLoading(plan);
    try {
      const res = await axios.post(
        "http://localhost:8080/api/subscription/subscribe",
        { plan },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        alert(res.data.message || "Subscribed successfully.");
      }
    } catch (err) {
      console.error(err);
      alert("Subscription failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Choose Your Plan</h2>
      <div className="row justify-content-center">
        {plans.map((plan) => (
          <div key={plan.name} className="col-md-3 mx-2">
            <div
              className="card text-center"
              style={{ borderColor: plan.color }}
            >
              <div
                className="card-header"
                style={{ backgroundColor: plan.color, color: "white" }}
              >
                <h4>{plan.name.toUpperCase()}</h4>
              </div>
              <div className="card-body">
                <h5>{plan.price}</h5>
                <ul className="list-unstyled">
                  {plan.features.map((f, idx) => (
                    <li key={idx}>{f}</li>
                  ))}
                </ul>
                <button
                  className="btn btn-primary"
                  onClick={() => subscribe(plan.name)}
                  disabled={loading === plan.name || currentPlan === plan.name}
                >
                  {currentPlan === plan.name
                    ? "Current Plan"
                    : loading === plan.name
                    ? "Processing..."
                    : "Subscribe"}
                </button>
                {currentPlan === plan.name && (
                  <p className="text-success mt-2">
                    You are currently on this plan
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
