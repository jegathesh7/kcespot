const Event = require("../models/Event");

// CREATE
exports.createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json({ message: "Event saved", event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateEvent = async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id,req.body,{ new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE (Soft)
exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ message: "Event deleted successfully (Soft)" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};