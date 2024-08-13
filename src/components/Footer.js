import React, { useContext } from "react";
import { ThemeContext } from "../Globals/ThemeProvider";
import "./Footer.css";

const Footer = () => {
  const { theme } = useContext(ThemeContext);
  const footerClass = theme ? "footer-custom dark" : "footer-custom light";

  return (
    <footer className={footerClass}>
      &copy; All Rights Reserved By Ravindra Reddy Maram⚡
    </footer>
  );
};

export default Footer;
