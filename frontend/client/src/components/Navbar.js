// client/src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Anime Sözlük</Link>
      </div>
      <div className="navbar-menu">
        <Link to="/">Ana Sayfa</Link>
        {isLoggedIn ? (
          <>
            <Link to="/profile">Profil</Link>
            <button className="logout-button" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
