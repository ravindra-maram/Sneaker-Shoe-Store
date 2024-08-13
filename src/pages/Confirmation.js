import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Confirmation.css";

const Confirmation = () => {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate("/");
  };

  return (
    <Container className="confirmation-container">
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <div className="confirmation-icon">
            <div className="tick-circle"></div>
          </div>
          <h2 className="confirmation-title mt-4">
            Thank you for your purchase!
          </h2>
          <p className="confirmation-message">
            Your order has been successfully processed.
          </p>
          <Button
            variant="success"
            className="confirmation-button mt-4"
            onClick={handleContinueShopping}
          >
            Continue Shopping
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Confirmation;
