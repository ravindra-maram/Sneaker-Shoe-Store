const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    const { product, user, rating, text } = req.body;
    const files = req.files;

    const images = files
      ? files.map((file) => `/uploads/${file.filename}`)
      : [];

    const newComment = new Comment({
      product,
      user,
      rating,
      text,
      images,
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error saving comment:", error);
    res.status(500).json({ message: "Failed to save comment" });
  }
});

module.exports = router;

// Get comments for a specific product
router.get("/product/:productId", async (req, res) => {
  try {
    const comments = await Comment.find({
      product: req.params.productId,
    }).populate("user");
    res.status(200).json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: err.message });
  }
});

// Get comments for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const comments = await Comment.find({ user: req.params.userId }).populate(
      "product"
    );
    res.status(200).json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
