import React, { useState } from "react";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./auth.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });

      // Assuming response.data contains token and user info
      // Store token in localStorage

      if (response.data.message === "Login successful") {
        // localStorage.setItem("token", response.data.token); // No longer needed
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/achievers"); // Redirect to dashboard
      } else {
        setServerError("Login failed. No token received.");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setServerError(error.response.data.message);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center vh-100 bg-light">
      <Container style={{ maxWidth: "400px" }}>
        <Card className="login-card shadow-lg border-0">
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <h3 className="fw-bold color2">Welcome Back</h3>
              <p className="text-muted small">Sign in to your account</p>
            </div>

            {serverError && (
              <Alert variant="danger" className="text-center small py-2">
                {serverError}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="small fw-bold text-secondary">
                  Email Address
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  isInvalid={!!errors.email}
                  className="modern-input"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="formBasicPassword">
                <Form.Label className="small fw-bold text-secondary">
                  Password
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors({ ...errors, password: null });
                  }}
                  isInvalid={!!errors.password}
                  className="modern-input"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 py-2 fw-bold modern-btn"
                disabled={loading}
                style={{
                  background: "linear-gradient(45deg, #f97316, #ea580c)",
                  border: "none",
                }}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Sign In"}
              </Button>
            </Form>

            {/* Optional: Forgot password link */}
            <div className="text-center mt-3">
              <a href="#" className="text-muted small text-decoration-none">
                Forgot password?
              </a>
            </div>
          </Card.Body>
        </Card>

        <div className="text-center mt-4">
          <p className="text-muted small">
            &copy; {new Date().getFullYear()} KCE Spot Admin. All rights
            reserved.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;
