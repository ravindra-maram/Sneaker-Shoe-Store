import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useCart } from "react-use-cart";
import "./Checkout.css"; // Ensure you have this CSS file for styling

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ clientSecret, cartItems, cartTotal }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { emptyCart } = useCart(); // Use useCart to empty cart on frontend

  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleInputChange = (e) => {
    setShippingDetails({
      ...shippingDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    if (!clientSecret) {
      console.error("Client secret is missing.");
      return;
    }

    try {
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: shippingDetails.name,
            },
          },
        }
      );

      if (error) {
        console.error("Payment failed:", error.message);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Clear the cart on frontend
        emptyCart();

        // Redirect to the confirmation page
        window.location.href = "/confirmation";
      }
    } catch (error) {
      console.error("Payment processing error:", error);
    }
  };

  return (
    <Form onSubmit={handlePayment}>
      <h2>Shipping Information</h2>
      <Form.Group controlId="formName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          placeholder="Enter your name"
          value={shippingDetails.name}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formAddress">
        <Form.Label>Address</Form.Label>
        <Form.Control
          type="text"
          name="address"
          placeholder="Enter your address"
          value={shippingDetails.address}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formCity">
        <Form.Label>City</Form.Label>
        <Form.Control
          type="text"
          name="city"
          placeholder="Enter your city"
          value={shippingDetails.city}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formState">
        <Form.Label>State</Form.Label>
        <Form.Control
          type="text"
          name="state"
          placeholder="Enter your state"
          value={shippingDetails.state}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formZip">
        <Form.Label>ZIP Code</Form.Label>
        <Form.Control
          type="text"
          name="zip"
          placeholder="Enter your ZIP Code"
          value={shippingDetails.zip}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <h2 className="mt-5">Billing Information</h2>
      <div className="card-element-wrapper">
        <CardElement className="card-element" />
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={!stripe}
        className="mt-4 w-100"
      >
        Pay ${cartTotal}
      </Button>
    </Form>
  );
};

const Checkout = () => {
  const location = useLocation();
  const { cartItems, cartTotal, clientSecret } = location.state || {
    cartItems: [],
    cartTotal: 0,
    clientSecret: null,
  };

  return (
    <Elements stripe={stripePromise}>
      <Container className="checkout-container">
        <Row>
          <Col md={7} className="checkout-form">
            <CheckoutForm
              clientSecret={clientSecret}
              cartItems={cartItems}
              cartTotal={cartTotal}
            />
          </Col>

          <Col md={5} className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-content">
              {cartItems.map((item, index) => (
                <Row key={index} className="order-item mb-3">
                  <Col xs={4}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="img-fluid"
                    />
                  </Col>
                  <Col xs={8}>
                    <p className="item-title">{item.title}</p>
                    <p className="item-details">
                      {item.quantity} x ${item.price}
                    </p>
                  </Col>
                </Row>
              ))}
              <hr />
              <h4>Total: ${cartTotal}</h4>
            </div>
          </Col>
        </Row>
      </Container>
    </Elements>
  );
};

export default Checkout;
