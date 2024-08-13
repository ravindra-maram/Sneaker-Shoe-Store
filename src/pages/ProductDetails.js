import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useThemeHook } from "../Globals/ThemeProvider";
import Lightbox from "react-lightbox-component";
import "react-lightbox-component/build/css/index.css";
import { useParams } from "react-router-dom";
import { useCart } from "react-use-cart";
import { BsCartPlus } from "react-icons/bs";
import CommentForm from "../components/CommentForm";
import "./ProductDetails.css"; // Ensure this line is present

const ProductDetails = () => {
  const [productData, setProductData] = useState({});
  const [comments, setComments] = useState([]);
  const [theme] = useThemeHook();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const { productId } = useParams();
  const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/api/products/${productId}`
        );
        if (response.ok) {
          const data = await response.json();
          setProductData(data);
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

  const addToCart = () => {
    addItem({ ...productData, id: productData._id }, quantity);
    alert(`${productData.title} has been added to your cart!`);
  };

  if (!productData || !productData._id) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center mt-5">
        <Col xs={10} md={7} lg={5} className="p-0">
          <div className="product-image-container">
            <img src={productData.image} alt={productData.title} />
          </div>
        </Col>
        <Col
          xs={10}
          md={7}
          lg={7}
          className={`${theme ? "text-light" : "text-black"} product-details`}
        >
          <h1>{productData.title}</h1>
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(e.target.value)}
            />
          </Form.Group>
          <Button
            onClick={addToCart}
            className={
              theme ? "bg-dark-primary text-black" : "bg-light-primary"
            }
            style={{ borderRadius: "0", border: 0 }}
          >
            <BsCartPlus size="1.8rem" />
            Add to cart
          </Button>
          <br />
          <b
            className={`${
              theme ? "text-dark-primary" : "text-light-primary"
            } h4 mt-3 d-block`}
          >
            $ {productData.price}
          </b>
          <br />
          <b className="h5">4.1 ⭐</b>
          <p className="mt-3 h5" style={{ opacity: "0.8", fontWeight: "400" }}>
            {productData.description}
          </p>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col>
          <h3>Comments</h3>
          {userDetails && (
            <CommentForm
              productId={productId}
              userId={userDetails._id}
              onCommentAdded={handleCommentAdded}
            />
          )}
          <div>
            {comments.map((comment) => (
              <div key={comment._id} className="mt-3">
                <p>
                  <strong>{comment.user.username}</strong> rated it{" "}
                  {comment.rating}/5
                </p>
                <p>{comment.text}</p>
                {comment.images && comment.images.length > 0 && (
                  <div>
                    {comment.images.map((image, index) => (
                      <img
                        key={index}
                        src={`http://localhost:8081/${image}`}
                        alt={`Comment image ${index + 1}`}
                        className="comment-image"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetails;
