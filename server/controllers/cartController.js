const Cart = require("../models/Cart");

// Get cart for logged-in user
exports.getCartByUser = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId }).populate(
      "products.product"
    );
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update cart items quantity
exports.updateCart = async (req, res) => {
  const { userId, products } = req.body;
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { products },
      { new: true, upsert: true }
    );
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(400).json({ message: "Failed to update cart" });
  }
};

// Clear cart after successful payment
exports.clearCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { products: [] },
      { new: true }
    );
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error });
  }
};
