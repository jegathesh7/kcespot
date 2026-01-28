import React from "react";
import { NavLink } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import logo from "../assets/logo.png";
import "../styles/Header.css";

function Header() {
  return (
    <>
      {/* Top Header */}
      <header className="app-header">
        <div className="header-left">
          <img src={logo} alt="Karpagam Logo" className="header-logo" />
          <h1>Karpagam Spot – Admin Panel</h1>
        </div>

        <div className="header-right">
          <AccountCircleIcon className="profile-icon" />
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="nav-tabs">
        <NavLink
          to="/achievers"
          className={({ isActive }) => (isActive ? "tab active" : "tab")}
        >
          Achievers
        </NavLink>

        <NavLink
          to="/events"
          className={({ isActive }) => (isActive ? "tab active" : "tab")}
        >
          Events
        </NavLink>
      </nav>
    </>
  );
}

export default Header;