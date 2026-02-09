const express = require("express");
const router = express.Router();
const { createStaff, getAllStaff } = require("../controllers/staffController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, adminOnly, createStaff);
router.get("/", protect, adminOnly, getAllStaff);

module.exports = router;
