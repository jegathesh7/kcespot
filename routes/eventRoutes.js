const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const upload = require("../middleware/upload");
const { adminOnly, protect } = require("../middleware/authMiddleware");

router.post("/", protect, adminOnly, upload.single("eventImage"), createEvent);
router.get("/", protect, getEvents);
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("eventImage"),
  updateEvent,
);
router.delete("/:id", protect, adminOnly, deleteEvent);

module.exports = router;
