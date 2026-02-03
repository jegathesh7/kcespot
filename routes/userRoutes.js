const express = require("express");
const router = express.Router();

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUser,
} = require("../controllers/userController");
const { savePushToken } = require("../controllers/notificationController");
const { protect, adminOnly } = require("../middleware/authMiddleware");


//common for all users
router.post("/get-me", protect, getUser);



// 🔐 ADMIN ACCESS ONLY
router.get("/", protect, adminOnly, getUsers);
router.post("/", protect, adminOnly, createUser);
router.patch("/:id", protect, updateUser);
router.delete("/:id", protect, adminOnly, deleteUser);
router.post("/save-push-token", protect, savePushToken);
router.post("/save-token", protect, savePushToken); // Alias for compatibility

module.exports = router;
