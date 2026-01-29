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

// GET all events with Pagination, Search, and Filter
export const getEvents = async (req, res) => {
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

// DELETE (Soft Delete)
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    await Event.findByIdAndUpdate(id, { isDeleted: true });
    res.json({ message: "Event deleted successfully (Soft)" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};