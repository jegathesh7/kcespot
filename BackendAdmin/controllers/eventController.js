import Event from "../models/Event.js";

// CREATE event
export const createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json({ message: "Event saved", event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Event.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    await Event.findByIdAndDelete(id);
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};