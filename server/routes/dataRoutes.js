const express = require("express");
const router = express.Router();
const dataController = require("../controllers/dataController");

router.post("/load-data", dataController.loadInitialData);

module.exports = router;
