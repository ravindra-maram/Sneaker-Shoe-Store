// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import LogIn from "./Auth/LogIn";
import Register from "./Auth/Register";
import Account from "./pages/Account";
import Footer from "./components/Footer";
import { useThemeHook } from "./Globals/ThemeProvider";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";

console.log(
  "Stripe Publishable Key:",
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
);
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function App() {
  const [theme] = useThemeHook();
  return (
    <Elements stripe={stripePromise}>
      <main
        className={theme ? "bg-black" : "bg-light-2"}
        style={{ height: "100vh", overflowY: "auto", paddingBottom: "60px" }}
      >
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/my-account" element={<Account />} />
            <Route path="/log-in" element={<LogIn />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/product-details/:productId"
              element={<ProductDetails />}
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout/:sessionId" element={<Checkout />} />
            {/* <Route path="/checkout/:clientSecret" element={<Checkout />} /> */}
            <Route path="/confirmation" element={<Confirmation />} />
          </Routes>
          <Footer />
        </Router>
      </main>
    </Elements>
  );
}

export default App;
