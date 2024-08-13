import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Tab,
  Nav,
  Form,
  Button,
  Image,
} from "react-bootstrap";
import { useThemeHook } from "../Globals/ThemeProvider";
import Heading from "../components/Heading";
import profilePic from "../assets/images/profile-picture.png";
import { FaClipboardList, FaUser, FaCommentDots } from "react-icons/fa";
import { GiWallet } from "react-icons/gi";
import { IoLocationSharp } from "react-icons/io5";
import "./Account.css";
import OrderCard from "../components/OrderCard";

const Account = () => {
  const [theme] = useThemeHook();
  const [userDetails, setUserDetails] = useState({});
  const [orders, setOrders] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const storedUserDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    if (storedUserDetails && storedUserDetails._id) {
      setUserDetails(storedUserDetails);
      fetchOrders(storedUserDetails._id); // Fetch orders for the user
      fetchComments(storedUserDetails._id); // Fetch comments for the user
    } else {
      console.error("User details not found in session storage");
    }
  }, []);

  const fetchOrders = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/orders/user/${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch orders", error);
      setOrders([]);
    }
  };

  const fetchComments = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/comments/user/${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch comments", error);
      setComments([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/users/${userDetails._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userDetails),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update user details");
      }
      const data = await response.json();
      sessionStorage.setItem("userDetails", JSON.stringify(data));
      alert("Details updated successfully!");
    } catch (error) {
      console.error("Failed to save changes", error);
    }
  };

  return (
    <Container className="py-5 mt-5">
      <Heading heading="My Account" />
      <Tab.Container defaultActiveKey="my-orders">
        <Row className="justify-content-evenly mt-4 p-1">
          <Col
            sm={3}
            className={`${
              theme ? "text-light bg-dark" : "text-black bg-light"
            } p-2 rounded h-100 mb-3 user-menu`}
          >
            <Row className="mb-3 py-2">
              <Col xs={3} className="pe-0">
                <Image
                  src={profilePic}
                  thumbnail
                  fluid
                  roundedCircle
                  className="p-0"
                />
              </Col>
              <Col xs={9} className="pt-1">
                <span>Hello,</span>
                <h4>{userDetails.firstname || "Customer"}</h4>
              </Col>
            </Row>
            <Nav variant="pills" className="flex-column">
              <Nav.Item className="mb-3">
                <Nav.Link eventKey="my-orders">
                  My Orders
                  <FaClipboardList size="1.4rem" />
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="mb-3">
                <Nav.Link eventKey="account-details">
                  Account Details
                  <FaUser size="1.4rem" />
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="mb-3">
                <Nav.Link eventKey="address">
                  Address
                  <IoLocationSharp size="1.4rem" />
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="mb-3">
                <Nav.Link eventKey="wallet">
                  Wallet
                  <GiWallet size="1.4rem" />
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="mb-3">
                <Nav.Link eventKey="comments">
                  Comments
                  <FaCommentDots size="1.4rem" />
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col
            sm={8}
            className={`${
              theme ? "text-light bg-dark" : "text-black bg-light"
            } p-2 rounded`}
          >
            <Tab.Content>
              <Tab.Pane eventKey="my-orders">
                <Heading heading="My Orders" size="h3" />
                {Array.isArray(orders) && orders.length > 0 ? (
                  orders.map((order) => {
                    // Check if order.products exists and is an array
                    if (order.products && Array.isArray(order.products)) {
                      return (
                        <OrderCard
                          key={order._id}
                          orderDate={new Date(
                            order.orderDate
                          ).toLocaleDateString()}
                          orderId={order._id}
                          title={order.products
                            .filter((p) => p && p.product && p.product.title) // Ensure each product and title exist
                            .map((p) => p.product.title)
                            .join(", ")}
                          img={
                            order.products[0] &&
                            order.products[0].product &&
                            order.products[0].product.image
                          }
                          deliveredDate={new Date().toLocaleDateString()} // Example date
                        />
                      );
                    } else {
                      return null; // Skip rendering if products array is invalid
                    }
                  })
                ) : (
                  <p>No orders found.</p>
                )}
              </Tab.Pane>
              <Tab.Pane eventKey="account-details">
                <Heading heading="Account details" size="h3" />
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstname"
                      value={userDetails.firstname || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastname"
                      value={userDetails.lastname || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={userDetails.email || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Button variant="primary" onClick={handleSaveChanges}>
                    Save Changes
                  </Button>
                </Form>
              </Tab.Pane>
              <Tab.Pane eventKey="address">
                <Heading heading="Address" size="h3" />
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={userDetails.address || ""}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Button variant="primary" onClick={handleSaveChanges}>
                    Save Changes
                  </Button>
                </Form>
              </Tab.Pane>
              <Tab.Pane eventKey="wallet">
                <Heading heading="Wallet" size="h3" />
              </Tab.Pane>
              <Tab.Pane eventKey="comments">
                <Heading heading="Comments" size="h3" />
                {Array.isArray(comments) && comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment._id} className="mt-3">
                      <p>
                        <strong>
                          {comment.product?.title || "Unknown Product"}
                        </strong>{" "}
                        rated it {comment.rating}/5
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
                  ))
                ) : (
                  <p>No comments found.</p>
                )}
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default Account;
