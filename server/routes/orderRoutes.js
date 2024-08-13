const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/user/:userId", orderController.getOrdersByUser);
router.post("/", orderController.createOrder);

module.exports = router;
