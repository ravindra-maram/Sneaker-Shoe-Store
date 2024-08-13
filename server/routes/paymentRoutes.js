const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Cart = require("../models/Cart");
const Order = require("../models/Order");

router.post("/create-checkout-session", async (req, res) => {
  const { cartItems, userId } = req.body;

  try {
    // Logging the incoming data for debugging
    console.log("Received cartItems:", cartItems);
    console.log("Received userId:", userId);

    // Check if cartItems and userId are valid
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    if (!userId) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    // Create a payment intent with the total amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: cartItems.reduce(
        (total, item) => total + item.price * item.quantity * 100,
        0
      ),
      currency: "usd",
      payment_method_types: ["card"],
    });

    // Save the order details to the database
    const order = new Order({
      user: userId,
      products: cartItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      })),
      totalAmount: cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    });

    await order.save();

    // Clear the user's cart after successful payment
    await Cart.findOneAndUpdate({ user: userId }, { products: [] });

    // Respond with the client secret of the payment intent
    res.json({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating Stripe payment intent:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
