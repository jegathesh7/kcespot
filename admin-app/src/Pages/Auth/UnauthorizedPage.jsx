import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      <div className="mb-4 text-muted" style={{ opacity: 0.5 }}>
        <LockOutlinedIcon style={{ fontSize: "64px" }} />
      </div>
      <h2 className="fw-bold text-dark mb-2">Access Denied</h2>
      <p className="text-muted mb-4" style={{ maxWidth: "400px" }}>
        You do not have permission to view this page. Please contact your
        administrator if you believe this is an error.
      </p>
      <Button
        variant="primary"
        onClick={() => navigate(-1)}
        className="px-4 py-2"
        style={{ borderRadius: "8px" }}
      >
        Go Back
      </Button>
    </Container>
  );
}
