const express = require("express");
const router = express.Router();

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { savePushToken } = require("../controllers/notificationController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// 🔐 ADMIN ACCESS ONLY
router.get("/", protect, adminOnly, getUsers);
router.post("/", protect, adminOnly, createUser);
router.put("/:id", protect, adminOnly, updateUser);
router.delete("/:id", protect, adminOnly, deleteUser);
router.post("/save-push-token", protect, savePushToken);


module.exports = router;