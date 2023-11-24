import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div className="footer">
      <h5 className="text-center">All Right Reserved &copy; DonJay Auto Ltd 2021.</h5>
      <p className="text-center mt-3">
        <a href="https://www.facebook.com" target="_blank">Facebook</a>|<Link to="/contact">WhatsApp</Link>|
        <Link to="/policy">Instagram</Link>
      </p>
      <p className="text-center mt-3">
        <Link to="/about">About</Link>|<Link to="/contact">Contact</Link>|
        <Link to="/policy">Privacy Policy</Link>
      </p>
    </div>
  );
};

export default Footer;
