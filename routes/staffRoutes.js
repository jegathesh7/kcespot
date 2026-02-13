const express = require("express");
const router = express.Router();
const {
  createStaff,
  getAllStaff,
  updateStaff,
  deleteStaff,
  exportStaffToExcel,
} = require("../controllers/staffController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, adminOnly, createStaff);
router.get("/", protect, adminOnly, getAllStaff);
router.get("/export", protect, adminOnly, exportStaffToExcel);
router.patch("/:id", protect, adminOnly, updateStaff);
router.delete("/:id", protect, adminOnly, deleteStaff);

module.exports = router;
