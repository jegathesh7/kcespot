const express = require("express");
const router = express.Router();
const {
  createStaff,
  getAllStaff,
  updateStaff,
  deleteStaff,
} = require("../controllers/staffController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, adminOnly, createStaff);
router.get("/", protect, adminOnly, getAllStaff);
router.patch("/:id", protect, adminOnly, updateStaff);
router.delete("/:id", protect, adminOnly, deleteStaff);

module.exports = router;
