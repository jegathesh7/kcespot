import React from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Container, Nav, Image } from "react-bootstrap";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import logo from "../assets/logo.png";
import "../styles/Header.css"; // Keeping for safety, but overriding structure

function Header() {
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
            <span className="fw-bold text-primary d-none d-sm-block" style={{ fontSize: '1.25rem' }}>
              Karpagam Spot <span className="text-secondary small fw-normal">| Admin Panel</span>
            </span>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <div className="d-flex align-items-center mt-3 mt-lg-0">
               <div className="text-end me-3 d-none d-lg-block">
                  <div className="fw-bold small">Admin User</div>
                  <div className="text-muted" style={{fontSize: '0.75rem'}}>admin@kce.ac.in</div>
               </div>
               <AccountCircleIcon fontSize="large" className="text-primary" />
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;