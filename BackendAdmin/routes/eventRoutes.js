const express = require("express");
const router = express.Router();
const { createEvent, getEvents,updateEvent, deleteEvent, } = require("../controllers/eventController");


const upload = require("../middleware/upload");

router.post("/", upload.single("eventImage"), createEvent);
router.get("/", getEvents);
router.put("/:id", upload.single("eventImage"), updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;

