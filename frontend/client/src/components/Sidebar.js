// client/src/components/Sidebar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaSignInAlt,
  FaUserPlus,
  FaUserAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Backend token iptali vs. ekleyebilirsiniz
    setUser(null);
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h3>Anime Sözlük</h3>
      </div>

      <div className="sidebar-menu">
        {/* Herkese görünen Home */}
        <Link to="/" className="menu-item">
          <FaHome className="icon" />
          <span>Home</span>
        </Link>

        {/* Login yoksa Login ve Register göster */}
        {!user && (
          <>
            <Link to="/login" className="menu-item">
              <FaSignInAlt className="icon" />
              <span>Login</span>
            </Link>
            <Link to="/register" className="menu-item">
              <FaUserPlus className="icon" />
              <span>Register</span>
            </Link>
          </>
        )}

        {/* Login varsa Profile ve Logout göster */}
        {user && (
          <>
            <Link to="/profile" className="menu-item">
              <FaUserAlt className="icon" />
              <span>Profile</span>
            </Link>
            <div className="menu-item logout" onClick={handleLogout}>
              <FaSignOutAlt className="icon" />
              <span>Logout</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
