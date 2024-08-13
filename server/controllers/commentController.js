const Comment = require("../models/Comment");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Add a new comment
exports.addComment = [
  upload.array("images"),
  async (req, res) => {
    const { product, user, rating, text } = req.body;
    const images = req.files.map((file) => `/uploads/${file.filename}`);

    try {
      const newComment = new Comment({ product, user, rating, text, images });
      await newComment.save();
      res.status(201).json(newComment);
    } catch (error) {
      res.status(500).json({ message: "Error adding comment", error });
    }
  },
];

// Get comments by user ID
exports.getCommentsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const comments = await Comment.find({ user: userId })
      .populate("product")
      .populate("user");
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching comments", error });
  }
};

// Get comments by product ID
exports.getCommentsByProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const comments = await Comment.find({ product: productId })
      .populate("product")
      .populate("user");
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching comments", error });
  }
};
