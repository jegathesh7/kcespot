const Achiever = require("../models/Achiever");

// CREATE
exports.createAchiever = async (req, res) => {
  try {
    const achiever = new Achiever(req.body);
    await achiever.save();
    res.status(201).json({ message: "Achiever saved", achiever });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ (ALL) with Pagination and Search
exports.getAchievers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", college = "" } = req.query;

    const query = { isDeleted: false };

    if (search) {

      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { college: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } } // Added description for completeness
      ];
    }

    if (college) {
      query.college = { $regex: `^${college}$`, $options: "i" };
    }

    const count = await Achiever.countDocuments(query);
    
    const achievers = await Achiever.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      data: achievers,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalItems: count,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateAchiever = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedAchiever = await Achiever.findByIdAndUpdate(
      id,
      req.body,
      { new: true } // return updated document
    );

    if (!updatedAchiever) {
      return res.status(404).json({ message: "Achiever not found" });
    }

    res.json({
      message: "Achiever updated successfully",
      achiever: updatedAchiever,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE (Soft Delete)
exports.deleteAchiever = async (req, res) => {
  try {
    const { id } = req.params;

    // Use findByIdAndUpdate to soft delete
    const deletedAchiever = await Achiever.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedAchiever) {
      return res.status(404).json({ message: "Achiever not found" });
    }

    res.json({ message: "Achiever deleted successfully (Soft Delete)" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};