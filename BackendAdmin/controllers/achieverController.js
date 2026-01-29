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

// READ (ALL)
exports.getAchievers = async (req, res) => {
  try {
    const achievers = await Achiever.find().sort({ createdAt: -1 });
    res.json(achievers);
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

// DELETE
exports.deleteAchiever = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAchiever = await Achiever.findByIdAndDelete(id);

    if (!deletedAchiever) {
      return res.status(404).json({ message: "Achiever not found" });
    }

    res.json({ message: "Achiever deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};