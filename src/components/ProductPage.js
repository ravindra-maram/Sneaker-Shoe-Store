// components/ProductPage.js
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { useParams } from "react-router-dom";
import CommentForm from "./CommentForm";

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const userId = JSON.parse(sessionStorage.getItem("userDetails"))._id;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/api/products/${productId}`
        );
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          console.error("Failed to fetch product");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/api/comments/product/${productId}`
        );
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        } else {
          console.error("Failed to fetch comments");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchProduct();
    fetchComments();
  }, [productId]);

  const handleCommentAdded = (newComment) => {
    setComments([...comments, newComment]);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Row>
        <Col md={6}>
          <Image src={product.image} alt={product.title} fluid />
        </Col>
        <Col md={6}>
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Comments</h3>
          <CommentForm
            productId={productId}
            userId={userId}
            onCommentAdded={handleCommentAdded}
          />
          <div>
            {comments.map((comment) => (
              <div key={comment._id} className="mt-3">
                <p>
                  <strong>{comment.user.username}</strong> rated it{" "}
                  {comment.rating}/5
                </p>
                <p>{comment.text}</p>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductPage;
