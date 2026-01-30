const express = require("express");
const router = express.Router();

const {
  register,
  verifyRegistrationOtp,
  resendRegistrationOtp,
  login,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
} = require("../controllers/authController");

// Registration Flow
router.post("/register", register);
router.post("/verify-registration-otp", verifyRegistrationOtp);
router.post("/resend-registration-otp", resendRegistrationOtp);

// Login
router.post("/login", login);

// Password Reset Flow
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

module.exports = router;