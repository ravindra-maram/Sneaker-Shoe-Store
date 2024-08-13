const Order = require("../models/Order");
const mongoose = require("mongoose");

// Get orders by user ID
// exports.getOrdersByUser = async (req, res) => {
//   const { userId } = req.params;
//   try {
//     const orders = await Order.find({ user: userId }).populate({
//       path: "products.product",
//       model: "Product",
//     });
//     res.status(200).json(orders);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching orders", error });
//   }
// };
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate(
      "products.product"
    );
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};

// Create a new order
exports.createOrder = async (req, res) => {
  const { userId, products, totalAmount } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !products.every((p) => mongoose.Types.ObjectId.isValid(p.product))
  ) {
    return res.status(400).json({ message: "Invalid user ID or product ID" });
  }

  try {
    const newOrder = new Order({
      user: userId,
      products,
      totalAmount,
      orderDate: new Date(),
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
};
