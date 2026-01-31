const express = require("express");
const router = express.Router();
const {
  createAchiever,
  getAchievers,
  updateAchiever,
  deleteAchiever,
  updateReaction,
} = require("../controllers/achieverController");

const upload = require("../middleware/upload");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, adminOnly, upload.any(), createAchiever);
router.get("/", protect, getAchievers);
router.put("/:id", protect, adminOnly, upload.any(), updateAchiever);
router.delete("/:id", protect, adminOnly, deleteAchiever);
router.patch("/reaction/:id", protect, updateReaction);

module.exports = router;
