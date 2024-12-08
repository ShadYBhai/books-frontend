import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./navbar.css";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        BookManager
      </div>
      <div className="nav-links">
        <a href="#" onClick={() => navigate("/")}>
          Home
        </a>
        <a href="#" onClick={() => navigate("/add")}>
          Add Book
        </a>
        <a href="#" onClick={() => navigate("/about")}>
          About
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
