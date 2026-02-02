import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Container, Nav, Image, Dropdown } from "react-bootstrap";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import logo from "../assets/logo.png";
import "../styles/header.css";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirect to login
    navigate("/login");
  };

  // Get user info from local storage (optional, for display)
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Admin User",
    email: "admin@kce.ac.in",
  };

  return (
    <>
      <Navbar bg="white" expand="lg" className="shadow-sm mb-4 py-3">
        <Container>
          <Navbar.Brand href="/" className="d-flex align-items-center gap-3">
            <img
              src={logo}
              alt="Karpagam Logo"
              height="50"
              className="d-inline-block align-top"
            />
            <span
              className="fw-bold color1 d-none d-sm-block"
              style={{ fontSize: "1.25rem" }}
            >
              Karpagam Spot
            </span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="white"
                id="dropdown-basic"
                className="d-flex align-items-center border-0 p-0 shadow-none"
              >
                <div className="text-end me-3 d-none d-lg-block">
                  <div className="fw-bold small">
                    {user.name || "Admin User"}
                  </div>
                  <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                    {user.email || "admin@kce.ac.in"}
                  </div>
                </div>
                <AccountCircleIcon fontSize="large" className="text-primary" />
              </Dropdown.Toggle>

              <Dropdown.Menu
                className="shadow-sm border-0 mt-2"
                style={{ borderRadius: "12px", minWidth: "200px" }}
              >

                <Dropdown.Item
                  onClick={handleLogout}
                  className="d-flex align-items-center gap-2 py-2 px-3 text-danger"
                >
                  <LogoutIcon fontSize="small" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
