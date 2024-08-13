import React from "react";
import { Button, Container, Col, Row, Table } from "react-bootstrap";
import { useCart } from "react-use-cart";
import { useThemeHook } from "../Globals/ThemeProvider";
import { BsCartCheck, BsCartX } from "react-icons/bs";
import "./Cart.css";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [theme] = useThemeHook();
  const {
    isEmpty,
    items,
    cartTotal,
    updateItemQuantity,
    removeItem,
    emptyCart,
  } = useCart();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    if (!userDetails || !userDetails._id) {
      alert("User not logged in");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8081/api/payment/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cartItems: items, userId: userDetails._id }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create Stripe session");
      }

      const { client_secret } = await response.json();
      if (client_secret) {
        navigate(`/checkout/${client_secret}`, {
          state: { cartItems: items, cartTotal, clientSecret: client_secret },
        });
      } else {
        console.error("Stripe session creation failed");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <Container className="py-4 mt-5">
      <h1
        className={`${
          theme ? "text-light" : "text-light-primary"
        } my-5 text-center`}
      >
        {isEmpty ? "Your Cart is Empty" : "My Cart"}
      </h1>
      <Row className="justify-content-center">
        <Table
          responsive="sm"
          striped
          bordered
          hover
          variant={theme ? "dark" : "light"}
          className="mb-5"
        >
          <tbody>
            {items.map((item, index) => {
              return (
                <tr key={index}>
                  <td>
                    <div
                      style={{
                        background: "white",
                        height: "8rem",
                        overflow: "hidden",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ padding: ".5rem" }}>
                        <img
                          src={item.image}
                          style={{ width: "8rem", display: "block" }}
                          alt={item.title}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <h6
                      style={{
                        whiteSpace: "nowrap",
                        width: "14rem",
                        overflow: "hidden",
                        textOverFlow: "ellipsis",
                      }}
                    >
                      {item.title}
                    </h6>
                  </td>
                  <td>$ {item.price}</td>
                  <td>Quantity ({item.quantity})</td>
                  <td>
                    <Button
                      onClick={() =>
                        updateItemQuantity(item.id, item.quantity - 1)
                      }
                      className="ms-2 bg-warning"
                    >
                      -
                    </Button>
                    <Button
                      onClick={() =>
                        updateItemQuantity(item.id, item.quantity + 1)
                      }
                      className="ms-2 bg-warning"
                    >
                      +
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => removeItem(item.id)}
                      className="ms-2"
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        {!isEmpty && (
          <Row
            style={{ position: "relative", bottom: 0 }}
            className={`${
              theme ? "bg-light-black text-light" : "bg-light text-black"
            } justify-content-center w-100`}
          >
            <Col className="py-2">
              <h4>Total Price: $ {cartTotal}</h4>
            </Col>
            <Col className="p-0" md={4}>
              <Button
                variant="danger"
                className="m-1"
                onClick={() => emptyCart()}
              >
                Clear Cart
                <BsCartX size="1.7rem" />
              </Button>
              <Button
                variant="success"
                className="m-2"
                onClick={handleCheckout}
              >
                Checkout
                <BsCartCheck size="1.7rem" />
              </Button>
            </Col>
          </Row>
        )}
      </Row>
    </Container>
  );
};

export default Cart;
