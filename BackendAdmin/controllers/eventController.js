const Event = require("../models/Event");


exports.createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json({ message: "Event saved", event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getEvents = async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });
  res.json(events);
};
