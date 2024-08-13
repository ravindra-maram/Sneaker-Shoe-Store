import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const CommentForm = ({ productId, userId, onCommentAdded }) => {
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("product", productId);
    formData.append("user", userId);
    formData.append("rating", rating);
    formData.append("text", text);
    images.forEach((image, index) => {
      formData.append(`images`, image);
    });

    try {
      const response = await fetch("http://localhost:8081/api/comments", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const newComment = await response.json();
        onCommentAdded(newComment);
        setText("");
        setRating(5);
        setImages([]);
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Rating</Form.Label>
        <Form.Control
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          min="1"
          max="5"
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Comment</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Images</Form.Label>
        <Form.Control type="file" multiple onChange={handleImageChange} />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit Comment
      </Button>
    </Form>
  );
};

export default CommentForm;
