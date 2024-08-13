import React, { useState, useEffect } from "react";
import { Container, Row, Col, InputGroup, FormControl } from "react-bootstrap";
import { useThemeHook } from "../Globals/ThemeProvider";
import { BiSearch } from "react-icons/bi";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [theme] = useThemeHook();
  const [searchInput, setSearchInput] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col xs={10} md={7} lg={6} xl={4} className="mb-3 mx-auto text-center">
          <h1 className={theme ? "text-light my-5" : "text-black my-5"}>
            Search sneakers
          </h1>
          <InputGroup className="mb-3">
            <InputGroup.Text
              className={
                theme
                  ? "bg-black text-dark-primary"
                  : "bg-light text-light-primary"
              }
            >
              <BiSearch size="2rem" />
            </InputGroup.Text>
            <FormControl
              placeholder="Search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={
                theme ? "bg-light-black text-light" : "bg-light text-black"
              }
            />
          </InputGroup>
        </Col>
        <Row className="justify-content-center">
          {products
            .filter((product) =>
              product.title?.toLowerCase().includes(searchInput.toLowerCase())
            )
            .map((product) => (
              <ProductCard key={product._id} data={product} />
            ))}
        </Row>
      </Row>
    </Container>
  );
};

export default Home;
