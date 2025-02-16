import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          SmartStashAI
        </Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/crypto" className="navbar-link">Crypto</Link>
          <Link to="/about" className="navbar-link">About Us</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
