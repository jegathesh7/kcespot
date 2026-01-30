const express = require("express");
const router = express.Router();
const { createEvent, getEvents,updateEvent, deleteEvent, } = require("../controllers/eventController");


const upload = require("../middleware/upload");
const { adminOnly ,protect} = require("../middleware/authMiddleware");

router.post("/", adminOnly,protect,upload.single("eventImage"), createEvent);
router.get("/", protect,getEvents);
router.put("/:id", adminOnly,protect,upload.single("eventImage"), updateEvent);
router.delete("/:id", adminOnly,protect, deleteEvent);

module.exports = router;

