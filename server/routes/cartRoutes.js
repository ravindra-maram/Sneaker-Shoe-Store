const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.get("/:userId", cartController.getCartByUser);
// router.post("/", cartController.updateCart);
router.post("/update", cartController.updateCart);

module.exports = router;
