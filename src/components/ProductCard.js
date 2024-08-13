import React from "react";
import { Button, Card } from "react-bootstrap";
import { useThemeHook } from "../Globals/ThemeProvider";
import { useCart } from "react-use-cart";
import { BsCartPlus } from "react-icons/bs";
import { Link } from "react-router-dom";
import "./ProductCard.css"; // Ensure you import the CSS file

const ProductCard = (props) => {
  let { image, price, title, _id } = props.data;
  const [theme] = useThemeHook();
  const { addItem } = useCart();

  const addToCart = async () => {
    const userId = JSON.parse(sessionStorage.getItem("userDetails"))._id;

    // Adding item to cart in frontend and database
    addItem({ ...props.data, id: _id });

    try {
      await fetch("http://localhost:8081/api/carts/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          products: [
            {
              product: _id,
              quantity: 1,
            },
          ],
        }),
      });
      alert(`${title} has been added to your cart!`);
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  return (
    <Card
      style={{ width: "18rem", height: "auto" }}
      className={`product-card ${
        theme ? "bg-light-black text-light" : "bg-light text-black"
      } text-center p-0 overflow-hidden shadow mx-auto mb-4`}
    >
      <Link to={`/product-details/${_id}`}>
        <div
          style={{
            background: "white",
            height: "15rem",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "inherit",
          }}
        >
          <div style={{ width: "100%", height: "100%" }}>
            <Card.Img variant="top" src={image} className="img-fluid" />
          </div>
        </div>
      </Link>
      <Card.Body>
        <Card.Title
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </Card.Title>
        <Card.Title>
          $ <span className="h3">{price}</span>
        </Card.Title>
        <Button
          onClick={addToCart}
          className={`${
            theme ? "bg-dark-primary text-black" : "bg-light-primary"
          } d-flex align-item-center m-auto border-0`}
        >
          <BsCartPlus size="1.8rem" />
          Add to cart
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
