const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: false,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
