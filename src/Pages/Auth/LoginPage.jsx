import React, { useState } from "react";
import { Container, Card, Form, Button, Spinner } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axios";
import "./auth.css";
import Swal from "sweetalert2";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("sessionExpired")) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });

      Toast.fire({
        icon: "warning",
        title: "Session Expired",
        text: "Please login again to continue.",
      });

      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);

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

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.data.message === "Login successful") {
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Optional: Show success alert before redirecting
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "Signed in successfully",
        });

        navigate("/achievers"); // Redirect to dashboard
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "No token received.",
          confirmButtonColor: "#f97316",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      let errorMsg = "Something went wrong. Please try again.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMsg = error.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Login Error",
        text: errorMsg,
        confirmButtonColor: "#f97316",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center">
      <Container>
        <Card className="login-card shadow-lg border-0">
          <Card.Body>
            <div className="text-center mb-4">
              {/* Optional: Logo Placeholder */}
              <div className="mb-4">
                <div
                  style={{
                    background: "rgba(249, 115, 22, 0.1)",
                    padding: "12px",
                    borderRadius: "12px",
                    display: "inline-block",
                  }}
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
              </div>
              <h3 className="login-title">Welcome Back</h3>
              <p className="login-subtitle">
                Enter your credentials to access the admin panel.
              </p>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="form-label-custom">
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
                <Form.Label className="form-label-custom">Password</Form.Label>
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
                className="modern-btn"
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Sign In"}
              </Button>
            </Form>

            {/* Optional: Forgot password link */}
            <div className="text-center">
              <a href="#" className="forgot-password-link">
                Forgot password?
              </a>
            </div>
          </Card.Body>
        </Card>

        <div className="text-center mt-4">
          <p className="login-footer">
            &copy; {new Date().getFullYear()} KCE Spot Admin. All rights
            reserved.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;
