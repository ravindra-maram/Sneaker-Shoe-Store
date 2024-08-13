const Product = require("../models/Product");
const data = require("../data");

// load all products into database
exports.loadInitialData = async () => {
  try {
    await Product.deleteMany(); // Clear the collection
    await Product.insertMany(data);
    console.log("Data loaded successfully");
  } catch (error) {
    console.error("Failed to load data", error);
  }
};
