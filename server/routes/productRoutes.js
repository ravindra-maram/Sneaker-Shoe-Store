const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const Product = require("../models/Product");

// Get product by ID
router.get("/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", productController.getAllProducts);
router.post("/", productController.createProduct);

module.exports = router;
