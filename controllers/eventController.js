const Event = require("../models/Event.js");
// CREATE event
exports.createEvent = async (req, res) => {
  try {
    const entryData = { ...req.body };
    if (req.file) {
      entryData.eventImage = req.file.path; // Store file path
    }
    const event = new Event(entryData);
    await event.save();
    res.status(201).json({ message: "Event saved", event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all events with Pagination, Search, and Filter
exports.getEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", campus = "" } = req.query;

    const query = { isDeleted: false };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { campus: { $regex: search, $options: "i" } },
      ];
    }

    if (campus) {
      query.campus = { $regex: `^${campus}$`, $options: "i" };
    }

    const count = await Event.countDocuments(query);
    const events = await Event.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      data: events,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalEvents: count,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.eventImage = req.file.path;
    }

    const updated = await Event.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE (Soft Delete)
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    await Event.findByIdAndUpdate(id, { isDeleted: true });
    res.json({ message: "Event deleted successfully (Soft)" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};